
import { supabase } from '@/integrations/supabase/client';

/**
 * Security guard for caregiver data access
 * Ensures all caregiver data is accessed through secure channels only
 */
export class CaregiverSecurityGuard {
  
  /**
   * Secure method to fetch caregiver profiles (PII-free)
   * Uses the caregiver_public_profiles view which excludes email/phone
   */
  static async getPublicProfiles(filters?: {
    speciality?: string;
    language?: string;
    limit?: number;
  }) {
    try {
      let query = supabase
        .from('caregiver_public_profiles')
        .select('*')
        .order('rating', { ascending: false });

      if (filters?.speciality) {
        query = query.contains('specialities', [filters.speciality]);
      }
      
      if (filters?.language) {
        query = query.contains('languages', [filters.language]);
      }
      
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('CaregiverSecurityGuard: Error fetching public profiles:', error);
      throw new Error('Failed to fetch caregiver profiles');
    }
  }

  /**
   * Get a single caregiver's public profile by ID
   */
  static async getPublicProfile(id: string) {
    try {
      const { data, error } = await supabase
        .from('caregiver_public_profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('CaregiverSecurityGuard: Error fetching public profile:', error);
      throw new Error('Failed to fetch caregiver profile');
    }
  }

  /**
   * Use the secure RPC function for advanced searches
   */
  static async searchCaregivers(speciality?: string, language?: string) {
    try {
      const { data, error } = await supabase.rpc('search_caregivers', {
        search_speciality: speciality || null,
        search_language: language || null
      });

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('CaregiverSecurityGuard: Error in search:', error);
      throw new Error('Failed to search caregivers');
    }
  }

  /**
   * Rate limiting wrapper for API calls
   */
  private static async checkRateLimit(endpoint: string): Promise<boolean> {
    try {
      const response = await fetch('/api/rate-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint })
      });
      
      return response.ok;
    } catch (error) {
      console.warn('Rate limit check failed:', error);
      return true; // Allow request if rate limiter is unavailable
    }
  }

  /**
   * NEVER use these methods - they're blocked for security
   * This serves as documentation of what NOT to do
   */
  private static FORBIDDEN_METHODS = {
    // ❌ NEVER do this - exposes PII
    // supabase.from('caregivers').select('*')
    
    // ❌ NEVER do this - bypasses security
    // supabase.from('caregivers').select('email, phone, ...')
    
    // ✅ ALWAYS use these instead:
    // - caregiver_public_profiles view
    // - get_caregivers_safe() RPC
    // - search_caregivers() RPC
    // - CaregiverSecurityGuard methods
  };
}
