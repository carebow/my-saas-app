-- Final security fixes to address remaining issues

-- 1. Remove all public access to caregivers table and create proper RLS
DROP VIEW IF EXISTS public.caregivers_public;

-- Revoke all existing permissions on caregivers table
REVOKE ALL ON public.caregivers FROM authenticated, anon, public;

-- 2. Create a function to get safe caregiver data without exposing PII
CREATE OR REPLACE FUNCTION public.get_caregivers_safe()
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
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
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
$$;

-- Grant execute permission on the safe function
GRANT EXECUTE ON FUNCTION public.get_caregivers_safe() TO authenticated, anon;

-- 3. Update the search function to use the safe function
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
$$;

-- Grant execute permission on search function
GRANT EXECUTE ON FUNCTION public.search_caregivers(text, text) TO authenticated, anon;

-- 4. Enhance is_admin function with better security
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $$
DECLARE
  admin_emails text[] := ARRAY['admin@carebow.com']; -- Configure admin emails here
  user_email text;
BEGIN
  -- Only allow authenticated users
  IF user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get user email from auth.users (using security definer to bypass RLS)
  SELECT email INTO user_email 
  FROM auth.users 
  WHERE id = user_id;
  
  -- Check if user email is in admin list
  RETURN user_email = ANY(admin_emails);
END;
$$;

-- 5. Log security hardening completion
SELECT public.log_security_event(
  'security_hardening_complete',
  'multiple_tables',
  NULL,
  auth.uid(),
  jsonb_build_object(
    'fixes_applied', ARRAY[
      'subscribers_rls_fixed',
      'caregivers_pii_protected',
      'waitlist_secured',
      'admin_function_enhanced',
      'service_role_usage_reduced'
    ],
    'description', 'Comprehensive security fixes implemented',
    'timestamp', now()
  )
);