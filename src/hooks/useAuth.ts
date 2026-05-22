"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

// Mock user definition for local developer testing when Supabase is not configured
export interface MockUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
  };
}

export function useAuth() {
  const [user, setUser] = useState<User | MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. If Supabase is configured, use official auth listeners
    if (supabase) {
      // Get current active session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }

    // 2. Fallback: Mock Auth via localStorage when Supabase is not configured
    const checkLocalAuth = () => {
      const isAuth = localStorage.getItem("nadhiv_portfolio_auth") === "true";
      if (isAuth) {
        setUser({
          id: "local-admin-uuid",
          email: "admin@nadhiv.dev",
          user_metadata: {
            full_name: "Local Portfolio Administrator",
          },
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkLocalAuth();

    // Custom event listener to react to login/logout changes inside the same tab
    window.addEventListener("local-auth-change", checkLocalAuth);
    return () => {
      window.removeEventListener("local-auth-change", checkLocalAuth);
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (!supabase) {
        // Mock local sign-in
        await new Promise((resolve) => setTimeout(resolve, 800)); // simulates network delay
        if (email === "admin@nadhiv.dev" && password === "password") {
          localStorage.setItem("nadhiv_portfolio_auth", "true");
          window.dispatchEvent(new Event("local-auth-change"));
          return { error: null };
        } else {
          return { error: { message: "Invalid email or password. Use email: 'admin@nadhiv.dev' and password: 'password' to test locally." } };
        }
      }

      // Live Supabase sign-in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        localStorage.removeItem("nadhiv_portfolio_auth");
        window.dispatchEvent(new Event("local-auth-change"));
        setUser(null);
        return { error: null };
      }

      const { error } = await supabase.auth.signOut();
      return { error };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    signIn: signInWithEmail,
    signOut,
    isMocked: !supabase,
  };
}
