
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Eye, EyeOff, Shield } from 'lucide-react';
import { passwordSchema, emailSchema, nameSchema, sanitizeInput, rateLimiter, checkPasswordRequirements } from './ValidationUtils';
import { SecureErrorHandler } from './SecureErrorHandler';

interface EnhancedAuthFormProps {
  type: 'signin' | 'signup';
  onSubmit: (data: { name: string; email: string; password: string; confirmPassword: string }) => Promise<{ error: string | null }>;
  isLoading: boolean;
}

const EnhancedAuthForm: React.FC<EnhancedAuthFormProps> = ({ type, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<string>('');
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  // Real-time password strength indicator and requirements
  useEffect(() => {
    if (formData.password) {
      const strength = calculatePasswordStrength(formData.password);
      setPasswordStrength(strength);
      const requirements = checkPasswordRequirements(formData.password);
      setPasswordRequirements(requirements);
    } else {
      setPasswordStrength('');
      setPasswordRequirements({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      });
    }
  }, [formData.password]);

  const calculatePasswordStrength = (password: string): string => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return levels[score] || 'Very Weak';
  };

  const validateField = (name: string, value: string): string => {
    try {
      switch (name) {
        case 'name':
          nameSchema.parse(value);
          break;
        case 'email':
          emailSchema.parse(value);
          break;
        case 'password':
          passwordSchema.parse(value);
          break;
        case 'confirmPassword':
          if (value !== formData.password) {
            return 'Passwords do not match';
          }
          break;
      }
      return '';
    } catch (error: unknown) {
      return SecureErrorHandler.handleValidationError(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    
    // Real-time validation
    const error = validateField(name, sanitizedValue);
    setErrors(prev => ({ 
      ...prev, 
      [name]: error || '' 
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (type === 'signup') {
      newErrors.name = validateField('name', formData.name);
    }
    
    newErrors.email = validateField('email', formData.email);
    newErrors.password = validateField('password', formData.password);
    
    if (type === 'signup') {
      newErrors.confirmPassword = validateField('confirmPassword', formData.confirmPassword);
    }

    // Filter out empty errors
    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([key, value]) => value !== '')
    );

    setErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRateLimitError('');

    // Check rate limiting
    const rateLimitKey = `auth_${formData.email}_${type}`;
    if (!rateLimiter.canAttempt(rateLimitKey, 5, 300000)) {
      const remainingTime = Math.ceil(rateLimiter.getRemainingTime(rateLimitKey) / 1000 / 60);
      setRateLimitError(`Too many attempts. Please wait ${remainingTime} minutes before trying again.`);
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Check for suspicious activity
    if (SecureErrorHandler.detectSuspiciousActivity(formData.email, navigator.userAgent)) {
      setRateLimitError('Suspicious activity detected. Please contact support if you believe this is an error.');
      return;
    }

    try {
      const { error } = await onSubmit(formData);
      if (error) {
        const userFriendlyError = SecureErrorHandler.handleAuthError(error, type);
        setRateLimitError(userFriendlyError);
      }
    } catch (error) {
      const userFriendlyError = SecureErrorHandler.handleAuthError(error, type);
      setRateLimitError(userFriendlyError);
    }
  };

  const getStrengthColor = (strength: string): string => {
    switch (strength) {
      case 'Strong': return 'text-green-600';
      case 'Good': return 'text-blue-600';
      case 'Fair': return 'text-purple-600';
      case 'Weak': return 'text-blue-400';
      default: return 'text-red-600';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {rateLimitError && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{rateLimitError}</span>
        </div>
      )}

      {type === 'signup' && (
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-700">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            className={`bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : ''
            }`}
            value={formData.name}
            onChange={handleInputChange}
            required
            maxLength={100}
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-700">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          className={`bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
            errors.email ? 'border-red-500' : ''
          }`}
          value={formData.email}
          onChange={handleInputChange}
          required
          maxLength={320}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-slate-700">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={type === 'signup' ? 'Create a strong password' : 'Enter your password'}
            className={`bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 pr-10 ${
              errors.password ? 'border-red-500' : ''
            }`}
            value={formData.password}
            onChange={handleInputChange}
            required
            maxLength={128}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
        {type === 'signup' && passwordStrength && (
          <p className={`text-xs ${getStrengthColor(passwordStrength)} font-medium`}>
            Password strength: {passwordStrength}
          </p>
        )}
      </div>

      {type === 'signup' && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-slate-700">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              className={`bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 pr-10 ${
                errors.confirmPassword ? 'border-red-500' : ''
              }`}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              maxLength={128}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
        disabled={isLoading || !!rateLimitError}
      >
        <Shield className="w-4 h-4 mr-2" />
        {isLoading ? 'Processing...' : (type === 'signup' ? 'Create Secure Account' : 'Sign In Securely')}
      </Button>

      {type === 'signup' && formData.password && (
        <div className="text-xs space-y-2 p-3 bg-slate-50 rounded-md border border-slate-200">
          <p className="font-medium text-slate-700">Password Requirements (3 of 5 needed):</p>
          <ul className="space-y-1">
            <li className={`flex items-center gap-2 ${passwordRequirements.length ? 'text-green-600' : 'text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full ${passwordRequirements.length ? 'bg-green-500' : 'bg-slate-300'}`}></span>
              At least 8 characters
            </li>
            <li className={`flex items-center gap-2 ${passwordRequirements.uppercase ? 'text-green-600' : 'text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full ${passwordRequirements.uppercase ? 'bg-green-500' : 'bg-slate-300'}`}></span>
              One uppercase letter (A-Z)
            </li>
            <li className={`flex items-center gap-2 ${passwordRequirements.lowercase ? 'text-green-600' : 'text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full ${passwordRequirements.lowercase ? 'bg-green-500' : 'bg-slate-300'}`}></span>
              One lowercase letter (a-z)
            </li>
            <li className={`flex items-center gap-2 ${passwordRequirements.number ? 'text-green-600' : 'text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full ${passwordRequirements.number ? 'bg-green-500' : 'bg-slate-300'}`}></span>
              One number (0-9)
            </li>
            <li className={`flex items-center gap-2 ${passwordRequirements.special ? 'text-green-600' : 'text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full ${passwordRequirements.special ? 'bg-green-500' : 'bg-slate-300'}`}></span>
              One special character (!@#$%)
            </li>
          </ul>
        </div>
      )}
    </form>
  );
};

export default EnhancedAuthForm;
