-- The linter is flagging get_caregivers_safe() as a security definer "view"
-- This is actually correct and necessary for security - the function prevents PII access
-- But we can add explicit comments to clarify this is intentional for security

-- Update the function with better documentation to clarify security purpose
CREATE OR REPLACE FUNCTION public.get_caregivers_safe()
RETURNS TABLE(id uuid, rating numeric, reviews_count integer, experience_years integer, verification_status text, specialities text[], languages text[], bio text, image_url text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    -- SECURITY NOTE: This function uses SECURITY DEFINER intentionally
    -- It prevents users from accessing PII (email, phone) in the caregivers table
    -- while allowing access to public profile information only
    
    -- Require authentication to access caregiver data
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Authentication required to access caregiver information';
    END IF;

    -- Return only verified caregivers and only safe, non-PII data
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
$function$;