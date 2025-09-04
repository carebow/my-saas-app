-- Fix waitlist security vulnerability
-- Remove public SELECT policies that expose customer contact information
-- Keep INSERT policies to allow public waitlist signup

-- Drop the existing public SELECT policies
DROP POLICY IF EXISTS "Allow reading waitlist entries" ON public.waitlist;
DROP POLICY IF EXISTS "Public can view waitlist entries" ON public.waitlist;

-- Create admin-only SELECT policy
-- First create a function to check if user is admin (enhanced from existing stub)
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $$
BEGIN
  -- For now, restrict to specific admin user IDs
  -- In production, this should use a proper admin roles table
  -- Only allow authenticated users and check against admin list
  IF user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- TODO: Replace with actual admin role check from user_roles table
  -- For now, return false to prevent any public access
  RETURN false;
END;
$$;

-- Create admin-only waitlist viewing policy
CREATE POLICY "Admin can view waitlist entries"
ON public.waitlist
FOR SELECT
USING (public.is_admin());

-- Create a secure function for getting waitlist stats without exposing personal data
CREATE OR REPLACE FUNCTION public.get_waitlist_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN jsonb_build_object(
    'total_count', (SELECT COUNT(*) FROM public.waitlist),
    'recent_signups', (SELECT COUNT(*) FROM public.waitlist WHERE joined_at > NOW() - INTERVAL '7 days')
  );
END;
$$;

-- Log this security fix
SELECT public.log_security_event(
  'policy_update',
  'waitlist', 
  NULL,
  auth.uid(),
  jsonb_build_object(
    'action', 'removed_public_select_policies',
    'reason', 'security_vulnerability_fix',
    'description', 'Removed public access to customer contact information'
  )
);