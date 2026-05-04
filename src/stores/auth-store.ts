"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IUser } from "@/types/auth.types";
import { config } from "@/lib/config";

const COOKIE_NAME = "appilico_access_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Strict`;
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: IUser) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  login: (user: IUser, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (updates: Partial<IUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user }),

      setTokens: (accessToken, refreshToken) => {
        if (typeof window !== "undefined") {
          localStorage.setItem(config.auth.tokenKey, accessToken);
          localStorage.setItem(config.auth.refreshTokenKey, refreshToken);
          setCookie(COOKIE_NAME, accessToken);
        }
        set({ accessToken, refreshToken });
      },

      login: (user, accessToken, refreshToken) => {
        if (typeof window !== "undefined") {
          localStorage.setItem(config.auth.tokenKey, accessToken);
          localStorage.setItem(config.auth.refreshTokenKey, refreshToken);
          setCookie(COOKIE_NAME, accessToken);
        }
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem(config.auth.tokenKey);
          localStorage.removeItem(config.auth.refreshTokenKey);
          clearCookie(COOKIE_NAME);
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (isLoading) => set({ isLoading }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: config.auth.userKey,
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
