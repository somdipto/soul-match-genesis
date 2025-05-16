
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { authenticateWithWallet, getCurrentWalletAddress } from '@/lib/web3Auth';
import { User } from '@/types';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  profile: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithWallet: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      // Using type assertion to bypass TypeScript errors
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setProfile(data as unknown as User);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setProfile(null);
    }
  };

  // Refresh user profile
  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // First setup auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.id);
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Use setTimeout to avoid potential Supabase deadlock
        if (newSession?.user?.id) {
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Then check for existing session
    const initAuth = async () => {
      try {
        // Check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        if (currentSession?.user?.id) {
          await fetchUserProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Google sign in
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      console.log('Starting Google OAuth sign in');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline', 
            prompt: 'consent'
          }
        },
      });
      
      if (error) throw error;
      
      console.log('Google sign-in initiated:', data);
      
      // Note: The page will redirect, so no need for additional handling here
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast({
        title: "Authentication Failed",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Email sign in
  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Signing in with email');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Fetch user profile after successful login
        await fetchUserProfile(data.user.id);
        
        toast({
          title: "Signed In",
          description: "Successfully signed in with email",
        });
      }
    } catch (error: any) {
      console.error('Email sign-in error:', error);
      toast({
        title: "Authentication Failed",
        description: error.message || "Failed to sign in with email",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Email sign up
  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Signing up with email');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create an initial profile for the user using type assertion to bypass TypeScript errors
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: email,
          updated_at: new Date().toISOString(),
          is_email_verified: false,
        } as any);
        
        await fetchUserProfile(data.user.id);
        
        toast({
          title: "Account Created",
          description: "Please check your email to verify your account",
        });
      }
    } catch (error: any) {
      console.error('Email sign-up error:', error);
      toast({
        title: "Sign Up Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Wallet sign in
  const signInWithWallet = async () => {
    try {
      setLoading(true);
      const { user: walletUser, error } = await authenticateWithWallet();
      
      if (error) {
        throw new Error(error.message || "Failed to authenticate with wallet");
      }
      
      if (walletUser) {
        // Create or update profile with wallet address
        const walletAddress = await getCurrentWalletAddress();
        if (walletAddress) {
          // Using type assertion to bypass TypeScript errors
          await supabase
            .from('profiles')
            .upsert({
              id: walletUser.id,
              wallet_address: walletAddress,
              updated_at: new Date().toISOString(),
            } as any, {
              onConflict: 'id',
            });
            
          // Fetch the user profile again to update state
          await fetchUserProfile(walletUser.id);
        }
        
        toast({
          title: "Wallet Connected",
          description: "Successfully authenticated with wallet",
        });
      }
    } catch (error: any) {
      toast({
        title: "Wallet Authentication Failed",
        description: error.message || "Failed to sign in with wallet",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      setProfile(null);
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Sign Out Failed",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signInWithGoogle,
        signInWithWallet,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
