'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/config';

export interface CustomerUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  created_at?: string;
  stats?: {
    orders_count: number;
    total_spent: number;
  };
}

interface CustomerAuthContextType {
  user: CustomerUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    address?: string;
  }) => Promise<{ success: boolean; message?: string; errors?: Record<string, string[]> }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

const TOKEN_KEY = 'panelook_customer_token';
const USER_KEY = 'panelook_customer_user';

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        // Background verify & refresh
        fetchProfile(storedToken);
      }
    } catch {
      // ignore JSON parse or storage errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProfile = async (authToken: string) => {
    try {
      const res = await fetch(getApiUrl('/customer/profile'), {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json',
        },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setUser(json.data);
          localStorage.setItem(USER_KEY, JSON.stringify(json.data));
        }
      } else if (res.status === 401) {
        // Expired session
        clearSession();
      }
    } catch {
      // offline / network error
    }
  };

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(getApiUrl('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        const authToken = json.data.access_token;
        const authUser = json.data.user;

        setToken(authToken);
        setUser(authUser);
        localStorage.setItem(TOKEN_KEY, authToken);
        localStorage.setItem(USER_KEY, JSON.stringify(authUser));

        // Fetch complete customer stats
        fetchProfile(authToken);

        return { success: true };
      } else {
        return {
          success: false,
          message: json.message || 'Invalid email or password.',
        };
      }
    } catch (e: any) {
      return {
        success: false,
        message: 'Could not connect to the server. Please check your network connection.',
      };
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    address?: string;
  }) => {
    try {
      const res = await fetch(getApiUrl('/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        const authToken = json.data.access_token;
        const authUser = json.data.user;

        setToken(authToken);
        setUser(authUser);
        localStorage.setItem(TOKEN_KEY, authToken);
        localStorage.setItem(USER_KEY, JSON.stringify(authUser));

        fetchProfile(authToken);

        return { success: true };
      } else {
        return {
          success: false,
          message: json.message || 'Registration failed. Please check the form errors.',
          errors: json.errors,
        };
      }
    } catch (e: any) {
      return {
        success: false,
        message: 'Could not connect to the server. Please check your network connection.',
      };
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch(getApiUrl('/auth/logout'), {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
      } catch {
        // ignore
      }
    }
    clearSession();
  };

  const refreshProfile = async () => {
    if (token) {
      await fetchProfile(token);
    }
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}
