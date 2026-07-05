import React, { createContext, useContext, useState } from 'react';
import type { AuthResponse, UserRole } from '../types';
import { api } from '../api';

interface AuthContextType {
  token: string | null;
  userId: number | null;
  email: string | null;
  name: string | null;
  role: UserRole | null;
  organizationId: number | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole, organizationId?: number | null) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    userId: number | null;
    email: string | null;
    name: string | null;
    role: UserRole | null;
    organizationId: number | null;
  }>({
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null,
    email: localStorage.getItem('email'),
    name: localStorage.getItem('name'),
    role: localStorage.getItem('role') as UserRole | null,
    organizationId: localStorage.getItem('organizationId') ? Number(localStorage.getItem('organizationId')) : null,
  });

  const login = async (email: string, password: string) => {
    const data = await api.auth.login(email, password);
    setAuth(data);
  };

  const register = async (name: string, email: string, password: string, role: UserRole, organizationId?: number | null) => {
    const data = await api.auth.register(name, email, password, role, organizationId);
    setAuth(data);
  };

  const setAuth = (data: AuthResponse) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId.toString());
    localStorage.setItem('email', data.email);
    localStorage.setItem('name', data.name);
    localStorage.setItem('role', data.role);
    if (data.organizationId !== null && data.organizationId !== undefined) {
      localStorage.setItem('organizationId', data.organizationId.toString());
    } else {
      localStorage.removeItem('organizationId');
    }

    setAuthState({
      token: data.token,
      userId: data.userId,
      email: data.email,
      name: data.name,
      role: data.role,
      organizationId: data.organizationId,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('organizationId');

    setAuthState({
      token: null,
      userId: null,
      email: null,
      name: null,
      role: null,
      organizationId: null,
    });
  };

  const isAuthenticated = !!authState.token;

  return (
    <AuthContext.Provider value={{ ...authState, isAuthenticated, login, register, logout }}>
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
