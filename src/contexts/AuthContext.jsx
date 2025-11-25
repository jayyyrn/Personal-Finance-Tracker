import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Auth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const existingToken = localStorage.getItem('auth_token');
      const existingUser = localStorage.getItem('user');
      
      if (existingToken && existingUser) {
        const userData = JSON.parse(existingUser);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        const mockUser = {
          id: 1,
          name: 'Demo User',
          email: 'demo@example.com',
          email_verified_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          avatar: null,
          phone: '+1 (555) 123-4567',
          bio: 'Finance enthusiast and budgeting expert'
        };
        
        localStorage.setItem('auth_token', 'mock-jwt-token-12345');
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
      const mockUser = {
        id: 1,
        name: 'Demo User',
        email: 'demo@example.com',
        email_verified_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        avatar: null,
        phone: '+1 (555) 123-4567',
        bio: 'Finance enthusiast and budgeting expert'
      };
      
      localStorage.setItem('auth_token', 'mock-jwt-token-12345');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return { user: mockUser, token: 'mock-jwt-token-12345' };
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser = {
      id: 1,
      name: data.name,
      email: data.email,
      email_verified_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      avatar: null,
      phone: '',
      bio: ''
    };
    
    localStorage.setItem('auth_token', 'mock-jwt-token-12345');
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
    
    return { user: mockUser, token: 'mock-jwt-token-12345' };
  };

  const logout = async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = {
      ...currentUser,
      ...data,
      updated_at: new Date().toISOString()
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};