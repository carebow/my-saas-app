
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

interface CaregiverProfile {
  id: string;
  name: string | null;
  rating: number | null;
  reviews_count: number | null;
  experience_years: number | null;
  verification_status: string | null;
  specialities: string[] | null;
  languages: string[] | null;
  bio: string | null;
  image_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useCaregivers = (speciality?: string, language?: string) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['caregivers', speciality, language],
    queryFn: async (): Promise<CaregiverProfile[]> => {
      try {
        // Use the secure view that excludes PII (email, phone)
        let query = supabase
          .from('caregiver_public_profiles')
          .select('*')
          .order('rating', { ascending: false });

        // Apply filters if provided
        if (speciality) {
          query = query.contains('specialities', [speciality]);
        }
        if (language) {
          query = query.contains('languages', [language]);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching caregivers:', error);
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error in useCaregivers:', error);
        toast({
          title: "Error",
          description: "Failed to load caregiver profiles. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCaregiver = (id: string) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['caregiver', id],
    queryFn: async (): Promise<CaregiverProfile | null> => {
      try {
        // Use the secure view for individual caregiver lookup
        const { data, error } = await supabase
          .from('caregiver_public_profiles')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching caregiver:', error);
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Error in useCaregiver:', error);
        toast({
          title: "Error",
          description: "Failed to load caregiver profile. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
