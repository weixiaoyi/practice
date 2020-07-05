import React, { useState, useEffect, useRef } from "react";
import { Square } from "../components";
import { Transform } from "./components";
import useStore from "../store";
import { zoomControlVertexConfig } from "../configs";
import { stopPropagation } from "../utils";

function SquareShape(props) {
  const {
    id,
    container,
    size: { width, height },
    style,
    position,
    selectedShapeId,
    hoveredShapeId,
    dragTargetElementType,
    ...restPoint
  } = props;
  return (
    <g>
      <Transform
        Ele="rect"
        container={container}
        cursor="move"
        width={width}
        height={height}
        style={style}
        x={position.x}
        y={position.y}
        onMouseDown={restPoint.shapeEventHandler.onMouseDown}
        onMouseEnter={restPoint.shapeEventHandler.onMouseEnter}
        onMouseLeave={restPoint.shapeEventHandler.onMouseLeave}
        moveable={{
          onMouseMove: restPoint.shapeEventHandler.onMouseMove,
        }}
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
          {restPoint.zoomControlVertex.map(([pointX, pointY], index) => {
            const [width, height] = [
              zoomControlVertexConfig.width,
              zoomControlVertexConfig.height,
            ];
            const directions = ["nw", "ne", "se", "sw"];
            return (
              <Transform
                Ele="rect"
                container={container}
                cursor={`${directions[index]}-resize`}
                key={index}
                x={pointX - width / 2}
                y={pointY - width / 2}
                width={width}
                height={height}
                style={{
                  stroke: "black",
                  fill: "white",
                }}
                onMouseDown={
                  restPoint.zoomControlVertexEventHandler.onMouseDown
                }
                moveable={{
                  onMouseMove: (e, data) => {
                    restPoint.zoomControlVertexEventHandler.onMouseMove(
                      e,
                      data,
                      directions[index]
                    );
                    stopPropagation(e)
                  },
                }}
              />
            );
          })}
        </g>
      )}

      {(dragTargetElementType === "shape"
        ? selectedShapeId === id
        : dragTargetElementType === "zoomControlVertex"
        ? false
        : hoveredShapeId === id) && (
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
  const [dragTargetElementType, setDragTargetElementType] = useState("");
  const [hoveredShapeId, setHoveredShapeId] = useState("");
  const container = useRef(null);

  const { shapes, selectedShapeId } = store;

  useEffect(() => {
    for (let i = 0; i < 100; i++) {
      const square = new Square({
        size: {
          width: 50,
          height: 50,
        },
        position: {
          x: Math.random() * ( 600 -10 + 1 ) + 10,
          y: Math.random() * ( 1000 -10 + 1 ) + 10,
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
    }
  }, []);

  return (
    <svg
      ref={container}
      id="jjj_"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="100%"
      height="100%"
      onMouseUp={(e) => {
        setDragTargetElementType("");
        stopPropagation(e)
      }}
      onMouseDown={(e) => {
        dispatch({
          type: "selectShape",
          payload: {
            id: "",
          },
        });
        stopPropagation(e)
      }}
    >
      {shapes.map((shape) => {
        const props = {
          ...shape,
          key: shape.id,
          selectedShapeId,
          hoveredShapeId,
          dragTargetElementType,
          shapeEventHandler: {
            onMouseDown: (e) => {
              setDragTargetElementType("shape");
              dispatch({
                type: "selectShape",
                payload: {
                  id: shape.id,
                },
              });
              stopPropagation(e)
            },
            onMouseMove: (e, data) => {
              const { distX, distY } = data;
              dispatch({
                type: "moveShape",
                payload: {
                  id: selectedShapeId,
                  distX,
                  distY,
                },
              });
              stopPropagation(e)
            },
            onMouseEnter: (e) => {
              setHoveredShapeId(shape.id);
              stopPropagation(e)
            },
            onMouseLeave: (e) => {
              setHoveredShapeId("");
              stopPropagation(e)
            },
          },
          zoomControlVertexEventHandler: {
            onMouseDown: (e) => {
              setDragTargetElementType("zoomControlVertex");
              stopPropagation(e)
            },
            onMouseMove: (e, data, direction) => {
              const { distX, distY } = data;
              dispatch({
                type: "zoomShape",
                payload: {
                  id: selectedShapeId,
                  direction,
                  distX,
                  distY,
                },
              });
              stopPropagation(e)
            },
          },
        };
        return {
          square: <SquareShape {...props} container={container.current} />,
        }[shape.type];
      })}
    </svg>
  );
}

export default DrawArea;
