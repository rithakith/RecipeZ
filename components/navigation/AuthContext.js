import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);

//   const saveToken = (newToken) => setToken(newToken);
  const saveUserData = (data) => setUserData(data);

  return (
    <AuthContext.Provider value={{ saveUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
