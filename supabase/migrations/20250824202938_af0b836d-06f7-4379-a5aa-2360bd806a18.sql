-- Fix security definer views by recreating them without SECURITY DEFINER
-- This ensures views use the querying user's permissions instead of view creator's

-- First, let's check what views have SECURITY DEFINER
SELECT schemaname, viewname, definition 
FROM pg_views 
WHERE schemaname = 'public' 
AND definition ILIKE '%security definer%';

-- Drop and recreate caregiver_profiles view without SECURITY DEFINER
DROP VIEW IF EXISTS public.caregiver_profiles;
CREATE VIEW public.caregiver_profiles AS
SELECT 
  id,
  rating,
  reviews_count, 
  experience_years,
  created_at,
  bio,
  image_url,
  verification_status,
  specialities,
  languages
FROM public.caregivers;

-- Drop and recreate caregiver_public_profiles view without SECURITY DEFINER  
DROP VIEW IF EXISTS public.caregiver_public_profiles;
CREATE VIEW public.caregiver_public_profiles AS
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

-- Grant appropriate permissions
GRANT SELECT ON public.caregiver_profiles TO authenticated;
GRANT SELECT ON public.caregiver_public_profiles TO authenticated;