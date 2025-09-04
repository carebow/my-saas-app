
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import EnhancedAuthForm from '@/components/auth/EnhancedAuthForm';
import GoogleSignInButton from '@/components/GoogleSignInButton';

interface AuthFormData {
  email: string;
  password: string;
  name?: string;
}

const Auth = () => {
  const { signUp, signIn, user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  // Memoize redirect URL to prevent unnecessary re-renders
  const redirectTo = useMemo(() => {
    const redirect = searchParams.get('redirect');
    // Sanitize redirect URL to prevent open redirects
    if (!redirect || redirect === '/') return '/';
    if (redirect.startsWith('/') && !redirect.includes('//') && !redirect.toLowerCase().includes('http')) {
      return redirect;
    }
    return '/';
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      console.log('🔄 User already authenticated, redirecting to:', redirectTo);
      // Small delay to ensure auth state is fully updated
      const timer = setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading, navigate, redirectTo]);

  // Handle form submission with better error handling
  const handleFormSubmit = useCallback(async (data: AuthFormData, type: 'signin' | 'signup') => {
    setIsLoading(true);
    
    try {
      let result;
      
      if (type === 'signin') {
        result = await signIn(data.email, data.password);
      } else {
        result = await signUp(data.email, data.password, data.name || '');
      }
      
      if (result.error) {
        toast({
          title: `${type === 'signin' ? 'Sign in' : 'Sign up'} failed`,
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: type === 'signin' ? "Welcome back!" : "Account created!",
          description: type === 'signin' 
            ? "Successfully signed in. Redirecting..." 
            : "Please check your email to verify your account.",
        });
        
        // For sign in, redirect will happen automatically via useEffect
        // For sign up, user needs to verify email first
        if (type === 'signin') {
          setActiveTab('signin');
        }
      }
    } catch (error: unknown) {
      toast({
        title: `${type === 'signin' ? 'Sign in' : 'Sign up'} failed`,
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [signIn, signUp, toast]);

  const handleSignUp = useCallback(async (data: AuthFormData): Promise<{ error: string | null }> => {
    await handleFormSubmit(data, 'signup');
    return { error: null };
  }, [handleFormSubmit]);

  const handleSignIn = useCallback(async (data: AuthFormData): Promise<{ error: string | null }> => {
    await handleFormSubmit(data, 'signin');
    return { error: null };
  }, [handleFormSubmit]);

  // Show loading if auth is still initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/images/carebow-logo.png" 
              alt="CareBow Logo" 
              className="w-12 h-12 object-contain mr-3"
            />
            <h1 className="font-poppins font-bold text-3xl">
              Care<span className="text-purple-400">Bow</span>
            </h1>
          </div>
          <p className="text-gray-600">Your AI-powered health companion</p>
        </motion.div>

        <Card className="bg-white border border-slate-200 shadow-xl">
          <CardHeader className="space-y-1 bg-white">
            <CardTitle className="text-2xl font-bold text-center text-slate-900">Secure Access</CardTitle>
            <CardDescription className="text-center text-slate-600">
              Your data is protected with enterprise-grade security
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100">
                <TabsTrigger value="signin" className="data-[state=active]:bg-white">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-white">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <GoogleSignInButton />
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
                  </div>
                </div>

                <EnhancedAuthForm
                  type="signin"
                  onSubmit={handleSignIn}
                  isLoading={isLoading}
                />
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <GoogleSignInButton />
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Or create account with email</span>
                  </div>
                </div>

                <EnhancedAuthForm
                  type="signup"
                  onSubmit={handleSignUp}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Link 
                to="/" 
                className="text-sm text-blue-600 hover:text-blue-500 transition-colors flex items-center justify-center"
              >
                <Heart className="w-4 h-4 mr-1" />
                Back to homepage
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
