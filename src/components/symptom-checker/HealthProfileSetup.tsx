import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { User, Calendar, Heart, Pill, Phone, Globe, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface HealthProfileSetupProps {
  onComplete: (profile: { id: string; [key: string]: unknown }) => void;
}

const HealthProfileSetup: React.FC<HealthProfileSetupProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    date_of_birth: '',
    gender: '',
    blood_type: '',
    height_cm: '',
    weight_kg: '',
    chronic_conditions: [] as string[],
    current_medications: [] as string[],
    allergies: [] as string[],
    emergency_contact_name: '',
    emergency_contact_phone: '',
    primary_language: 'en',
    preferred_medical_system: 'conventional'
  });
  
  const [medicationsText, setMedicationsText] = useState('');

  const commonConditions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis',
    'Depression', 'Anxiety', 'Thyroid Disorders', 'High Cholesterol', 'Osteoporosis'
  ];

  const commonAllergies = [
    'Penicillin', 'Sulfa drugs', 'Aspirin', 'Peanuts', 'Shellfish',
    'Latex', 'Seasonal allergies', 'Pet dander', 'Dust mites', 'Food dyes'
  ];

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: string, item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(item)
        ? (prev[field as keyof typeof prev] as string[]).filter(i => i !== item)
        : [...(prev[field as keyof typeof prev] as string[]), item]
    }));
  };

  const validateStep4 = () => {
    const errors = [];
    if (!formData.emergency_contact_name.trim()) {
      errors.push("Emergency contact name is required");
    }
    if (!formData.emergency_contact_phone.trim()) {
      errors.push("Emergency contact phone is required");
    }
    return errors;
  };

  const handleSubmit = async () => {
    // Validate Step 4 fields
    const validationErrors = validateStep4();
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors.join(". "),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    console.log('Starting health profile creation for user:', user?.id);
    
    try {
      // First, ensure user profile exists in profiles table
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user?.id)
        .maybeSingle();

      console.log('Profile check result:', { existingProfile, profileCheckError });

      if (profileCheckError) {
        console.error('Error checking profile:', profileCheckError);
        throw new Error('Failed to verify user profile');
      }

      if (!existingProfile) {
        console.log('Profile not found, this indicates a Clerk/Supabase sync issue');
        throw new Error('User profile not found. Please try signing out and back in.');
      }

      // Prepare health profile data
      const profileData = {
        ...formData,
        profile_id: user?.id,
        height_cm: formData.height_cm ? parseInt(formData.height_cm) : null,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        family_medical_history: {},
        lifestyle_factors: {},
        cultural_preferences: {
          medical_system: formData.preferred_medical_system,
          language: formData.primary_language
        }
      };

      console.log('Inserting health profile data:', profileData);

      const { data, error } = await supabase
        .from('health_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('Health profile insertion error:', error);
        throw error;
      }

      console.log('Health profile created successfully:', data);

      toast({
        title: "Profile Created",
        description: "Your health profile has been saved successfully.",
      });

      onComplete(data);
    } catch (error: unknown) {
      console.error('Error creating health profile:', error);
      
      let errorMessage = "Failed to create health profile. Please try again.";
      
      if (error instanceof Error) {
        if (error.message?.includes('profile not found')) {
          errorMessage = "❤️ Don't worry! There's a small sync issue with your account. Please try signing out and back in - we're here to help!";
        } else if (error.message?.includes('uuid') || error.message?.includes('invalid input syntax')) {
          errorMessage = "🔧 We're updating our system for better compatibility. Please try signing out and back in, and you'll be all set!";
        }
      } else if (typeof error === 'object' && error !== null) {
        const errorObj = error as { code?: string };
        if (errorObj.code === '23503') {
          errorMessage = "🔄 Just a quick sync issue! Please sign out and back in to refresh your connection.";
        } else if (errorObj.code === '42703') {
          errorMessage = "⚙️ Our system is being optimized right now. Please try again in a moment!";
        }
      }

      toast({
        title: "We're Here to Help! 💙",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <User className="w-12 h-12 text-carebow-primary mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-carebow-text-dark">Basic Information</h3>
        <p className="text-carebow-text-medium">Help us understand your basic health profile</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            placeholder="170"
            value={formData.height_cm}
            onChange={(e) => handleInputChange('height_cm', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            placeholder="70"
            value={formData.weight_kg}
            onChange={(e) => handleInputChange('weight_kg', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="blood_type">Blood Type (Optional)</Label>
          <Select value={formData.blood_type} onValueChange={(value) => handleInputChange('blood_type', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select blood type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Heart className="w-12 h-12 text-carebow-primary mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-carebow-text-dark">Medical History</h3>
        <p className="text-carebow-text-medium">Select any chronic conditions you have</p>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {commonConditions.map((condition) => (
          <div key={condition} className="flex items-center space-x-2">
            <Checkbox
              id={condition}
              checked={formData.chronic_conditions.includes(condition)}
              onCheckedChange={() => handleArrayToggle('chronic_conditions', condition)}
            />
            <Label htmlFor={condition} className="text-sm">{condition}</Label>
          </div>
        ))}
      </div>

      <div>
        <Label htmlFor="other_conditions">Other Conditions</Label>
        <Textarea
          id="other_conditions"
          placeholder="List any other medical conditions..."
          className="mt-1"
          rows={3}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Pill className="w-12 h-12 text-carebow-primary mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-carebow-text-dark">Medications & Allergies</h3>
        <p className="text-carebow-text-medium">Help us understand your current medications and allergies</p>
      </div>

      <div>
        <Label htmlFor="medications">Current Medications</Label>
        <Textarea
          id="medications"
          placeholder="List your current medications (name, dosage, frequency)..."
          className="mt-1"
          rows={3}
          value={medicationsText}
          onChange={(e) => {
            setMedicationsText(e.target.value);
            handleInputChange('current_medications', e.target.value.split('\n').filter(Boolean));
          }}
        />
      </div>

      <div>
        <Label className="text-base font-medium">Known Allergies</Label>
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          {commonAllergies.map((allergy) => (
            <div key={allergy} className="flex items-center space-x-2">
              <Checkbox
                id={allergy}
                checked={formData.allergies.includes(allergy)}
                onCheckedChange={() => handleArrayToggle('allergies', allergy)}
              />
              <Label htmlFor={allergy} className="text-sm">{allergy}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Globe className="w-12 h-12 text-carebow-primary mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-carebow-text-dark">Preferences & Emergency Contact</h3>
        <p className="text-carebow-text-medium">Final details to personalize your care</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="emergency_name">Emergency Contact Name</Label>
          <Input
            id="emergency_name"
            placeholder="Full name"
            value={formData.emergency_contact_name}
            onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="emergency_phone">Emergency Contact Phone</Label>
          <Input
            id="emergency_phone"
            placeholder="+1 (555) 123-4567"
            value={formData.emergency_contact_phone}
            onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="language">Primary Language</Label>
          <Select value={formData.primary_language} onValueChange={(value) => handleInputChange('primary_language', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
              <SelectItem value="zh">Chinese</SelectItem>
              <SelectItem value="ar">Arabic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="medical_system">Preferred Medical Approach</Label>
          <Select value={formData.preferred_medical_system} onValueChange={(value) => handleInputChange('preferred_medical_system', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conventional">Conventional Medicine</SelectItem>
              <SelectItem value="ayurvedic">Ayurvedic Medicine</SelectItem>
              <SelectItem value="integrated">Integrated Approach</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-carebow-blue to-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-carebow-text-dark">
                Health Profile Setup
              </CardTitle>
              <p className="text-carebow-text-medium">
                Step {currentStep} of 4 - This information helps us provide personalized care recommendations
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div 
                  className="bg-gradient-to-r from-carebow-primary to-carebow-secondary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
              </motion.div>

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-6"
                >
                  Previous
                </Button>

                {currentStep < 4 ? (
                  <Button
                    onClick={nextStep}
                    className="bg-gradient-to-r from-carebow-primary to-carebow-secondary hover:from-carebow-primary/90 hover:to-carebow-secondary/90 text-white px-6"
                  >
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-carebow-primary to-carebow-secondary hover:from-carebow-primary/90 hover:to-carebow-secondary/90 text-white px-6"
                  >
                    {isLoading ? 'Creating Profile...' : 'Complete Setup'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default HealthProfileSetup;