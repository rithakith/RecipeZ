import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userData, setUserData] = useState(null); // To store user data
  const saveToken = (token) => {
    setAuthToken(token);
    // Also save the token to AsyncStorage if necessary
  };

  const saveUserData = (data) => {
    setUserData(data); // Store user data in state
    // Optionally save to AsyncStorage if needed
  };

  return (
    <AuthContext.Provider value={{ authToken, userData, saveToken, saveUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
