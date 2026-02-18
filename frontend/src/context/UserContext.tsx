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
    // When the access token is expired but the refresh token is valid,
    // INITIAL_SESSION fires with null, then SIGNED_IN fires a moment later
    // with the refreshed session. If we set loading=false on INITIAL_SESSION:null
    // RequireAuth immediately redirects before SIGNED_IN arrives.
    //
    // Strategy:
    //  - INITIAL_SESSION with a session  → set user, set loading=false ✓
    //  - INITIAL_SESSION with null       → don't touch loading; wait for
    //                                      SIGNED_IN (refresh) or SIGNED_OUT
    //  - SIGNED_IN / TOKEN_REFRESHED     → set user, set loading=false ✓
    //  - SIGNED_OUT                      → clear user, set loading=false ✓
    //
    // Fallback: if neither event arrives within 3 s, unblock the UI.
    const fallback = setTimeout(() => {
      console.log('[UserContext] fallback timeout reached, setting loading=false');
      setLoading(false);
    }, 3000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[UserContext] onAuthStateChange event:', event, 'user:', session?.user?.email ?? 'null');

        if (session?.user) {
          const profile = await loadProfile(session.user.id, session.user.email);
          console.log('[UserContext] profile loaded:', profile?.email ?? 'null');
          setUser(profile);
          clearTimeout(fallback);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          clearTimeout(fallback);
          setLoading(false);
        }
        // INITIAL_SESSION with null → do nothing; let SIGNED_IN follow
      }
    );

    return () => {
      clearTimeout(fallback);
      subscription.unsubscribe();
    };
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
