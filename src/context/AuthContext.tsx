import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, AuthContextType } from "../types/auth";

interface StoredUser extends User {
  password?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_USERS_KEY = "bg_gone_auth_users";
const STORAGE_SESSION_KEY = "bg_gone_auth_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session from localStorage on mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(STORAGE_SESSION_KEY);
      if (savedSession) {
        setUser(JSON.parse(savedSession));
      }
    } catch {
      // ignore parsing errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    if (!email || !password) {
      return { success: false, error: "Please enter both email and password." };
    }

    try {
      const usersRaw = localStorage.getItem(STORAGE_USERS_KEY);
      const users: StoredUser[] = usersRaw ? JSON.parse(usersRaw) : [];
      const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

      if (!found) {
        // Auto-provision demo account for frictionless experience
        const newUser: User = {
          id: `usr_${Date.now()}`,
          name: email.split("@")[0] || "Community User",
          email: email.trim().toLowerCase(),
          createdAt: new Date().toISOString(),
          plan: "Free Community",
          imagesProcessed: 0,
        };
        const updatedUsers: StoredUser[] = [...users, { ...newUser, password }];
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newUser));
        setUser(newUser);
        return { success: true };
      }

      if (found.password && found.password !== password) {
        return { success: false, error: "Invalid password. Please try again." };
      }

      const activeUser: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        avatar: found.avatar,
        createdAt: found.createdAt,
        plan: found.plan || "Free Community",
        imagesProcessed: found.imagesProcessed || 0,
      };

      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(activeUser));
      setUser(activeUser);
      return { success: true };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Login failed.";
      return { success: false, error: msg };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    if (!email || !password) {
      return { success: false, error: "Please fill in all required fields." };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters long.",
      };
    }

    try {
      const usersRaw = localStorage.getItem(STORAGE_USERS_KEY);
      const users: StoredUser[] = usersRaw ? JSON.parse(usersRaw) : [];
      const existing = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

      if (existing) {
        return {
          success: false,
          error: "An account with this email already exists. Try logging in.",
        };
      }

      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: name.trim() || email.split("@")[0] || "Community Creator",
        email: email.trim().toLowerCase(),
        createdAt: new Date().toISOString(),
        plan: "Free Community",
        imagesProcessed: 0,
      };

      const updatedUsers: StoredUser[] = [...users, { ...newUser, password }];
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Registration failed.";
      return { success: false, error: msg };
    }
  };

  const loginWithSocial = async (
    provider: "google" | "apple",
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const socialUser: User = {
        id: `usr_social_${Date.now()}`,
        name: provider === "google" ? "Google Community User" : "Apple Community User",
        email: `user@${provider}.com`,
        avatar:
          provider === "google"
            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            : undefined,
        createdAt: new Date().toISOString(),
        plan: "Free Community",
        imagesProcessed: 0,
      };

      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(socialUser));
      setUser(socialUser);
      return { success: true };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Social sign-in failed.";
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        loginWithSocial,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
