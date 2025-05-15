
import React from 'react';
import { Navigate } from 'react-router-dom';
import ProfileSetup from '@/components/profile/ProfileSetup';
import { useAuth } from '@/contexts/AuthContext';

const ProfileSetupPage = () => {
  const { user, profile, loading } = useAuth();

  // If user is not authenticated, redirect to login
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }
  
  // If profile is already complete, redirect to dashboard
  if (profile?.isProfileComplete && !loading) {
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
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-datex-purple/20 rounded-full filter blur-3xl" />
      <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-datex-purple/10 rounded-full filter blur-3xl" />
      
      {/* Content */}
      <div className="z-10">
        <ProfileSetup />
      </div>
    </div>
  );
};

export default ProfileSetupPage;
