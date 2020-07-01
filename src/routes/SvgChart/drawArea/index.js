import React, { useState, useEffect } from "react";
import { Square } from "../components";
import useStore from "../store";
import styles from "./index.module.scss";

function SquareShape(props) {
  const { width, height, style, position, ...restPoint } = props;
  return (
    <g>
      <rect
        width={width}
        height={height}
        style={style}
        x={position.x}
        y={position.x}
      />
      <polygon
        points={restPoint.zoomControlVertex.coordinates
          .map((item) => `${item[0]},${item[1]}`)
          .join(" ")}
        style={{ fill: "transparent", stroke: "purple", strokeWidth: 2 }}
      />
      {restPoint.zoomControlVertex.coordinates.map((p) => {
        const { width, height } = restPoint.zoomControlVertex;
        return (
          <rect
            key={`${p[0]}${p[1]}`}
            x={p[0] - width / 2}
            y={p[1] - width / 2}
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
  );
}

function DrawArea() {
  const [store, dispatch] = useStore();

  const [mouseEnter, setMouseEnter] = useState(false);
  const [select, setSelect] = useState([]);

  useEffect(() => {
    const square = new Square({
      width: 100,
      height: 100,
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

  const { shapes } = store;

  console.log(store, "----store");

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="100%"
      height="100%"
    >
      {shapes.map((shape) => {
        return {
          square: <SquareShape {...shape} key={shape.uuid} />,
        }[shape.type];
      })}
    </svg>
  );
}

export default DrawArea;
