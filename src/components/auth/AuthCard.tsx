
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const AuthCard = () => {
  const { signInWithGoogle, signInWithWallet, loading } = useAuth();

  return (
    <Card className="w-[380px] glass-morphism bg-datex-card border-datex-purple/30 animate-slide-up">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-gradient-purple">Datex</CardTitle>
        <CardDescription className="text-white/70">
          Connect with like-minded souls based on personality, not just looks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Button 
            className="w-full relative overflow-hidden transition-all duration-300 bg-gradient-to-r from-datex-purple-dark to-datex-purple-light hover:bg-gradient-to-r hover:from-datex-purple-light hover:to-datex-purple hover:shadow-lg group"
            onClick={signInWithWallet}
            disabled={loading}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-datex-purple-light/40 to-datex-purple/40 opacity-0 group-hover:opacity-80 transition-opacity duration-300"></span>
            <span className="relative flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M16.5 9L12.5 5L8.5 9M12.5 5V14M8 13L12 17L16 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Connect Wallet
            </span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-px bg-datex-purple/30"></div>
            <span className="text-xs text-white/50">OR</span>
            <div className="flex-1 h-px bg-datex-purple/30"></div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full border-datex-purple/40 hover:bg-datex-purple/20 hover:border-datex-purple text-white group"
            onClick={signInWithGoogle}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-center text-xs text-white/50">
        By continuing, you agree to Datex's Terms of Service and Privacy Policy
      </CardFooter>
    </Card>
  );
};

export default AuthCard;
