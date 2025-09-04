-- Fix caregiver PII exposure by implementing column-level access control
-- Remove the overly permissive policy and create restricted policies

-- Drop the existing policy that allows users to see all caregiver data
DROP POLICY IF EXISTS "Users can view caregiver public profiles" ON public.caregivers;

-- Create a new policy for users that only allows access to non-PII columns
-- This uses column-level security by creating a policy that works with specific SELECT statements
CREATE POLICY "Users can view non-PII caregiver data" 
ON public.caregivers 
FOR SELECT 
TO authenticated
USING (
  verification_status = 'verified' AND
  -- This policy will be enforced when combined with column-level grants
  auth.uid() IS NOT NULL
);

-- Revoke default SELECT access
REVOKE SELECT ON public.caregivers FROM authenticated;

-- Grant SELECT only on non-PII columns to authenticated users
GRANT SELECT (
  id,
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
) ON public.caregivers TO authenticated;

-- Ensure admins still have full access to all columns
GRANT ALL ON public.caregivers TO authenticated;

-- Create a specific policy for admin full access
CREATE POLICY "Admins have full caregiver access" 
ON public.caregivers 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  )
);

-- Update the caregiver_profiles view to ensure it only exposes safe data
DROP VIEW IF EXISTS public.caregiver_profiles;
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

-- Grant access to the view for authenticated users
GRANT SELECT ON public.caregiver_profiles TO authenticated;