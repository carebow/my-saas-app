import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useToast } from '@/components/ui/use-toast';
import { 
  User, 
  Heart, 
  Settings, 
  Save, 
  ChevronRight,
  Loader2
} from 'lucide-react';

interface ProfileFormData {
  // Basic Info
  date_of_birth: string;
  gender: string;
  height_cm: number | null;
  weight_kg: number | null;
  blood_type: string;
  
  // Medical History
  chronic_conditions: string[];
  current_medications: string[];
  allergies: string[];
  
  // Preferences
  preferred_medical_system: string;
  primary_language: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  
  // AI Preferences
  ai_personality: string;
  communication_style: string;
  urgency_threshold: string;
}

export const ProfileSetup: React.FC = () => {
  const { toast } = useToast();
  const { healthProfile, userPreferences, loading, updateHealthProfile, updateUserPreferences } = useHealthProfile();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    date_of_birth: healthProfile?.date_of_birth || '',
    gender: healthProfile?.gender || '',
    height_cm: healthProfile?.height_cm || null,
    weight_kg: healthProfile?.weight_kg || null,
    blood_type: healthProfile?.blood_type || '',
    chronic_conditions: healthProfile?.chronic_conditions || [],
    current_medications: healthProfile?.current_medications || [],
    allergies: healthProfile?.allergies || [],
    preferred_medical_system: healthProfile?.preferred_medical_system || 'integrated',
    primary_language: healthProfile?.primary_language || 'en',
    emergency_contact_name: healthProfile?.emergency_contact_name || '',
    emergency_contact_phone: healthProfile?.emergency_contact_phone || '',
    ai_personality: userPreferences?.ai_personality || 'caring_nurse',
    communication_style: userPreferences?.communication_style || 'balanced',
    urgency_threshold: userPreferences?.urgency_threshold || 'medium',
  });

  const steps = [
    { title: 'Basic Information', icon: User },
    { title: 'Medical History', icon: Heart },
    { title: 'Preferences', icon: Settings },
  ];

  const handleInputChange = (field: keyof ProfileFormData, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayAdd = (field: 'chronic_conditions' | 'current_medications' | 'allergies', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const handleArrayRemove = (field: 'chronic_conditions' | 'current_medications' | 'allergies', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save health profile
      await updateHealthProfile({
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender || null,
        height_cm: formData.height_cm,
        weight_kg: formData.weight_kg,
        blood_type: formData.blood_type || null,
        chronic_conditions: formData.chronic_conditions,
        current_medications: formData.current_medications,
        allergies: formData.allergies,
        preferred_medical_system: formData.preferred_medical_system,
        primary_language: formData.primary_language,
        emergency_contact_name: formData.emergency_contact_name || null,
        emergency_contact_phone: formData.emergency_contact_phone || null,
      });

      // Save user preferences
      await updateUserPreferences({
        ai_personality: formData.ai_personality,
        communication_style: formData.communication_style,
        urgency_threshold: formData.urgency_threshold,
        medical_system_preference: formData.preferred_medical_system,
        language_preference: formData.primary_language,
      });

      toast({
        title: "Profile Saved",
        description: "Your health profile has been saved successfully!",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                index <= currentStep 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-muted-foreground text-muted-foreground'
              }`}>
                <step.icon className="h-5 w-5" />
              </div>
              {index < steps.length - 1 && (
                <div className={`w-20 h-1 mx-2 ${
                  index < currentStep ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <div key={index} className="text-sm text-center">
              <p className={index <= currentStep ? 'text-primary font-medium' : 'text-muted-foreground'}>
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 0: Basic Information */}
          {currentStep === 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
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
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="170"
                    value={formData.height_cm || ''}
                    onChange={(e) => handleInputChange('height_cm', e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={formData.weight_kg || ''}
                    onChange={(e) => handleInputChange('weight_kg', e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="blood_type">Blood Type</Label>
                  <Select value={formData.blood_type} onValueChange={(value) => handleInputChange('blood_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergency_name">Emergency Contact Name</Label>
                  <Input
                    id="emergency_name"
                    placeholder="Full name"
                    value={formData.emergency_contact_name}
                    onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="emergency_phone">Emergency Contact Phone</Label>
                  <Input
                    id="emergency_phone"
                    placeholder="+1234567890"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 1: Medical History */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Chronic Conditions */}
              <div>
                <Label>Chronic Conditions</Label>
                <div className="space-y-2">
                  <Input
                    placeholder="Type a condition and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleArrayAdd('chronic_conditions', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    {formData.chronic_conditions.map((condition, index) => (
                      <div key={index} className="bg-muted px-2 py-1 rounded text-sm flex items-center gap-1">
                        {condition}
                        <button onClick={() => handleArrayRemove('chronic_conditions', index)}>×</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Current Medications */}
              <div>
                <Label>Current Medications</Label>
                <div className="space-y-2">
                  <Input
                    placeholder="Type a medication and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleArrayAdd('current_medications', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    {formData.current_medications.map((medication, index) => (
                      <div key={index} className="bg-muted px-2 py-1 rounded text-sm flex items-center gap-1">
                        {medication}
                        <button onClick={() => handleArrayRemove('current_medications', index)}>×</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Allergies */}
              <div>
                <Label>Allergies</Label>
                <div className="space-y-2">
                  <Input
                    placeholder="Type an allergy and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleArrayAdd('allergies', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    {formData.allergies.map((allergy, index) => (
                      <div key={index} className="bg-muted px-2 py-1 rounded text-sm flex items-center gap-1">
                        {allergy}
                        <button onClick={() => handleArrayRemove('allergies', index)}>×</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Preferences */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Medical System Preference</Label>
                  <Select value={formData.preferred_medical_system} onValueChange={(value) => handleInputChange('preferred_medical_system', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conventional">Conventional Medicine</SelectItem>
                      <SelectItem value="ayurvedic">Ayurvedic/Traditional</SelectItem>
                      <SelectItem value="integrated">Integrated Approach</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Primary Language</Label>
                  <Select value={formData.primary_language} onValueChange={(value) => handleInputChange('primary_language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>AI Personality</Label>
                  <Select value={formData.ai_personality} onValueChange={(value) => handleInputChange('ai_personality', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="caring_nurse">Caring Nurse</SelectItem>
                      <SelectItem value="wise_healer">Wise Healer</SelectItem>
                      <SelectItem value="professional_doctor">Professional Doctor</SelectItem>
                      <SelectItem value="friendly_guide">Friendly Guide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Communication Style</Label>
                  <Select value={formData.communication_style} onValueChange={(value) => handleInputChange('communication_style', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gentle">Gentle & Soothing</SelectItem>
                      <SelectItem value="direct">Clear & Direct</SelectItem>
                      <SelectItem value="detailed">Detailed Explanations</SelectItem>
                      <SelectItem value="balanced">Balanced Approach</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Urgency Threshold</Label>
                <Select value={formData.urgency_threshold} onValueChange={(value) => handleInputChange('urgency_threshold', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Conservative (Higher alerts)</SelectItem>
                    <SelectItem value="medium">Balanced</SelectItem>
                    <SelectItem value="high">Relaxed (Fewer alerts)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            {currentStep === steps.length - 1 ? (
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};