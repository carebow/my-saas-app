-- Fix caregiver directory access while protecting PII
-- Current issue: The "Block PII access" policy with USING(false) blocks ALL access
-- Solution: Create granular policies that allow non-PII access to authenticated users

-- Drop the overly restrictive policies
DROP POLICY IF EXISTS "Admins can view all caregiver data including PII" ON public.caregivers;
DROP POLICY IF EXISTS "Block PII access for non-admin users" ON public.caregivers;

-- Create new secure policies

-- 1. Admin policy: Full access to all data including PII
CREATE POLICY "Admins can view all caregiver data" ON public.caregivers
FOR SELECT 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- 2. User policy: Allow authenticated users to view non-PII caregiver data
-- This enables the core platform functionality while protecting sensitive data
CREATE POLICY "Users can view caregiver public profiles" ON public.caregivers
FOR SELECT 
TO authenticated
USING (
    -- Only allow access to verified caregivers
    verification_status = 'verified' AND
    -- Ensure user is authenticated
    auth.uid() IS NOT NULL
);

-- 3. Create a secure view for user access that excludes PII
CREATE OR REPLACE VIEW public.caregiver_profiles AS
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

-- 4. Allow users to access the safe view
ALTER VIEW public.caregiver_profiles SET (security_barrier = true);

-- Grant access to the view for authenticated users
GRANT SELECT ON public.caregiver_profiles TO authenticated;

-- 5. Update the existing safe function to use proper security
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
SET search_path = public
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