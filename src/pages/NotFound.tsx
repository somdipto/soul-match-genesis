
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen w-full bg-datex-black overflow-hidden relative flex flex-col items-center justify-center">
      {/* Gradient background */}
      <div 
        className="absolute inset-0 bg-datex-gradient opacity-80 z-0"
      />
      
      {/* Glow elements */}
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-datex-purple/20 rounded-full filter blur-3xl" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-datex-purple/10 rounded-full filter blur-3xl" />
      
      {/* Content */}
      <div className="z-10 text-center animate-slide-up">
        <h1 className="text-7xl font-bold text-gradient-purple mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-6">Page Not Found</h2>
        <p className="text-white/70 max-w-md mb-8">
          The page you're looking for doesn't exist or has been moved to another URL.
        </p>
        <Button
          asChild
          className="bg-gradient-to-r from-datex-purple-dark to-datex-purple-light hover:bg-gradient-to-r hover:from-datex-purple-light hover:to-datex-purple"
        >
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
