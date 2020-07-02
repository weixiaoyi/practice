import React, { useState, useEffect } from "react";
import { Square } from "../components";
import useStore from "../store";
import styles from "./index.module.scss";

function SquareShape(props) {
  const {
    id,
    size: { width, height },
    style,
    position,
    selectedShapeId,
    ...restPoint
  } = props;
  return (
    <g>
      <rect
        draggable="true"
        cursor="move"
        width={width}
        height={height}
        style={style}
        x={position.x}
        y={position.y}
        onMouseDown={restPoint.onMouseDown}
      />
      {selectedShapeId === id && (
        <g>
          <polygon
            pointerEvents="none"
            points={restPoint.zoomControlVertex
              .map(([pointX, pointY]) => `${pointX},${pointY}`)
              .join(" ")}
            style={{
              fill: "transparent",
              stroke: "purple",
              strokeWidth: 2,
            }}
          />
          {restPoint.zoomControlVertex.map(([pointX, pointY]) => {
            const [width, height] = [8, 8];
            return (
              <rect
                key={`${pointX}_${pointY}`}
                x={pointX - width / 2}
                y={pointY - width / 2}
                width={width}
                height={height}
                style={{
                  stroke: "black",
                  fill: "white",
                }}
              />
            );
          })}
        </g>
      )}
    </g>
  );
}

function DrawArea() {
  const [store, dispatch] = useStore();
  const [moveStartClientPosition, setMoveStartClientPosition] = useState([]);
  const [moveStartShapePosition, setMoveStartShapePosition] = useState([]);

  const { shapes, selectedShapeId } = store;

  useEffect(() => {
    const square = new Square({
      size: {
        width: 100,
        height: 100,
      },
      position: {
        x: 100,
        y: 100,
      },
      style: {
        fill: "red",
      },
    });
    dispatch({
      type: "addShape",
      payload: {
        shape: square,
      },
    });
  }, [0]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="100%"
      height="100%"
      onMouseDown={() => {
        dispatch({
          type: "selectShape",
          payload: {
            id: "",
          },
        });
      }}
      onMouseUp={() => {
        setMoveStartClientPosition([]);
        setMoveStartShapePosition([]);
      }}
      onMouseMove={(e) => {
        if (moveStartClientPosition && moveStartClientPosition.length) {
          const { clientX, clientY } = e.nativeEvent;
          const distX = clientX - moveStartClientPosition[0];
          const distY = clientY - moveStartClientPosition[1];
          dispatch({
            type: "editShapes",
            payload: {
              id: selectedShapeId,
              position: {
                x: moveStartShapePosition[0] + distX,
                y: moveStartShapePosition[1] + distY,
              },
            },
          });
        }
      }}
    >
      {shapes.map((shape) => {
        const props = {
          ...shape,
          key: shape.id,
          onMouseDown: (e) => {
            const { clientX, clientY } = e.nativeEvent;
            setMoveStartShapePosition([shape.position.x, shape.position.y]);
            setMoveStartClientPosition([clientX, clientY]);
            dispatch({
              type: "selectShape",
              payload: {
                id: shape.id,
              },
            });
            e.stopPropagation();
          },
          selectedShapeId,
        };
        return {
          square: <SquareShape {...props} />,
        }[shape.type];
      })}
    </svg>
  );
}

export default DrawArea;
