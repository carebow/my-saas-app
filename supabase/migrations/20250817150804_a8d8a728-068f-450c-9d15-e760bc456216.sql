-- Fix security definer view issue
-- The caregivers_public view should not use SECURITY DEFINER
-- Instead, create a regular view and grant proper permissions

-- Drop the existing view
DROP VIEW IF EXISTS public.caregivers_public;

-- Create a regular view without SECURITY DEFINER
CREATE VIEW public.caregivers_public AS
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

-- Grant explicit permissions for the view
GRANT SELECT ON public.caregivers_public TO authenticated, anon;

-- Update the search function to be more explicit about permissions
DROP FUNCTION IF EXISTS public.search_caregivers(text, text);

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
STABLE
SET search_path TO 'public'
AS $$
BEGIN
  -- Only return verified caregivers without exposing PII
  RETURN QUERY
  SELECT 
    cv.id,
    cv.rating,
    cv.reviews_count,
    cv.experience_years,
    cv.verification_status,
    cv.specialities,
    cv.languages,
    cv.bio,
    cv.image_url
  FROM public.caregivers_public cv
  WHERE (search_speciality IS NULL OR search_speciality = ANY(cv.specialities))
    AND (search_language IS NULL OR search_language = ANY(cv.languages));
END;
$$;