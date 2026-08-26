"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Profile } from "@/types/database";
import { profileService } from "@/lib/services/profileService";

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  needsOnboarding: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithPassword: (email: string, password: string, displayName: string, username: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<Profile | null>;
  completeOnboarding: (username: string, displayName: string, bio?: string) => Promise<boolean>;
  clearAllData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_PROFILE_KEY = "blogpotro_current_profile";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem(LOCAL_USER_PROFILE_KEY);
          if (stored) {
            const p: Profile = JSON.parse(stored);
            setProfile(p);
            setUser({ id: p.id, email: `${p.username}@blogpotro.local`, user_metadata: { full_name: p.display_name, avatar_url: p.avatar_url } });
          }
        } catch (e) {}
      }

      if (isSupabaseConfigured()) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            const userProfile = await profileService.getProfileById(session.user.id);
            if (userProfile && userProfile.username) {
              setProfile(userProfile);
              setNeedsOnboarding(false);
              localStorage.setItem(LOCAL_USER_PROFILE_KEY, JSON.stringify(userProfile));
            } else {
              setNeedsOnboarding(true);
            }
          }
        } catch (e) {}
      }

      setLoading(false);
    };

    initAuth();

    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const p = await profileService.getProfileById(session.user.id);
          if (p && p.username) {
            setProfile(p);
            setNeedsOnboarding(false);
            localStorage.setItem(LOCAL_USER_PROFILE_KEY, JSON.stringify(p));
          } else {
            setNeedsOnboarding(true);
          }
        } else {
          setUser(null);
          setProfile(null);
          setNeedsOnboarding(false);
          localStorage.removeItem(LOCAL_USER_PROFILE_KEY);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const signInWithGoogle = async () => {
    if (isSupabaseConfigured()) {
      const redirectTo = `${window.location.origin}/auth/callback`;
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
    }
  };

  const signInWithPassword = async (email: string, password: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured()) {
      return { error: "Supabase authentication is not configured." };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      setUser(data.user);
      const p = await profileService.getProfileById(data.user.id);
      if (p) {
        setProfile(p);
        localStorage.setItem(LOCAL_USER_PROFILE_KEY, JSON.stringify(p));
      }
    }
    return {};
  };

  const signUpWithPassword = async (
    email: string,
    password: string,
    displayName: string,
    username: string
  ): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured()) {
      return { error: "Supabase authentication is not configured." };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: displayName,
          name: displayName,
          user_name: username.toLowerCase(),
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      setUser(data.user);
      const p = await profileService.createProfile({
        id: data.user.id,
        username: username.toLowerCase(),
        display_name: displayName,
      });
      if (p) {
        setProfile(p);
        localStorage.setItem(LOCAL_USER_PROFILE_KEY, JSON.stringify(p));
      }
    }
    return {};
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setNeedsOnboarding(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_USER_PROFILE_KEY);
    }
  };

  const clearAllData = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    setUser(null);
    setProfile(null);
    setNeedsOnboarding(false);
  };

  const updateProfile = async (data: Partial<Profile>): Promise<Profile | null> => {
    if (!profile) return null;
    const updated = await profileService.updateProfile(profile.id, data);
    if (updated) {
      setProfile(updated);
      localStorage.setItem(LOCAL_USER_PROFILE_KEY, JSON.stringify(updated));
    }
    return updated;
  };

  const completeOnboarding = async (
    username: string,
    displayName: string,
    bio?: string
  ): Promise<boolean> => {
    const userId = user?.id;
    if (!userId) return false;

    const created = await profileService.createProfile({
      id: userId,
      username,
      display_name: displayName,
      avatar_url: user?.user_metadata?.avatar_url || null,
      bio,
    });

    if (created) {
      setProfile(created);
      setNeedsOnboarding(false);
      localStorage.setItem(LOCAL_USER_PROFILE_KEY, JSON.stringify(created));
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        needsOnboarding,
        signInWithGoogle,
        signInWithPassword,
        signUpWithPassword,
        signOut,
        updateProfile,
        completeOnboarding,
        clearAllData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


