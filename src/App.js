import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import { WebcamCapture } from "./WebcamCapture";

import { mapPolygonToCanvas, setupWebGL } from "./webGLStuff/webglThings";
import { Corners } from "./comps/Corners";

const defaultCornerCoords = {
  topLeft: [0.0, 0.0],
  topRight: [1.0, 0.0],
  bottomLeft: [0.0, 1.0],
  bottomRight: [1.0, 1.0]
};

export default function App() {
  const canvasRef = useRef(null);
  const [webGLIsReady, setWebGLIsReady] = useState(false);
  const [srcCanvasWidth, setSrcCanvasWidth] = useState(null);
  const [srcCanvasHeight, setSrcCanvasHeight] = useState(null);
  const [cornerCoords, setCornerCoords] = useState(defaultCornerCoords);
  const [frameCanvas, setFrameCanvas] = useState(null);
  const [currFrame, setCurrFrame] = useState(0);

  const onFrame = (frameCanvas, frameTime) => {
    setFrameCanvas(frameCanvas);
    setCurrFrame(frameTime);
  };

  useEffect(() => {
    if (!frameCanvas) return;
    const screenCanvas = canvasRef.current;

    if (!srcCanvasWidth) {
      screenCanvas.width = frameCanvas.width;
      screenCanvas.height = frameCanvas.height;
      setSrcCanvasWidth(frameCanvas.width);
      setSrcCanvasHeight(frameCanvas.height);
    }

    const gl = canvasRef.current.getContext("webgl");

    if (webGLIsReady) {
      mapPolygonToCanvas({
        gl,
        image: frameCanvas,
        topLeft: cornerCoords.topLeft,
        topRight: cornerCoords.topRight,
        bottomLeft: cornerCoords.bottomLeft,
        bottomRight: cornerCoords.bottomRight
      });
    } else {
      setupWebGL({
        gl,
        image: frameCanvas,
        topLeft: cornerCoords.topLeft,
        topRight: cornerCoords.topRight,
        bottomLeft: cornerCoords.bottomLeft,
        bottomRight: cornerCoords.bottomRight
      });
      setWebGLIsReady(true);
    }
  }, [currFrame, cornerCoords]);

  return (
    <div>
      {srcCanvasWidth && srcCanvasHeight && (
        <Corners
          cornerCoords={cornerCoords}
          setCornerCoords={setCornerCoords}
          maxX={srcCanvasWidth}
          maxY={srcCanvasHeight}
        />
      )}

      <WebcamCapture onFrame={onFrame} />

      <canvas ref={canvasRef} />
    </div>
  );
}
