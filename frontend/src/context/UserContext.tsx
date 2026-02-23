'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, getUser, getTokenPayload, clearToken } from '@/lib/api';

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Decode the stored JWT to get the user ID, then fetch the full profile.
    const payload = getTokenPayload();

    if (!payload) {
      setLoading(false);
      return;
    }

    getUser(payload.sub)
      .then(setUser)
      .catch(() => {
        // Token is invalid or user was deleted — clear it.
        clearToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (userData: User) => setUser(userData);

  const logout = () => {
    clearToken();
    setUser(null);
    window.location.href = '/';
  };

  const updateUser = (userData: User) => setUser(userData);

  return (
    <UserContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

