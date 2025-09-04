-- Fix security definer view issue
-- Remove the security definer property and use regular RLS instead

-- Drop the view with security definer
DROP VIEW IF EXISTS public.caregiver_profiles;

-- Create a regular view without security definer
CREATE VIEW public.caregiver_profiles AS
SELECT 
    id,
    rating,
    reviews_count,
    experience_years,
    verification_status,
    specialities,
    languages,
    bio,
    image_url,
    created_at
FROM public.caregivers
WHERE verification_status = 'verified';

-- The view will automatically inherit the RLS policies from the caregivers table
-- Grant access to authenticated users
GRANT SELECT ON public.caregiver_profiles TO authenticated;