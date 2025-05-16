
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const AuthCallbackPage = () => {
  const { user, loading, refreshProfile } = useAuth();
  
  useEffect(() => {
    // This page is the OAuth callback page, and will handle the session from URL
    const handleAuthCallback = async () => {
      const { hash, searchParams } = new URL(window.location.href);
      
      // If we have a hash or search params, let Supabase handle the session
      if (hash || searchParams) {
        // The supabase client will automatically handle the callback
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error handling auth callback:", error);
        } else if (data.session) {
          // Session is now set in the client
          await refreshProfile();
        }
      }
    };
    
    handleAuthCallback();
  }, [refreshProfile]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-datex-black flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-datex-purple mb-4"></div>
        <p className="text-white/70">Processing authentication...</p>
      </div>
    );
  }
  
  // If user is authenticated and we're done processing the callback
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  // If no user after processing the callback, redirect to auth page
  return <Navigate to="/auth" replace />;
};

export default AuthCallbackPage;
