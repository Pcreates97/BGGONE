import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User, AuthContextType } from "../types/auth";
import { supabase } from "../lib/supabase";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUser(sbUser: SupabaseUser): User {
  const meta = sbUser.user_metadata || {};
  return {
    id: sbUser.id,
    name: meta.name || meta.full_name || sbUser.email?.split("@")[0] || "Community Creator",
    email: sbUser.email || "",
    avatar: meta.avatar_url || meta.picture || undefined,
    createdAt: sbUser.created_at || new Date().toISOString(),
    plan: (meta.plan as "Free Community" | "Pro Creator") || "Free Community",
    imagesProcessed: meta.images_processed || 0,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session and subscribe to Supabase Auth state changes
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.warn("Supabase getSession warning:", error.message);
        }
        if (isMounted) {
          if (session?.user) {
            setUser(mapSupabaseUser(session.user));
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Error initializing auth session:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initSession();

    // Listen to real-time auth state changes (login, logout, token refresh, OAuth return)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    if (!email || !password) {
      return { success: false, error: "Please enter both email and password." };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(mapSupabaseUser(data.user));
      }

      return { success: true };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Login failed. Please check your credentials.";
      return { success: false, error: msg };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; confirmationRequired?: boolean }> => {
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
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name.trim() || cleanEmail.split("@")[0] || "Community Creator";

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: cleanName,
            full_name: cleanName,
            plan: "Free Community",
            images_processed: 0,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const mapped = mapSupabaseUser(data.user);
        setUser(mapped);

        // If session is null, Supabase requires email confirmation
        if (!data.session) {
          return {
            success: true,
            confirmationRequired: true,
          };
        }
      }

      return { success: true };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Registration failed. Please try again.";
      return { success: false, error: msg };
    }
  };

  const loginWithSocial = async (
    provider: "google" | "apple" | "github",
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${origin}/account`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Social authentication failed.";
      return { success: false, error: msg };
    }
  };

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Sign out error:", err);
    } finally {
      setUser(null);
    }
  }, []);

  const updateProfile = async (updates: {
    name?: string;
    avatar?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: updates.name,
          full_name: updates.name,
          avatar_url: updates.avatar,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(mapSupabaseUser(data.user));
      }

      return { success: true };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update profile.";
      return { success: false, error: msg };
    }
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
        updateProfile,
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
