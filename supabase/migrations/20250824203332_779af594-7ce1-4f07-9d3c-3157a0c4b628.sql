-- Let's check if there are any functions or other objects with SECURITY DEFINER that might be causing the issue
-- Check for functions with SECURITY DEFINER
SELECT n.nspname as schema_name,
       p.proname as function_name,
       pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE pg_get_functiondef(p.oid) ILIKE '%security definer%'
AND n.nspname = 'public';

-- Also check view options that might have security definer set
SELECT schemaname, viewname, viewowner, definition
FROM pg_views 
WHERE schemaname = 'public';