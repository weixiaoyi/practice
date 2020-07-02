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
        cursor="move"
        onMouseDown={restPoint.onSelect}
        width={width}
        height={height}
        style={style}
        x={position.x}
        y={position.x}
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
                key={`${pointX}${pointY}`}
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
  const [mouseEnter, setMouseEnter] = useState(false);
  const [select, setSelect] = useState([]);

  const { shapes, selectedShapeId } = store;

  useEffect(() => {
    const square = new Square({
      size: {
        width: 100,
        height: 100,
      },
      position: {
        x: 10,
        y: 10,
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
      onMouseDown={() =>
        dispatch({
          type: "selectShape",
          payload: {
            id: "",
          },
        })
      }
    >
      {shapes.map((shape) => {
        const props = {
          ...shape,
          key: shape.id,
          onSelect: (e) => {
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
