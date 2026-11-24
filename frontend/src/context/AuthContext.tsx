import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export interface UserProfile {
  userId: number;
  email: string;
  name?: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ autoLoginFailed?: boolean }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('bms_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && !parsed.userId && parsed.id) {
          parsed.userId = parsed.id;
        }
        return parsed;
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('bms_user', JSON.stringify(user));
      localStorage.setItem('bms_token', user.token);
    } else {
      localStorage.removeItem('bms_user');
      localStorage.removeItem('bms_token');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/users/login', { email, password });
    const { accessToken, userId, role } = res.data;
    
    // Fetch user details for display name if available
    let name = email.split('@')[0];
    try {
      const userRes = await api.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (userRes.data?.name) {
        name = userRes.data.name;
      }
    } catch {
      // fallback to prefix
    }

    const profile: UserProfile = {
      userId,
      email,
      name,
      role,
      token: accessToken
    };
    setUser(profile);
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<{ autoLoginFailed?: boolean }> => {
    const payload: any = { name, email, password };
    if (phone && phone.trim()) {
      payload.phone = phone.trim();
    }
    await api.post('/users/register', payload);
    try {
      // After registration, automatically login
      await login(email, password);
      return { autoLoginFailed: false };
    } catch (loginErr) {
      console.warn('Auto-login after registration failed:', loginErr);
      return { autoLoginFailed: true };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
