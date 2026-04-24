"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/services/auth-service";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    async function initAuth() {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getProfile();
        setUser(response.data);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
