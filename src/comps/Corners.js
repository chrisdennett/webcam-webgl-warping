import React from "react";
import Draggable from "react-draggable";
import styled from "styled-components";

export const Corners = ({ cornerCoords, setCornerCoords, maxX, maxY }) => {
  const onCornerUpdate = (type, data) => {
    const { x, y } = data;
    const fracX = x / maxX;
    const fracY = y / maxY;

    const newData = { ...cornerCoords, [type]: [fracX, fracY] };

    setCornerCoords(newData);
  };

  return (
    <>
      <Draggable
        defaultPosition={{ x: 0, y: 0 }}
        bounds={{ left: 0, top: 0, right: maxX, bottom: maxY }}
        onStart={(e, data) => onCornerUpdate("topLeft", data)}
        onDrag={(e, data) => onCornerUpdate("topLeft", data)}
        onStop={(e, data) => onCornerUpdate("topLeft", data)}
      >
        <DragMarker />
      </Draggable>

      <Draggable
        defaultPosition={{ x: maxX, y: 0 }}
        bounds={{ left: 0, top: 0, right: maxX, bottom: maxY }}
        onStart={(e, data) => onCornerUpdate("topRight", data)}
        onDrag={(e, data) => onCornerUpdate("topRight", data)}
        onStop={(e, data) => onCornerUpdate("topRight", data)}
      >
        <DragMarker />
      </Draggable>

      <Draggable
        defaultPosition={{ x: 0, y: maxY }}
        bounds={{ left: 0, top: 0, right: maxX, bottom: maxY }}
        onStart={(e, data) => onCornerUpdate("bottomLeft", data)}
        onDrag={(e, data) => onCornerUpdate("bottomLeft", data)}
        onStop={(e, data) => onCornerUpdate("bottomLeft", data)}
      >
        <DragMarker />
      </Draggable>

      <Draggable
        defaultPosition={{ x: maxX, y: maxY }}
        bounds={{ left: 0, top: 0, right: maxX, bottom: maxY }}
        onStart={(e, data) => onCornerUpdate("bottomRight", data)}
        onDrag={(e, data) => onCornerUpdate("bottomRight", data)}
        onStop={(e, data) => onCornerUpdate("bottomRight", data)}
      >
        <DragMarker />
      </Draggable>
    </>
  );
};

const DragMarker = styled.div`
  position: fixed;
  height: 30px;
  width: 30px;
  margin-left: -15px;
  margin-top: -15px;
  background: red;
  border-radius: 15px;
   z-index: 1;
`;
