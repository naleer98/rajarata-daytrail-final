import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app boot
  useEffect(() => {
    const storedUser = localStorage.getItem('rajarata_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('rajarata_user');
      }
    }
    setLoading(false);
  }, []);

  // Login action
  const login = async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    const userData = response.data.data;
    setUser(userData);
    localStorage.setItem('rajarata_user', JSON.stringify(userData));
    return userData;
  };

  // Register action
  const register = async (name, email, password) => {
    const response = await API.post('/auth/register', { name, email, password });
    const userData = response.data.data;
    setUser(userData);
    localStorage.setItem('rajarata_user', JSON.stringify(userData));
    return userData;
  };

  // Logout action
  const logout = () => {
    setUser(null);
    localStorage.removeItem('rajarata_user');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);