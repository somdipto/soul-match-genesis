import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardPage from './DashboardPage';

const Index = () => {
  const { user, profile, loading } = useAuth();
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-datex-black flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-datex-purple mb-4"></div>
        <p className="text-white/70">Loading...</p>
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // If profile is not complete, redirect to profile setup
  if (!profile?.isProfileComplete) {
    return <Navigate to="/setup-profile" replace />;
  }
  
  // Otherwise, show the dashboard
  return <DashboardPage />;
};

export default Index;
