import React, { useState } from 'react';
// import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import ImprovedAuthForm from './ImprovedAuthForm';
import GoogleSignInButton from './GoogleSignInButton';
import { Heart } from 'lucide-react';

const AuthFormExample = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  const handleSignIn = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Sign In Data:', data);
    
    // Your actual sign in logic here
    // const result = await signIn(data.email, data.password);
    
    setIsLoading(false);
    return { error: null }; // or return { error: 'Some error message' }
  };

  const handleSignUp = async (data: { email: string; password: string; name?: string }) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Sign Up Data:', data);
    
    // Your actual sign up logic here
    // const result = await signUp(data.email, data.password, data.name);
    
    setIsLoading(false);
    return { error: null }; // or return { error: 'Some error message' }
  };

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
            <CardTitle className="text-2xl font-bold text-center text-slate-900">
              Secure Access
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Your data is protected with enterprise-grade security
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')} 
              className="space-y-4"
            >
              <TabsList className="grid w-full grid-cols-2 bg-slate-100">
                <TabsTrigger value="signin" className="data-[state=active]:bg-white">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-white">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <GoogleSignInButton />
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <ImprovedAuthForm
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
                    <span className="bg-white px-2 text-muted-foreground">
                      Or create account with email
                    </span>
                  </div>
                </div>

                <ImprovedAuthForm
                  type="signup"
                  onSubmit={handleSignUp}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <a 
                href="/" 
                className="text-sm text-blue-600 hover:text-blue-500 transition-colors flex items-center justify-center"
              >
                <Heart className="w-4 h-4 mr-1" />
                Back to homepage
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthFormExample;