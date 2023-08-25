import React, { useRef } from "react";
import Webcam from "react-webcam";
import { useAnimationFrame } from "./hooks/useAnimationFrame";

const videoConstraints = {
  width: 800,
  height: 600,
  facingMode: "user"
};

export const WebcamCapture = ({ onFrame }) => {
  const webcamRef = useRef(null);

  useAnimationFrame(frameTime => {
    if (!webcamRef) return;
    onFrame(webcamRef.current.getCanvas(), frameTime);
  });

  return (
    <>
      <Webcam
        audio={false}
        // style={{ position: "fixed", left: -10000 }}
        ref={webcamRef}
        mirrored={true}
        videoConstraints={videoConstraints}
      />
    </>
  );
};
