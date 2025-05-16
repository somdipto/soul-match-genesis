
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthCard from '@/components/auth/AuthCard';
import { useAuth } from '@/contexts/AuthContext';

const AuthPage = () => {
  const { user, profile, loading } = useAuth();
  
  // If user is authenticated but profile is not complete, redirect to profile setup
  if (user && !loading && (!profile || !profile.isProfileComplete)) {
    return <Navigate to="/setup-profile" replace />;
  }
  
  // If user is authenticated and profile is complete, redirect to dashboard
  if (user && profile?.isProfileComplete && !loading) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen w-full bg-datex-black overflow-hidden relative flex items-center justify-center">
      {/* Gradient background */}
      <div 
        className="absolute inset-0 bg-datex-gradient opacity-80 z-0"
        style={{
          backgroundSize: '200% 200%',
          animation: 'gradient-x 15s ease infinite',
        }}
      />
      
      {/* Glow elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-datex-purple/20 rounded-full filter blur-3xl" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-datex-purple/10 rounded-full filter blur-3xl" />
      
      {/* Content */}
      <div className="z-10">
        <AuthCard />
      </div>
      
      {/* App name and tagline */}
      <div className="absolute top-10 text-center w-full z-10">
        <h1 className="text-5xl font-bold text-gradient-purple">Datex</h1>
        <p className="text-white/70 mt-2">Web3 Dating for the Personality-First Era</p>
      </div>
    </div>
  );
};

export default AuthPage;
