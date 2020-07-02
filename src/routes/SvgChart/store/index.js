import React, { useReducer, useContext } from "react";

const StoreContext = React.createContext({
  shapes: [],
  selectedShapeId: "",
});

export const reducer = (state, action) => {
  const payload = action.payload;
  switch (action.type) {
    case "addShape":
      const { shape } = payload;
      return { ...state, shapes: state.shapes.concat([shape]) };
    case "editShape":
      return { ...state };
    case "selectShape":
      return { ...state, selectedShapeId: payload.id };
    default:
      throw new Error(`action: '${action.type}' not defined`);
  }
};

const useStore = () => {
  return useReducer(reducer, useContext(StoreContext));
};

export default useStore;
