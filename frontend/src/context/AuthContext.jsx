// AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { getProfile } from "../api/api";

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [id , setId] = useState();

  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    console.log("Checking auth status, token:", token);

    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await getProfile();
      console.log("authContext profile - " , response);
      if (response.success) {
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback(async (loginResponse) => {
    try {
      console.log("Login function called with response:", loginResponse);
      const { id, token } = loginResponse;
      // console.log(id);
      // console.log(token);
      localStorage.setItem('token', token);
      setId(id);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      setIsAuthenticated(false);
      setId(null);
      localStorage.removeItem('token');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const value = {
    isAuthenticated,
    loading,
    user,
    id,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}