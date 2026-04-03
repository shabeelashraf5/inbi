'use client';

import { create } from 'zustand';
import type { AuthState, User } from '@/types/auth.types';

const AUTH_STORAGE_KEY = 'inbi-auth';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  login: (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    set({ user: null, isAuthenticated: false });
  },

  hydrate: () => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const user = JSON.parse(stored) as User;
          set({ user, isAuthenticated: true, isHydrated: true });
        } else {
          set({ isHydrated: true });
        }
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        set({ isHydrated: true });
      }
    }
  },
}));
