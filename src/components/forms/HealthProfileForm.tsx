import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  User, 
  Heart, 
  Phone, 
  Calendar, 
  MapPin, 
  AlertTriangle,
  Pill,
  Activity,
  Save,
  Plus,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

// Validation schema
const healthProfileSchema = z.object({
  // Personal Information
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say'], {
    required_error: 'Please select your gender',
  }),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  emergencyContact: z.string().min(5, 'Emergency contact is required'),
  address: z.string().min(10, 'Please enter your complete address'),
  
  // Health Information
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'], {
    required_error: 'Please select your blood type',
  }),
  height: z.string().min(1, 'Height is required'),
  weight: z.string().min(1, 'Weight is required'),
  
  // Medical History
  medicalConditions: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  surgeries: z.array(z.string()).optional(),
  
  // Lifestyle
  smokingStatus: z.enum(['never', 'former', 'current'], {
    required_error: 'Please select your smoking status',
  }),
  alcoholConsumption: z.enum(['none', 'occasional', 'moderate', 'heavy'], {
    required_error: 'Please select your alcohol consumption',
  }),
  exerciseFrequency: z.enum(['none', 'rarely', 'weekly', 'daily'], {
    required_error: 'Please select your exercise frequency',
  }),
  
  // Additional Notes
  additionalNotes: z.string().optional(),
});

type HealthProfileFormData = z.infer<typeof healthProfileSchema>;

interface HealthProfileFormProps {
  initialData?: Partial<HealthProfileFormData>;
  onSubmit: (data: HealthProfileFormData) => Promise<void>;
  isLoading?: boolean;
}

