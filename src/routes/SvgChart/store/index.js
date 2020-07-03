import React, { useReducer, useContext } from "react";

const StoreContext = React.createContext({
  shapes: [],
  selectedShapeId: "",
  hoveredShapeId: "",
});

export const reducer = (state, action) => {
  const payload = action.payload;
  switch (action.type) {
    case "selectShape":
      return { ...state, selectedShapeId: payload.id };
    case "hoverShape":
      return { ...state, hoveredShapeId: payload.id };
    case "addShape":
      const { shape } = payload;
      return { ...state, shapes: state.shapes.concat([shape]) };
    case "editShapes": {
      const { id, ...rest } = payload;

      return {
        ...state,
        shapes: state.shapes.map((item) => {
          if (item.id === id) {
            if (rest.position) {
              item.position = rest.position;
              return item.update("position", rest.position);
            }
            return item;
          }
          return item;
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
