import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { safeLocalStorage } from '../../lib/safeStorage';
import { 
  Settings, 
  Heart, 
  MessageCircle, 
  Sparkles, 
  Shield, 
  Mic,
  Save,
  RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useToast } from '../ui/use-toast';

interface UserPreferences {
  communication_style: string;
  ai_personality: string;
  response_length: string;
  remedy_preferences: Record<string, any>;
  cultural_considerations: Record<string, any>;
  voice_preferences: Record<string, any>;
  privacy_level: string;
  follow_up_frequency: string;
}

interface UserPreferencesProps {
  preferences: UserPreferences | null;
  onUpdate: (preferences: UserPreferences) => void;
}

const UserPreferences: React.FC<UserPreferencesProps> = ({ preferences, onUpdate }) => {
  const { toast } = useToast();
  const [localPreferences, setLocalPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences);
    }
  }, [preferences]);

  const handleSave = async () => {
    if (!localPreferences) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/enhanced-chat/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${safeLocalStorage.get('access_token')}`
        },
        body: JSON.stringify(localPreferences)
      });

      if (response.ok) {
        onUpdate(localPreferences);
        toast({
          title: "Preferences Updated",
          description: "Your preferences have been saved successfully.",
        });
      } else {
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (preferences) {
      setLocalPreferences(preferences);
    }
  };

  const updatePreference = (key: keyof UserPreferences, value: string | boolean | number) => {
    if (localPreferences) {
      setLocalPreferences({
        ...localPreferences,
        [key]: value
      });
    }
  };

  const updateNestedPreference = (parentKey: keyof UserPreferences, childKey: string, value: string | boolean | number) => {
    if (localPreferences) {
      setLocalPreferences({
        ...localPreferences,
        [parentKey]: {
          ...localPreferences[parentKey],
          [childKey]: value
        }
      });
    }
  };

  if (!localPreferences) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-carebow-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="communication" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="ai">AI Personality</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        {/* Communication Preferences */}
        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="w-5 h-5 text-carebow-primary" />
                Communication Style
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="communication-style">Communication Style</Label>
                <Select
                  value={localPreferences.communication_style}
                  onValueChange={(value) => updatePreference('communication_style', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select communication style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empathetic">Empathetic & Caring</SelectItem>
                    <SelectItem value="professional">Professional & Clinical</SelectItem>
                    <SelectItem value="casual">Casual & Friendly</SelectItem>
                    <SelectItem value="formal">Formal & Structured</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="response-length">Response Length</Label>
                <Select
                  value={localPreferences.response_length}
                  onValueChange={(value) => updatePreference('response_length', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select response length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brief">Brief & Concise</SelectItem>
                    <SelectItem value="detailed">Detailed & Comprehensive</SelectItem>
                    <SelectItem value="comprehensive">Very Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="follow-up-frequency">Follow-up Frequency</Label>
                <Select
                  value={localPreferences.follow_up_frequency}
                  onValueChange={(value) => updatePreference('follow_up_frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select follow-up frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Only when necessary</SelectItem>
                    <SelectItem value="moderate">Moderate - Regular check-ins</SelectItem>
                    <SelectItem value="high">High - Frequent follow-ups</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Personality */}
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-carebow-primary" />
                AI Personality
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-personality">AI Personality</Label>
                <Select
                  value={localPreferences.ai_personality}
                  onValueChange={(value) => updatePreference('ai_personality', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI personality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="caring_nurse">Caring Nurse - Warm & Nurturing</SelectItem>
                    <SelectItem value="wise_healer">Wise Healer - Ancient Wisdom</SelectItem>
                    <SelectItem value="professional_doctor">Professional Doctor - Clinical & Precise</SelectItem>
                    <SelectItem value="ayurvedic_practitioner">Ayurvedic Practitioner - Holistic & Traditional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Voice Preferences</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="voice-speed">Voice Speed</Label>
                    <span className="text-sm text-gray-500">
                      {localPreferences.voice_preferences?.speed || 1.0}x
                    </span>
                  </div>
                  <Slider
                    value={[localPreferences.voice_preferences?.speed || 1.0]}
                    onValueChange={([value]) => updateNestedPreference('voice_preferences', 'speed', value)}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voice-tone">Voice Tone</Label>
                  <Select
                    value={localPreferences.voice_preferences?.tone || 'warm'}
                    onValueChange={(value) => updateNestedPreference('voice_preferences', 'tone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select voice tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warm">Warm & Caring</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="calm">Calm & Soothing</SelectItem>
                      <SelectItem value="energetic">Energetic & Upbeat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Preferences */}
        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="w-5 h-5 text-carebow-primary" />
                Health Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Remedy Preferences</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="modern-medicine">Modern Medicine</Label>
                    <Switch
                      checked={localPreferences.remedy_preferences?.modern_medicine !== false}
                      onCheckedChange={(checked) => 
                        updateNestedPreference('remedy_preferences', 'modern_medicine', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ayurvedic">Ayurvedic & Traditional</Label>
                    <Switch
                      checked={localPreferences.remedy_preferences?.ayurvedic !== false}
                      onCheckedChange={(checked) => 
                        updateNestedPreference('remedy_preferences', 'ayurvedic', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="home-remedies">Home Remedies</Label>
                    <Switch
                      checked={localPreferences.remedy_preferences?.home_remedies !== false}
                      onCheckedChange={(checked) => 
                        updateNestedPreference('remedy_preferences', 'home_remedies', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="lifestyle">Lifestyle Changes</Label>
                    <Switch
                      checked={localPreferences.remedy_preferences?.lifestyle !== false}
                      onCheckedChange={(checked) => 
                        updateNestedPreference('remedy_preferences', 'lifestyle', checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cultural Considerations</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dietary-restrictions">Dietary Restrictions</Label>
                    <Switch
                      checked={localPreferences.cultural_considerations?.dietary_restrictions || false}
                      onCheckedChange={(checked) => 
                        updateNestedPreference('cultural_considerations', 'dietary_restrictions', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="religious-beliefs">Religious Beliefs</Label>
                    <Switch
                      checked={localPreferences.cultural_considerations?.religious_beliefs || false}
                      onCheckedChange={(checked) => 
                        updateNestedPreference('cultural_considerations', 'religious_beliefs', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="traditional-practices">Traditional Practices</Label>
                    <Switch
                      checked={localPreferences.cultural_considerations?.traditional_practices || false}
                      onCheckedChange={(checked) => 
                        updateNestedPreference('cultural_considerations', 'traditional_practices', checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-carebow-primary" />
                Privacy & Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="privacy-level">Privacy Level</Label>
                <Select
                  value={localPreferences.privacy_level}
                  onValueChange={(value) => updatePreference('privacy_level', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select privacy level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard - Basic personalization</SelectItem>
                    <SelectItem value="high">High - Limited data sharing</SelectItem>
                    <SelectItem value="maximum">Maximum - Minimal data collection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-retention">Data Retention</Label>
                    <p className="text-sm text-gray-500">Keep conversation data for personalization</p>
                  </div>
                  <Switch
                    checked={localPreferences.privacy_level !== 'maximum'}
                    onCheckedChange={(checked) => 
                      updatePreference('privacy_level', checked ? 'standard' : 'maximum')
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analytics">Usage Analytics</Label>
                    <p className="text-sm text-gray-500">Help improve CareBow with anonymous usage data</p>
                  </div>
                  <Switch
                    checked={localPreferences.privacy_level === 'standard'}
                    onCheckedChange={(checked) => 
                      updatePreference('privacy_level', checked ? 'standard' : 'high')
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isLoading}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-gradient-to-r from-carebow-primary to-carebow-secondary"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
};

export default UserPreferences;

