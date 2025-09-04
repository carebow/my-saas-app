-- Fix the security vulnerability in get_waitlist_stats function
-- Restrict it to admin users only
CREATE OR REPLACE FUNCTION public.get_waitlist_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only allow admin users to access waitlist statistics
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  RETURN jsonb_build_object(
    'total_count', (SELECT COUNT(*) FROM public.waitlist),
    'recent_signups', (SELECT COUNT(*) FROM public.waitlist WHERE joined_at > NOW() - INTERVAL '7 days'),
    'last_7_days', (SELECT COUNT(*) FROM public.waitlist WHERE joined_at > NOW() - INTERVAL '7 days'),
    'last_30_days', (SELECT COUNT(*) FROM public.waitlist WHERE joined_at > NOW() - INTERVAL '30 days')
  );
END;
$function$