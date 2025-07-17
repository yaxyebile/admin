import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as api from '../api';

interface AuthContextType {
  user: any;
  token: string | null;
  register: (data: any) => Promise<any>;
  login: (data: any) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('auth-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth-token'));

  const register = async (data: any) => {
    const res = await api.register(data);
    if (res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('auth-token', res.token);
      localStorage.setItem('auth-user', JSON.stringify(res.user));
    }
    return res;
  };

  const login = async (data: any) => {
    const res = await api.login(data);
    if (res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('auth-token', res.token);
      localStorage.setItem('auth-user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
  };

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 