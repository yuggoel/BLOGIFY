'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/lib/api';

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

  async function loadProfile(userId: string, fallbackEmail?: string): Promise<User | null> {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (data) {
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        profile_picture_url: data.profile_picture ?? undefined,
        created_at: data.created_at,
      };
    }
    // Profile row not found yet (trigger may not have fired) — build from auth session
    if (fallbackEmail) {
      return {
        id: userId,
        name: fallbackEmail.split('@')[0],
        email: fallbackEmail,
        created_at: new Date().toISOString(),
      };
    }
    return null;
  }

  useEffect(() => {
    // ── Step A: Immediate check ──────────────────────────────────────────
    // Read the stored session from localStorage right away.
    // This synchronously resolves (no network) and sets loading=false
    // so the UI knows the auth state before anything renders.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await loadProfile(session.user.id, session.user.email);
        setUser(profile);
      }
      // Always mark loading done after Step A — even if no session.
      setLoading(false);
    });

    // ── Step B: Listener for runtime changes ─────────────────────────────
    // INITIAL_SESSION is intentionally ignored here: Step A (getSession)
    // already handled the startup state. Responding to INITIAL_SESSION
    // a second time causes a null-flash → redirect loop.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'INITIAL_SESSION') return; // handled by getSession above

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            const profile = await loadProfile(session.user.id, session.user.email);
            setUser(profile);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = (userData: User) => setUser(userData);

  const logout = async () => {
    await supabase.auth.signOut();
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
