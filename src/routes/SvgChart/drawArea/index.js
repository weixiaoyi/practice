import React, { useState, useEffect } from "react";
import { Square } from "../components";
import useStore from "../store";
import { zoomControlVertexConfig } from "../configs";

function SquareShape(props) {
  const {
    id,
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
      <rect
        draggable="true"
        cursor="move"
        width={width}
        height={height}
        style={style}
        x={position.x}
        y={position.y}
        onMouseDown={restPoint.shapeEventHandler.onMouseDown}
        onMouseEnter={restPoint.shapeEventHandler.onMouseEnter}
        onMouseLeave={restPoint.shapeEventHandler.onMouseLeave}
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
            const [width, height] = [zoomControlVertexConfig.width, zoomControlVertexConfig.height];
            const directions = ["nw", "ne", "se", "sw"];
            return (
              <rect
                cursor={`${directions[index]}-resize`}
                key={`${pointX}_${pointY}`}
                x={pointX - width / 2}
                y={pointY - width / 2}
                width={width}
                height={height}
                style={{
                  stroke: "black",
                  fill: "white",
                }}
                onMouseDown={(e) =>
                  restPoint.zoomControlVertexEventHandler.onMouseDown(
                    e,
                    directions[index]
                  )
                }
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
  const [moveCurrentClientPosition, setMoveCurrentClientPosition] = useState(
    []
  );
  const [hoveredShapeId, setHoveredShapeId] = useState("");
  const [
    dragZoomControlVertexDirection,
    setDragZoomControlVertexDirection,
  ] = useState("");

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
        setDragZoomControlVertexDirection("");
        setDragTargetElementType("");
        setMoveCurrentClientPosition([]);
      }}
      onMouseMove={(e) => {
        const { clientX, clientY } = e.nativeEvent;
        const distX = clientX - moveCurrentClientPosition[0];
        const distY = clientY - moveCurrentClientPosition[1];
        if (dragTargetElementType === "shape") {
          dispatch({
            type: "moveShape",
            payload: {
              id: selectedShapeId,
              distX,
              distY,
            },
          });
        } else if (dragTargetElementType === "zoomControlVertex") {
          dispatch({
            type: "zoomShape",
            payload: {
              id: selectedShapeId,
              direction: dragZoomControlVertexDirection,
              distX,
              distY,
            },
          });
        }
        setMoveCurrentClientPosition([clientX, clientY]);
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
              const { clientX, clientY } = e.nativeEvent;
              setDragTargetElementType("shape");
              setMoveCurrentClientPosition([clientX, clientY]);
              dispatch({
                type: "selectShape",
                payload: {
                  id: shape.id,
                },
              });
              e.stopPropagation();
            },
            onMouseEnter: (e) => {
              setHoveredShapeId(shape.id);
              e.stopPropagation();
            },
            onMouseLeave: (e) => {
              setHoveredShapeId("");
              e.stopPropagation();
            },
          },
          zoomControlVertexEventHandler: {
            onMouseDown: (e, dragZoomControlVertexDirection) => {
              const { clientX, clientY } = e.nativeEvent;
              setDragTargetElementType("zoomControlVertex");
              setMoveCurrentClientPosition([clientX, clientY]);
              setDragZoomControlVertexDirection(dragZoomControlVertexDirection);
              e.stopPropagation();
            },
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
