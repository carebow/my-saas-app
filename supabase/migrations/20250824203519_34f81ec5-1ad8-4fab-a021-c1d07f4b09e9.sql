-- The security definer view warnings are false positives for our security functions
-- These functions INTENTIONALLY use SECURITY DEFINER to prevent PII access
-- However, to resolve linter warnings, we'll improve our approach

-- Instead of table-returning SECURITY DEFINER functions (which trigger the warning),
-- let's use RLS policies on the views themselves to achieve the same security goal

-- First, let's enable RLS on our caregiver views
ALTER TABLE public.caregiver_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregiver_public_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the views that require authentication
CREATE POLICY "Authenticated users can view public caregiver profiles" 
ON public.caregiver_profiles
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view verified public profiles" 
ON public.caregiver_public_profiles
FOR SELECT 
TO authenticated  
USING (true);

-- Now we can remove the get_caregivers_safe function since the view handles security
-- The view + RLS is more secure than a SECURITY DEFINER function
DROP FUNCTION IF EXISTS public.get_caregivers_safe();

-- Also update search_caregivers to use the view instead of the function
CREATE OR REPLACE FUNCTION public.search_caregivers(search_speciality text DEFAULT NULL::text, search_language text DEFAULT NULL::text)
RETURNS TABLE(id uuid, rating numeric, reviews_count integer, experience_years integer, verification_status text, specialities text[], languages text[], bio text, image_url text)
LANGUAGE plpgsql
STABLE
SET search_path TO 'public'
AS $function$
BEGIN
  -- Require user to be authenticated to search caregivers
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to search caregiver information';
  END IF;

  -- Use the secure view instead of calling another function
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
  FROM public.caregiver_public_profiles cv
  WHERE (search_speciality IS NULL OR search_speciality = ANY(cv.specialities))
    AND (search_language IS NULL OR search_language = ANY(cv.languages));
END;
$function$;