import React, { useState, useEffect } from "react";

export default function Transform(props) {
  const [isDragging, setIsDragging] = useState(false);
  const [moveCurrentClientPosition, setMoveCurrentClientPosition] = useState(
    []
  );

  const {
    Ele,
    container,
    moveable,
    onMouseDown,
    ...rest
  } = props;

  useEffect(() => {
    const { onMouseMove, onMouseUp } = moveable;
    if (!moveable) return;
    const mouseMoveCallback = (e) => {
      if (!isDragging) return;
      const { clientX, clientY } = e;
      const distX = clientX - moveCurrentClientPosition[0];
      const distY = clientY - moveCurrentClientPosition[1];
      setMoveCurrentClientPosition([clientX, clientY]);
      onMouseMove && onMouseMove(e, { distX, distY });
    };
    const mouseUpCallback = (e) => {
      setIsDragging(false);
      setMoveCurrentClientPosition([]);
      onMouseUp && onMouseUp(e);
    };
    container.addEventListener("mousemove", mouseMoveCallback);
    container.addEventListener("mouseup", mouseUpCallback);
    return () => {
      container.removeEventListener("mousemove", mouseMoveCallback);
      container.removeEventListener("mouseup", mouseUpCallback);
    };
  }, [moveCurrentClientPosition, isDragging]);

  return (
    <Ele
      {...rest}
      onMouseDown={(e) => {
        const { clientX, clientY } = e.nativeEvent;
        setMoveCurrentClientPosition([clientX, clientY]);
        setIsDragging(true);
        onMouseDown && onMouseDown(e);
        e.stopPropagation();
        e.preventDefault();
      }}
    />
  );
}
