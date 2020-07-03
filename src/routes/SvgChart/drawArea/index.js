import React, { useState, useEffect } from "react";
import { Square } from "../components";
import useStore from "../store";

function SquareShape(props) {
  const {
    id,
    size: { width, height },
    style,
    position,
    selectedShapeId,
    hoveredShapeId,
    isMoving,
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
        onMouseEnter={restPoint.onMouseEnter}
        onMouseLeave={restPoint.onMouseLeave}
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

      {(isMoving ? selectedShapeId === id : hoveredShapeId === id) && (
        <g>
          {restPoint.edgeCentreVertex.map(([pointX, pointY]) => {
            return (
              <circle
                pointerEvents="none"
                key={`${pointX}_${pointY}`}
                cx={pointX}
                cy={pointY}
                r={4}
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

  const { shapes, selectedShapeId, hoveredShapeId } = store;

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

    const square2 = new Square({
      size: {
        width: 100,
        height: 100,
      },
      position: {
        x: 300,
        y: 300,
      },
      style: {
        fill: "green",
      },
    });
    dispatch({
      type: "addShape",
      payload: {
        shape: square,
      },
    });
    dispatch({
      type: "addShape",
      payload: {
        shape: square2,
      },
    });
  }, [0]);

  const isMoving = moveStartClientPosition && moveStartClientPosition.length;

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
        if (isMoving) {
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
          selectedShapeId,
          hoveredShapeId,
          isMoving,
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
          onMouseEnter: (e) => {
            dispatch({
              type: "hoverShape",
              payload: {
                id: shape.id,
              },
            });
            e.stopPropagation();
          },
          onMouseLeave: (e) => {
            dispatch({
              type: "hoverShape",
              payload: {
                id: "",
              },
            });
            e.stopPropagation();
          },
        };
        return {
          square: <SquareShape {...props} />,
        }[shape.type];
      })}
    </svg>
  );
}

export default DrawArea;
