import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from local storage
  useEffect(() => {
    const fetchUser = async () => {
      let token = null;
      try {
        token = localStorage.getItem('access_token');
      } catch(e) {}
      
      if (token) {
        try {
          const res = await axios.get('http://localhost:8000/api/auth/me/', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          try {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          } catch(e) {}
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/token/', {
        username,
        password
      });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      const res = await axios.get('http://localhost:8000/api/auth/me/', {
        headers: { Authorization: `Bearer ${response.data.access}` }
      });
      setUser(res.data);
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { 
        success: false, 
        error: error.response?.data?.detail || "Invalid credentials." 
      };
    }
  };

  const register = async (username, email, password, password_confirm) => {
    try {
      await axios.post('http://localhost:8000/api/auth/register/', {
        username,
        email,
        password,
        password_confirm
      });
      // Automatically login after successful registration
      return await login(username, password);
    } catch (error) {
      console.error("Registration failed:", error);
      // DRF returns object with field errors, let's extract the first one
      let errorMsg = "Registration failed.";
      if (error.response?.data) {
        const firstKey = Object.keys(error.response.data)[0];
        errorMsg = error.response.data[firstKey][0] || errorMsg;
      }
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
