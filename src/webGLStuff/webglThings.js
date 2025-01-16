const vertexShaderSource = `
attribute vec2 a_texCoord;
attribute vec2 a_position;

uniform vec2 u_resolution;
varying vec2 v_texCoord;

void main(){
  gl_Position=vec4(a_position*vec2(1,-1),0,1);
  
  // pass the texCoord to the fragment shader
  // The GPU will interpolate this value between points
  v_texCoord=a_texCoord;
}
`;

const fragmentShaderSource = `
precision mediump float;

// our texture
uniform sampler2D u_image;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

void main() {
  // Look up a color from the texture.
  gl_FragColor = texture2D(u_image, v_texCoord);
}
`;
export const setupWebGL = ({
  gl,
  image,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
}) => {
  const cornersArr = [
    ...convertArrToFloats(topLeft),
    ...convertArrToFloats(topRight),
    ...convertArrToFloats(bottomLeft),
    ...convertArrToFloats(bottomLeft),
    ...convertArrToFloats(topRight),
    ...convertArrToFloats(bottomRight),
  ];

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );
  const program = createProgram(gl, vertexShader, fragmentShader);

  // look up where the vertex data needs to go.
  const positionLocation = gl.getAttribLocation(program, "a_position");
  const texcoordLocation = gl.getAttribLocation(program, "a_texCoord");
  // Create a buffer to put three 2d clip space points in
  const positionBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // prettier-ignore
  gl.bufferData(
    gl.ARRAY_BUFFER, 
    new Float32Array([
                  -1.0, -1.0,
                  1.0, -1.0,
                  -1.0,  1.0,
                  -1.0,  1.0,
                  1.0, -1.0,
                  1.0,  1.0,
                ]), gl.STATIC_DRAW);

  // provide texture coordinates for the rectangle.
  var texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  // prettier-ignore

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(cornersArr),
    gl.STATIC_DRAW
  );

  // Create a texture.
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  // lookup uniforms
  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

  // resizeCanvasToDisplaySize(gl.canvas);

  // Set the viewport to the full canvas size
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Turn on the position attribute
  gl.enableVertexAttribArray(positionLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  gl.vertexAttribPointer(
    positionLocation,
    2, // size
    gl.FLOAT, // type
    false, // normalize
    0, // stride
    0 // offset
  );

  // Turn on the teccord attribute
  gl.enableVertexAttribArray(texcoordLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

  gl.vertexAttribPointer(
    texcoordLocation,
    2, // size
    gl.FLOAT, // type
    false, // normalize
    0, // stride
    0 // offset
  );

  // set the resolution
  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

  // Draw the rectangle.
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 6;
  gl.drawArrays(primitiveType, offset, count);
};

export const mapPolygonToCanvas = ({
  gl,
  image,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
}) => {
  const cornersArr = [
    ...convertArrToFloats(topLeft),
    ...convertArrToFloats(topRight),
    ...convertArrToFloats(bottomLeft),
    ...convertArrToFloats(bottomLeft),
    ...convertArrToFloats(topRight),
    ...convertArrToFloats(bottomRight),
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cornersArr), gl.STATIC_DRAW);

  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle.
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 6;
  gl.drawArrays(primitiveType, offset, count);
};

const convertArrToFloats = (arr) => {
  return [arr[0].toFixed(4), arr[1].toFixed(4)];
};

const createShader = (gl, type, source) => {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
};

const createProgram = (gl, vertexShader, fragmentShader) => {
  if (!gl) return;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
};
