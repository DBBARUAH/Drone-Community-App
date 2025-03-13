// app/providers/AuthProvider.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Define types for our context
interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<any>;
  loading: boolean;
  profile: Profile | null;
}

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  role: 'client' | 'provider';
}

//  Password validation rules
const PASSWORD_RULES = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Password validation function
  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < PASSWORD_RULES.minLength) {
      errors.push(`Password must be at least ${PASSWORD_RULES.minLength} characters long`);
    }
    if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (PASSWORD_RULES.requireNumber && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (PASSWORD_RULES.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

// Fetch profile function that returns both data and error
const fetchProfile = async (userId: string): Promise<[Profile | null, Error | null]> => {
  try {
    console.log("Fetching profile for user:", userId);
    
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError) {
      return [null, fetchError];
    }
    
    setProfile(profile);
    return [profile, null];
  } catch (error) {
    console.error("Error in fetchProfile:", error);
    return [null, error instanceof Error ? error : new Error('Unknown error in fetchProfile')];
  }
};

// Create profile function that returns both data and error
const createProfile = async (userId: string, userData?: any): Promise<[Profile | null, Error | null]> => {
  try {
    const newProfileData = {
      user_id: userId,
      full_name: userData?.full_name || "New User",
      role: "client" as const,
      avatar_url: userData?.avatar_url,
    };

    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert([newProfileData])
      .select()
      .single();

    if (insertError) {
      return [null, insertError];
    }
    
    setProfile(newProfile);
    return [newProfile, null];
  } catch (error) {
    console.error("Error in createProfile:", error);
    return [null, error instanceof Error ? error : new Error('Unknown error in createProfile')];
  }
};

// Combined fetch or create profile function
const fetchOrCreateProfile = async (userId: string, userData?: any): Promise<[Profile | null, Error | null]> => {
  // First try to fetch the profile
  const [existingProfile, fetchError] = await fetchProfile(userId);
  
  // If profile exists, return it
  if (existingProfile) {
    return [existingProfile, null];
  }
  
  // If error is not "not found", return the error
  if (fetchError && fetchError.message !== 'PGRST116') {
    return [null, fetchError];
  }
  
  // If profile doesn't exist, create one
  return await createProfile(userId, userData);
};

useEffect(() => {
  const setupAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const  [data, error ] = await fetchOrCreateProfile(session.user.id);
        if (error) {
          console.error("Error fetching profile during setup:", error);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error setting up auth:", error);
      setLoading(false);
    }
  };

  setupAuth();

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, currentSession) => {
      console.log("Auth state change event:", event);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        const [ data, error ] = await fetchOrCreateProfile(currentSession.user.id);
        if (error) {
          console.error("Error fetching profile during auth state change:", error);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    }
  );

  return () => {
    subscription.unsubscribe();
  };
}, []);

    // Enhanced Google sign-in function
    const signInWithGoogle = async () => {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          },
        });
  
        if (error) throw error;
  
        // Profile will be created/fetched automatically via the onAuthStateChange listener
        return { data, error: null };
      } catch (error: any) {
        console.error("Google Sign In Error:", error.message);
        return { data: null, error };
      }
    };

  // Sign up function
  const signUp = async (email: string, password: string, userData: any) => {
   
    try {
      console.log("Calling Supabase signUp with:", email, password, userData);
  // Validate password before attempting signup
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return { data: null, error: { message: passwordValidation.errors.join(', ') } };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: userData.full_name },
        },
      });
  
      console.log("Supabase signUp Response:", data, error);
  
      if (error) {
        console.error("Supabase signUp Error:", error.message);
        return { data: null, error };
      }
      // If signup successful, create profile
      if (data.user) {
        await fetchOrCreateProfile(data.user.id, userData);
      }
      return { data, error: null };
    } catch (error: any) {
      console.error("Unexpected Sign Up Error:", error.message);
      return { data: null, error: error.message };
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        signUp,
        signIn,
        signOut,
        resetPassword,
        signInWithGoogle,
        loading,
        profile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};