import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AlertCircle, Eye, EyeOff, Shield, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Validation schemas
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

interface ImprovedAuthFormProps {
  type: 'signin' | 'signup';
  onSubmit: (data: Record<string, string>) => Promise<{ error: string | null }>;
  isLoading: boolean;
}

const ImprovedAuthForm: React.FC<ImprovedAuthFormProps> = ({ type, onSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const schema = type === 'signin' ? signInSchema : signUpSchema;
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch,
    setError,
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const password = watch('password');

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { label: 'Very Weak', color: 'bg-red-500' },
      { label: 'Weak', color: 'bg-orange-500' },
      { label: 'Fair', color: 'bg-yellow-500' },
      { label: 'Good', color: 'bg-blue-500' },
      { label: 'Strong', color: 'bg-green-500' },
    ];

    return { score, ...levels[score] };
  };

  const passwordStrength = getPasswordStrength(password || '');

  const onFormSubmit = async (data: SignInFormData | SignUpFormData) => {
    setSubmitError('');
    
    try {
      const result = await onSubmit(data);
      if (result.error) {
        setSubmitError(result.error);
        // Set field-specific errors if possible
        if (result.error.toLowerCase().includes('email')) {
          setError('email', { message: result.error });
        } else if (result.error.toLowerCase().includes('password')) {
          setError('password', { message: result.error });
        }
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    }
  };

  const InputField = ({ 
    name, 
    label, 
    type = 'text', 
    placeholder, 
    showToggle = false,
    showState,
    onToggle 
  }: {
    name: string;
    label: string;
    type?: string;
    placeholder: string;
    showToggle?: boolean;
    showState?: boolean;
    onToggle?: () => void;
  }) => {
    const error = errors[name as keyof typeof errors];
    const isTouched = touchedFields[name as keyof typeof touchedFields];
    const hasValue = watch(name);
    const isValid = !error && isTouched && hasValue;

    return (
      <div className="space-y-2">
        <Label htmlFor={name} className="text-slate-700 font-medium">
          {label}
        </Label>
        <div className="relative">
          <Input
            id={name}
            type={showToggle ? (showState ? 'text' : 'password') : type}
            placeholder={placeholder}
            className={`
              transition-all duration-200 pr-10
              ${error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                : isValid 
                  ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20'
              }
            `}
            {...register(name)}
          />
          
          {/* Success/Error Icons */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {showToggle && onToggle && (
              <button
                type="button"
                onClick={onToggle}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showState ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
            {!showToggle && (
              <>
                {error && <AlertCircle className="w-4 h-4 text-red-500" />}
                {isValid && <CheckCircle className="w-4 h-4 text-green-500" />}
              </>
            )}
          </div>
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-red-600 flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3" />
              {error.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <AnimatePresence>
        {submitError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{submitError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {type === 'signup' && (
        <InputField
          name="name"
          label="Full Name"
          placeholder="Enter your full name"
        />
      )}

      <InputField
        name="email"
        label="Email Address"
        type="email"
        placeholder="Enter your email"
      />

      <div className="space-y-3">
        <InputField
          name="password"
          label="Password"
          placeholder={type === 'signup' ? 'Create a strong password' : 'Enter your password'}
          showToggle
          showState={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
        />
        
        {type === 'signup' && password && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Password strength:</span>
              <span className={`font-medium ${
                passwordStrength.score >= 4 ? 'text-green-600' : 
                passwordStrength.score >= 3 ? 'text-blue-600' : 
                passwordStrength.score >= 2 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {passwordStrength.label}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
              />
            </div>
          </motion.div>
        )}
      </div>

      {type === 'signup' && (
        <InputField
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          showToggle
          showState={showConfirmPassword}
          onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
        />
      )}

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 transition-all duration-200"
        disabled={isLoading || !isValid}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {type === 'signup' ? 'Creating Account...' : 'Signing In...'}
          </>
        ) : (
          <>
            <Shield className="w-4 h-4 mr-2" />
            {type === 'signup' ? 'Create Secure Account' : 'Sign In Securely'}
          </>
        )}
      </Button>

      {type === 'signin' && (
        <div className="text-center">
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
          >
            Forgot your password?
          </button>
        </div>
      )}
    </form>
  );
};

export default ImprovedAuthForm;