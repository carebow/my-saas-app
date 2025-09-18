import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '../components/ui/use-toast';

export interface HealthProfile {
  id: string;
  profile_id: string;
  date_of_birth?: string;
  height_cm?: number;
  weight_kg?: number;
  blood_type?: string;
  gender?: string;
  chronic_conditions?: string[];
  current_medications?: string[];
  allergies?: string[];
  family_medical_history?: Record<string, unknown>;
  lifestyle_factors?: Record<string, unknown>;
  cultural_preferences?: Record<string, unknown>;
  preferred_medical_system?: string;
  primary_language?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_history?: Record<string, unknown>;
  lifestyle_preferences?: Record<string, unknown>;
  communication_preferences?: Record<string, unknown>;
  mental_health_history?: Record<string, unknown>;
  symptom_tracking?: Record<string, unknown>;
  care_preferences?: Record<string, unknown>;
}

export interface UserPreferences {
  id: string;
  profile_id: string;
  ai_personality: string;
  communication_style: string;
  medical_system_preference: string;
  language_preference: string;
  urgency_threshold: string;
  follow_up_frequency: string;
  privacy_settings?: Record<string, unknown>;
  notification_preferences?: Record<string, unknown>;
}

export const useHealthProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [healthProfile, setHealthProfile] = useState<HealthProfile | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealthProfile = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('health_profiles')
        .select('*')
        .eq('profile_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setHealthProfile(data);
    } catch (error) {
      console.error('Error fetching health profile:', error);
    }
  }, [user?.id]);

  const fetchUserPreferences = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('profile_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setUserPreferences(data);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchHealthProfile();
      fetchUserPreferences();
    }
  }, [user, fetchHealthProfile, fetchUserPreferences]);

  const updateHealthProfile = async (updates: Partial<HealthProfile>) => {
    try {
      if (healthProfile) {
        const { error } = await supabase
          .from('health_profiles')
          .update(updates)
          .eq('id', healthProfile.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('health_profiles')
          .insert({
            profile_id: user?.id,
            ...updates
          });

        if (error) throw error;
      }

      await fetchHealthProfile();
      toast({
        title: "Profile Updated",
        description: "Your health profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating health profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update your health profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateUserPreferences = async (updates: Partial<UserPreferences>) => {
    try {
      if (userPreferences) {
        const { error } = await supabase
          .from('user_preferences')
          .update(updates)
          .eq('id', userPreferences.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_preferences')
          .insert({
            profile_id: user?.id,
            ...updates
          });

        if (error) throw error;
      }

      await fetchUserPreferences();
      toast({
        title: "Preferences Updated",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update your preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    healthProfile,
    userPreferences,
    loading,
    updateHealthProfile,
    updateUserPreferences,
    refetch: () => {
      fetchHealthProfile();
      fetchUserPreferences();
    }
  };
};