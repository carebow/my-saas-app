-- Fix critical security vulnerabilities

-- 1. Fix subscribers table RLS policies - remove overly permissive update policy
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- Create proper update policy that only allows users to update their own subscriptions
CREATE POLICY "Users can update own subscription"
ON public.subscribers
FOR UPDATE
USING (user_id = auth.uid() OR email = auth.email());

-- 2. Fix caregivers table to restrict PII access
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view caregivers" ON public.caregivers;
DROP POLICY IF EXISTS "Everyone can view caregivers" ON public.caregivers;

-- Create a view that exposes only safe, non-PII caregiver data
CREATE OR REPLACE VIEW public.caregivers_public AS
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

-- Grant access to the safe view
GRANT SELECT ON public.caregivers_public TO authenticated, anon;

-- Create admin-only policy for full caregiver access
CREATE POLICY "Admin can view all caregiver data"
ON public.caregivers
FOR SELECT
USING (public.is_admin());

-- 3. Create secure caregiver search function that doesn't expose PII
CREATE OR REPLACE FUNCTION public.search_caregivers(
  search_speciality text DEFAULT NULL,
  search_language text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  rating numeric,
  reviews_count integer,
  experience_years integer,
  verification_status text,
  specialities text[],
  languages text[],
  bio text,
  image_url text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.rating,
    c.reviews_count,
    c.experience_years,
    c.verification_status,
    c.specialities,
    c.languages,
    c.bio,
    c.image_url
  FROM public.caregivers c
  WHERE c.verification_status = 'verified'
    AND (search_speciality IS NULL OR search_speciality = ANY(c.specialities))
    AND (search_language IS NULL OR search_language = ANY(c.languages));
END;
$$;

-- 4. Log security improvements
SELECT public.log_security_event(
  'security_hardening',
  'multiple_tables',
  NULL,
  auth.uid(),
  jsonb_build_object(
    'fixes', ARRAY[
      'subscribers_rls_tightened',
      'caregivers_pii_protected',
      'safe_caregiver_view_created'
    ],
    'description', 'Implemented critical security fixes for RLS and PII protection'
  )
);