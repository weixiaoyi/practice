import React, { useReducer, useContext } from "react";

const StoreContext = React.createContext({
  shapes: [],
});

export const reducer = (state, action) => {
  const payload = action.payload;
  switch (action.type) {
    case "addShape":
      const { shape } = payload;
      return { ...state, shapes: state.shapes.concat([shape]) };
    default:
      throw new Error(`action: '${action.type}' not defined`);
  }
};

const useStore = () => {
  return useReducer(reducer, useContext(StoreContext));
};

export default useStore;

// export const StoreProvider = ({ children }) => {
//   const [context, dispatch] = useStore();
//   return (
//     <StoreContext.Provider value={{ ...context, dispatch }}>
//       {children}
//     </StoreContext.Provider>
//   );
// };
