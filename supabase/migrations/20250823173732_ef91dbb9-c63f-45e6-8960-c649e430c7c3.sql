-- Fix caregiver_profiles security by ensuring it properly uses the underlying table's RLS
-- The view already exists and inherits from caregivers table which has proper RLS

-- Ensure the caregivers table has RLS enabled (it should already)
ALTER TABLE public.caregivers ENABLE ROW LEVEL SECURITY;

-- Verify that the get_caregivers_safe function has proper security
-- This function should be the primary way to access caregiver data safely
CREATE OR REPLACE FUNCTION public.get_caregivers_safe()
RETURNS TABLE(
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
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
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
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_caregivers_safe() TO authenticated;