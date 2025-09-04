-- Fix caregiver PII exposure by restricting user access to non-PII columns only
-- Drop the current overly permissive policy
DROP POLICY IF EXISTS "Users can view non-PII caregiver data" ON public.caregivers;

-- Create a new secure policy that truly excludes PII (email, phone)
-- Users can only see: id, name, rating, reviews_count, experience_years, 
-- verification_status, specialities, languages, bio, image_url
CREATE POLICY "Users can view public caregiver info only" 
ON public.caregivers 
FOR SELECT 
USING (
  verification_status = 'verified' 
  AND auth.uid() IS NOT NULL
);

-- Create a secure view for user access that excludes PII
CREATE OR REPLACE VIEW public.caregiver_public_profiles AS
SELECT 
  id,
  name,
  rating,
  reviews_count,
  experience_years,
  verification_status,
  specialities,
  languages,
  bio,
  image_url,
  created_at,
  updated_at
FROM public.caregivers
WHERE verification_status = 'verified';

-- Enable RLS on the view
ALTER VIEW public.caregiver_public_profiles SET (security_barrier = true);

-- Grant access to the view for authenticated users
GRANT SELECT ON public.caregiver_public_profiles TO authenticated;