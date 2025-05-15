import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { authenticateWithWallet, getCurrentWalletAddress } from '@/lib/web3Auth';
import { User } from '@/types';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: SupabaseUser | null;
  profile: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithWallet: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
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
    const initAuth = async () => {
      try {
        const { user: currentUser } = await getCurrentUser();
        setUser(currentUser || null);
        
        if (currentUser?.id) {
          await fetchUserProfile(currentUser.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser?.id) {
          await fetchUserProfile(currentUser.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Google sign in
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
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
    // Note: We don't set loading to false in the finally block because
    // if successful, the page will redirect and we want to keep loading state true
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
          await supabase
            .from('profiles')
            .upsert({
              id: walletUser.id,
              wallet_address: walletAddress,
              updated_at: new Date().toISOString(),
            }, {
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
      setProfile(null);
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
        profile,
        loading,
        signInWithGoogle,
        signInWithWallet,
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
