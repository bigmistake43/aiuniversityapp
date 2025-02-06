import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Create a Context for Navigation
const NavigationContext = createContext();

// Navigation Provider
export const NavigationProvider = ({ children }) => {
  const navigate = useNavigate();

  return (
    <NavigationContext.Provider value={navigate}>
      {children}
    </NavigationContext.Provider>
  );
};

// Custom hook to access navigate from anywhere
export const useNavigateContext = () => {
  return useContext(NavigationContext);
};
