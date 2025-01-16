import React, { useState, useEffect, useRef } from "react";
import "./styles.css";

import { mapPolygonToCanvas, setupWebGL } from "./webGLStuff/webglThings";
import { Corners } from "./comps/Corners";

const defaultCornerCoords = {
  topLeft: [0.0, 0.0],
  topRight: [1.0, 0.0],
  bottomLeft: [0.0, 1.0],
  bottomRight: [1.0, 1.0],
};

export default function App() {
  const srcCanvasRef = useRef(null);
  const canvasRef = useRef(null);
  const [webGLIsReady, setWebGLIsReady] = useState(false);
  const [srcCanvasWidth, setSrcCanvasWidth] = useState(null);
  const [srcCanvasHeight, setSrcCanvasHeight] = useState(null);
  const [cornerCoords, setCornerCoords] = useState(defaultCornerCoords);
  const [frameCanvas, setFrameCanvas] = useState(null);
  const [uploadedImage, setUploadedImage] = useState("/test-pic.jpg");
  const [scale, setScale] = useState(1);

  const loadImageToCanvas = (imageSrc) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = srcCanvasRef.current;
      if (canvas) {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        setSrcCanvasWidth(img.width);
        setSrcCanvasHeight(img.height);

        // Calculate scale to fit the image within a 800x600 viewport
        const maxWidth = 800;
        const maxHeight = 600;
        const scaleX = maxWidth / img.width;
        const scaleY = maxHeight / img.height;
        setScale(Math.min(scaleX, scaleY, 1));

        setCornerCoords(defaultCornerCoords);
        setFrameCanvas(canvas);
      }
    };
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        loadImageToCanvas(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    loadImageToCanvas(uploadedImage);
  }, [uploadedImage]);

  useEffect(() => {
    if (!frameCanvas) return;
    const screenCanvas = canvasRef.current;

    if (!srcCanvasWidth) {
      screenCanvas.width = frameCanvas.width;
      screenCanvas.height = frameCanvas.height;
    }

    const gl = canvasRef.current.getContext("webgl");

    if (webGLIsReady) {
      mapPolygonToCanvas({
        gl,
        image: frameCanvas,
        topLeft: cornerCoords.topLeft,
        topRight: cornerCoords.topRight,
        bottomLeft: cornerCoords.bottomLeft,
        bottomRight: cornerCoords.bottomRight,
      });
    } else {
      setupWebGL({
        gl,
        image: frameCanvas,
        topLeft: cornerCoords.topLeft,
        topRight: cornerCoords.topRight,
        bottomLeft: cornerCoords.bottomLeft,
        bottomRight: cornerCoords.bottomRight,
      });
      setWebGLIsReady(true);
    }
  }, [cornerCoords, srcCanvasWidth]);

  return (
    <div className="app-container">
      <div className="canvas-container">
        <div
          className="source-canvas-wrapper"
          style={{
            position: "relative",
            width: srcCanvasWidth ? `${srcCanvasWidth * scale}px` : "auto",
            height: srcCanvasHeight ? `${srcCanvasHeight * scale}px` : "auto",
          }}
        >
          {srcCanvasWidth && srcCanvasHeight && (
            <Corners
              cornerCoords={cornerCoords}
              setCornerCoords={setCornerCoords}
              maxX={srcCanvasWidth}
              maxY={srcCanvasHeight}
              scale={scale}
            />
          )}
          <canvas
            className="source-canvas"
            ref={srcCanvasRef}
            style={{
              border: "blue solid 2px",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
        <canvas
          className="output-canvas"
          ref={canvasRef}
          style={{
            border: "red solid 2px",
            width: srcCanvasWidth ? `${srcCanvasWidth * scale}px` : "auto",
            height: srcCanvasHeight ? `${srcCanvasHeight * scale}px` : "auto",
          }}
        />
      </div>
      <div className="controls">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
    </div>
  );
}
