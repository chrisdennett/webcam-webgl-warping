import React from "react";
import Draggable from "react-draggable";
import styled from "styled-components";

export const Corners = ({
  cornerCoords,
  setCornerCoords,
  maxX,
  maxY,
  scale,
}) => {
  const onCornerUpdate = (type, data) => {
    const { x, y } = data;
    const fracX = x / (maxX * scale);
    const fracY = y / (maxY * scale);

    const newData = { ...cornerCoords, [type]: [fracX, fracY] };
    setCornerCoords(newData);
  };

  const getPosition = (coord) => ({
    x: coord[0] * maxX * scale,
    y: coord[1] * maxY * scale,
  });
  return (
    <>
      {Object.entries(cornerCoords).map(([type, coord]) => (
        <Draggable
          key={type}
          position={getPosition(coord)}
          bounds={{
            left: 0,
            top: 0,
            right: maxX * scale,
            bottom: maxY * scale,
          }}
          onDrag={(e, data) => onCornerUpdate(type, data)}
          onStop={(e, data) => onCornerUpdate(type, data)}
        >
          <DragMarker />
        </Draggable>
      ))}
    </>
  );
};

const DragMarker = styled.div`
  position: absolute;
  height: 20px;
  width: 20px;
  margin-left: -10px;
  margin-top: -10px;
  background: red;
  border-radius: 10px;
  z-index: 1000;
`;
