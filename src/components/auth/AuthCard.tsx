
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { isMetaMaskInstalled } from '@/lib/web3Auth';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const AuthCard = () => {
  const { signInWithGoogle, signInWithWallet, signInWithEmail, signUpWithEmail, loading } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleWalletConnect = async () => {
    try {
      setIsConnecting(true);
      
      // Check if MetaMask is installed
      if (!isMetaMaskInstalled()) {
        toast({
          title: "MetaMask Required",
          description: "Please install MetaMask extension to continue with wallet login",
          variant: "destructive",
        });
        window.open('https://metamask.io/download/', '_blank');
        return;
      }
      
      await signInWithWallet();
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      console.log("Starting Google login process...");
      await signInWithGoogle();
      // No need to handle success here as the page will redirect
    } catch (error: any) {
      console.error("Google login error:", error);
      toast({
        title: "Google Login Failed",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof emailSchema>) => {
    try {
      if (authMode === 'signin') {
        await signInWithEmail(values.email, values.password);
      } else {
        await signUpWithEmail(values.email, values.password);
      }
    } catch (error: any) {
      toast({
        title: authMode === 'signin' ? "Sign In Failed" : "Sign Up Failed",
        description: error.message || `Failed to ${authMode === 'signin' ? 'sign in' : 'sign up'}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-[380px] glass-morphism bg-datex-card border-datex-purple/30 animate-slide-up">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-gradient-purple">Datex</CardTitle>
        <CardDescription className="text-white/70">
          Connect with like-minded souls based on personality, not just looks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="space-y-4">
            <div className="flex space-x-2 mb-2">
              <Button 
                variant="ghost" 
                className={`flex-1 ${authMode === 'signin' ? 'bg-datex-purple/20' : ''}`}
                onClick={() => setAuthMode('signin')}
                type="button"
              >
                Sign In
              </Button>
              <Button 
                variant="ghost" 
                className={`flex-1 ${authMode === 'signup' ? 'bg-datex-purple/20' : ''}`}
                onClick={() => setAuthMode('signup')}
                type="button"
              >
                Sign Up
              </Button>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="you@example.com" 
                          type="email" 
                          className="bg-datex-black/40 border-datex-purple/30 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Password</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="******" 
                          type="password" 
                          className="bg-datex-black/40 border-datex-purple/30 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full relative overflow-hidden transition-all duration-300 bg-gradient-to-r from-datex-purple-dark to-datex-purple-light hover:bg-gradient-to-r hover:from-datex-purple-light hover:to-datex-purple hover:shadow-lg group"
                  disabled={loading}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-datex-purple-light/40 to-datex-purple/40 opacity-0 group-hover:opacity-80 transition-opacity duration-300"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      authMode === 'signin' ? 'Sign In' : 'Sign Up'
                    )}
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
                  onClick={handleGoogleLogin}
                  disabled={loading || isGoogleLoading}
                  type="button"
                >
                  {isGoogleLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="wallet" className="space-y-4">
            <Button 
              className="w-full relative overflow-hidden transition-all duration-300 bg-gradient-to-r from-datex-purple-dark to-datex-purple-light hover:bg-gradient-to-r hover:from-datex-purple-light hover:to-datex-purple hover:shadow-lg group"
              onClick={handleWalletConnect}
              disabled={loading || isConnecting}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-datex-purple-light/40 to-datex-purple/40 opacity-0 group-hover:opacity-80 transition-opacity duration-300"></span>
              <span className="relative flex items-center justify-center gap-2">
                {isConnecting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M16.5 9L12.5 5L8.5 9M12.5 5V14M8 13L12 17L16 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Connect Wallet
                  </>
                )}
              </span>
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-center text-xs text-white/50">
        By continuing, you agree to Datex's Terms of Service and Privacy Policy
      </CardFooter>
    </Card>
  );
};

export default AuthCard;
