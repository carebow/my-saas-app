-- Also secure the search_caregivers function to require authentication
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

  -- Use the safe function and apply filters
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
  FROM public.get_caregivers_safe() cv
  WHERE (search_speciality IS NULL OR search_speciality = ANY(cv.specialities))
    AND (search_language IS NULL OR search_language = ANY(cv.languages));
END;
$function$