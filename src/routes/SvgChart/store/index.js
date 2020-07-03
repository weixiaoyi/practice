import React, { useReducer, useContext } from "react";
import { zoomControlVertexConfig } from "../configs";

const StoreContext = React.createContext({
  shapes: [],
  selectedShapeId: "",
});

export const reducer = (state, action) => {
  const payload = action.payload;
  switch (action.type) {
    case "selectShape":
      return { ...state, selectedShapeId: payload.id };
    case "addShape":
      const { shape } = payload;
      return { ...state, shapes: state.shapes.concat([shape]) };
    case "moveShape": {
      const { id, distX, distY } = payload;
      return {
        ...state,
        shapes: state.shapes.map((item) => {
          if (item.id !== id) return item;
          const {
            position: { x, y },
          } = item;
          return item.update("position", {
            x: x + distX,
            y: y + distY,
          });
        }),
      };
    }
    case "zoomShape": {
      const { id, direction, distX, distY } = payload;
      return {
        ...state,
        shapes: state.shapes.map((item) => {
          if (item.id !== id) return item;
          let position;
          let size;
          const {
            position: { x, y },
            size: { width, height },
          } = item;
          if (direction === "se") {
            position = {
              x,
              y,
            };
            size = {
              width: width + distX,
              height: height + distY,
            };
          } else if (direction === "ne") {
            position = {
              x,
              y: y + distY,
            };
            size = {
              width: width + distX,
              height: height - distY,
            };
          } else if (direction === "sw") {
            position = {
              x: x + distX,
              y,
            };
            size = {
              width: width - distX,
              height: height + distY,
            };
          } else if (direction === "nw") {
            position = {
              x: x + distX,
              y: y + distY,
            };
            size = {
              width: width - distX,
              height: height - distY,
            };
          }
          if (
            size.width <= zoomControlVertexConfig.width ||
            size.height <= zoomControlVertexConfig.height
          )
            return item;
          return item.update({
            position,
            size,
          });
        }),
      };
    }

    default:
      throw new Error(`action: '${action.type}' not defined`);
  }
};

const useStore = () => {
  return useReducer(reducer, useContext(StoreContext));
};

export default useStore;