const HealthProfileForm: React.FC<HealthProfileFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, touchedFields },
    watch,
    setValue,
    getValues,
  } = useForm<HealthProfileFormData>({
    resolver: zodResolver(healthProfileSchema),
    defaultValues: {
      medicalConditions: [],
      allergies: [],
      medications: [],
      surgeries: [],
      ...initialData,
    },
    mode: 'onChange',
  });

  const steps = [
    { title: 'Personal Info', icon: User },
    { title: 'Health Details', icon: Heart },
    { title: 'Medical History', icon: Activity },
    { title: 'Lifestyle', icon: Pill },
  ];

  const ArrayField = ({ 
    name, 
    label, 
    placeholder 
  }: { 
    name: keyof HealthProfileFormData; 
    label: string; 
    placeholder: string; 
  }) => {
    const [inputValue, setInputValue] = useState('');
    const currentValues = watch(name) as string[] || [];

    const addItem = () => {
      if (inputValue.trim()) {
        setValue(name, [...currentValues, inputValue.trim()] as any);
        setInputValue('');
      }
    };

    const removeItem = (index: number) => {
      setValue(name, currentValues.filter((_, i) => i !== index) as any);
    };

    return (
      <div className="space-y-3">
        <Label className="text-slate-700 font-medium">{label}</Label>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
            className="flex-1"
          />
          <Button type="button" onClick={addItem} size="sm" variant="outline">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {currentValues.map((item, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {item}
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  const SelectField = ({ 
    name, 
    label, 
    options, 
    error 
  }: { 
    name: string; 
    label: string; 
    options: { value: string; label: string }[];
    error?: any;
  }) => (
    <div className="space-y-2">
      <Label className="text-slate-700 font-medium">{label}</Label>
      <select
        {...register(name as any)}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
            : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20'
        }`}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error.message}
        </p>
      )}
    </div>
  );

  const InputField = ({ 
    name, 
    label, 
    type = 'text', 
    placeholder,
    error,
    icon: Icon
  }: {
    name: string;
    label: string;
    type?: string;
    placeholder: string;
    error?: any;
    icon?: React.ComponentType<{ className?: string }>;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-slate-700 font-medium flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        className={`transition-colors ${
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
            : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20'
        }`}
        {...register(name as any)}
      />
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error.message}
        </p>
      )}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="fullName"
                label="Full Name"
                placeholder="Enter your full name"
                error={errors.fullName}
                icon={User}
              />
              <InputField
                name="dateOfBirth"
                label="Date of Birth"
                type="date"
                placeholder=""
                error={errors.dateOfBirth}
                icon={Calendar}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                name="gender"
                label="Gender"
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
                ]}
                error={errors.gender}
              />
              <InputField
                name="phone"
                label="Phone Number"
                type="tel"
                placeholder="Enter your phone number"
                error={errors.phone}
                icon={Phone}
              />
            </div>

            <InputField
              name="emergencyContact"
              label="Emergency Contact"
              placeholder="Name and phone number"
              error={errors.emergencyContact}
              icon={AlertTriangle}
            />

            <div>
              <Label className="text-slate-700 font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </Label>
              <Textarea
                placeholder="Enter your complete address"
                className={`mt-2 transition-colors ${
                  errors.address 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
                {...register('address')}
              />
              {errors.address && (
                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectField
                name="bloodType"
                label="Blood Type"
                options={[
                  { value: 'A+', label: 'A+' },
                  { value: 'A-', label: 'A-' },
                  { value: 'B+', label: 'B+' },
                  { value: 'B-', label: 'B-' },
                  { value: 'AB+', label: 'AB+' },
                  { value: 'AB-', label: 'AB-' },
                  { value: 'O+', label: 'O+' },
                  { value: 'O-', label: 'O-' },
                  { value: 'unknown', label: 'Unknown' },
                ]}
                error={errors.bloodType}
              />
              <InputField
                name="height"
                label="Height (cm)"
                placeholder="170"
                error={errors.height}
              />
              <InputField
                name="weight"
                label="Weight (kg)"
                placeholder="70"
                error={errors.weight}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <ArrayField
              name="medicalConditions"
              label="Medical Conditions"
              placeholder="Add a medical condition"
            />
            <ArrayField
              name="allergies"
              label="Allergies"
              placeholder="Add an allergy"
            />
            <ArrayField
              name="medications"
              label="Current Medications"
              placeholder="Add a medication"
            />
            <ArrayField
              name="surgeries"
              label="Previous Surgeries"
              placeholder="Add a surgery"
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                name="smokingStatus"
                label="Smoking Status"
                options={[
                  { value: 'never', label: 'Never smoked' },
                  { value: 'former', label: 'Former smoker' },
                  { value: 'current', label: 'Current smoker' },
                ]}
                error={errors.smokingStatus}
              />
              <SelectField
                name="alcoholConsumption"
                label="Alcohol Consumption"
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'occasional', label: 'Occasional' },
                  { value: 'moderate', label: 'Moderate' },
                  { value: 'heavy', label: 'Heavy' },
                ]}
                error={errors.alcoholConsumption}
              />
            </div>

            <SelectField
              name="exerciseFrequency"
              label="Exercise Frequency"
              options={[
                { value: 'none', label: 'No exercise' },
                { value: 'rarely', label: 'Rarely (1-2 times/month)' },
                { value: 'weekly', label: 'Weekly (1-3 times/week)' },
                { value: 'daily', label: 'Daily or almost daily' },
              ]}
              error={errors.exerciseFrequency}
            />

            <div>
              <Label className="text-slate-700 font-medium">Additional Notes</Label>
              <Textarea
                placeholder="Any additional health information you'd like to share..."
                className="mt-2"
                {...register('additionalNotes')}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const onFormSubmit = async (data: HealthProfileFormData) => {
    try {
      await onSubmit(data);
      toast({
        title: "Profile Updated",
        description: "Your health profile has been successfully saved.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error saving your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Heart className="w-6 h-6 text-red-500" />
          Health Profile
        </CardTitle>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between mt-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={index} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                  ${isActive 
                    ? 'border-blue-500 bg-blue-500 text-white' 
                    : isCompleted 
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-slate-300 text-slate-400'
                  }
                `}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-slate-400'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-slate-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            <div className="flex gap-3">
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  Next Step
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isLoading || !isValid}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 mr-2"
                      >
                        <Save className="w-4 h-4" />
                      </motion.div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default HealthProfileForm;