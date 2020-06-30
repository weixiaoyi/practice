import React, { useState, useEffect } from "react";
import { Square } from "../components";

function DrawArea() {
  const [s1, setS1] = useState(
    new Square({
      width: 100,
      height: 200,
      position: {
        x: 10,
        y: 10,
      },
      style: {
        fill: "red",
      },
    })
  );
  useEffect(() => {
    setTimeout(() => {
      setS1({ ...s1, width: 600 });
    }, 3000);
  }, [0]);
  return (
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <rect
          width={s1.width}
          height={s1.height}
          style={s1.style}
          x={s1.position.x}
          y={s1.position.x}
        />
      </svg>
    </div>
  );
}

export default DrawArea;
