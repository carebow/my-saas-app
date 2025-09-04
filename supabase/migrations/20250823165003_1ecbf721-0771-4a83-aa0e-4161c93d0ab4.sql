-- Secure the get_caregivers_safe function to require authentication
-- This prevents unauthorized access even to safe caregiver data
CREATE OR REPLACE FUNCTION public.get_caregivers_safe()
RETURNS TABLE(id uuid, rating numeric, reviews_count integer, experience_years integer, verification_status text, specialities text[], languages text[], bio text, image_url text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Require user to be authenticated to access caregiver data
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to access caregiver information';
  END IF;

  -- Only return verified caregivers and only safe, non-PII data
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
  WHERE c.verification_status = 'verified';
END;
$function$