import { useContext } from 'react';
import { AuthContext } from '../navigation/AuthContext';

export  const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  const { token, userData, saveToken, saveUserData } = context;
  
  const login = async (newToken, newUserData) => {
    await saveToken(newToken);
    await saveUserData(newUserData);
  };
  
  const logout = async () => {
    await saveToken(null);
    await saveUserData(null);
  };
  
  return {
    token,
    userData,
    login,
    logout,
    isAuthenticated: !!token,
  };
};