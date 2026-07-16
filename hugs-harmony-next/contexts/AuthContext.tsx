"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

const STORAGE_KEY = "hugs_auth_token";

interface AuthContextType {
  authenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem(STORAGE_KEY);
    if (token === "1") {
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const setAuthCookie = (value: string) => {
    // Set cookie with 7-day expiry, accessible by middleware
    const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
    document.cookie = `${STORAGE_KEY}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
  };

  const clearAuthCookie = () => {
    document.cookie = `${STORAGE_KEY}=; path=/; max-age=0; SameSite=Lax`;
  };

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.ok) {
        sessionStorage.setItem(STORAGE_KEY, "1");
        setAuthCookie("1");
        setAuthenticated(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    clearAuthCookie();
    setAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
