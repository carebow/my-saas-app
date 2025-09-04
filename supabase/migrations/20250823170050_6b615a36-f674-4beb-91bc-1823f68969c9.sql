-- Fix waitlist table RLS policies to properly secure customer data
-- The current policies are not working correctly for unauthenticated users

-- Drop existing policies
DROP POLICY IF EXISTS "Admins only can view waitlist data" ON public.waitlist;
DROP POLICY IF EXISTS "Allow public waitlist signup" ON public.waitlist;

-- Create secure policies that properly handle authentication

-- 1. SELECT policy: Only authenticated admins can view waitlist data
CREATE POLICY "Only authenticated admins can view waitlist data" ON public.waitlist
FOR SELECT 
TO authenticated
USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- 2. INSERT policy: Allow public to join waitlist (this is intentional for marketing)
-- But add some basic validation to prevent abuse
CREATE POLICY "Allow public waitlist signup with validation" ON public.waitlist
FOR INSERT 
TO anon, authenticated
WITH CHECK (
    -- Ensure required fields are provided
    name IS NOT NULL AND 
    email IS NOT NULL AND
    length(trim(name)) > 0 AND
    length(trim(email)) > 0 AND
    email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

-- 3. Explicitly deny UPDATE and DELETE for all users except admins
CREATE POLICY "Only admins can update waitlist entries" ON public.waitlist
FOR UPDATE 
TO authenticated
USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Only admins can delete waitlist entries" ON public.waitlist
FOR DELETE 
TO authenticated
USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Add audit logging for waitlist access (for monitoring)
CREATE OR REPLACE FUNCTION public.log_waitlist_access()
RETURNS TRIGGER AS $$
BEGIN
    -- Log access attempts for security monitoring
    RAISE LOG 'WAITLIST_ACCESS: operation=% user=% timestamp=%', 
        TG_OP, auth.uid(), now();
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for audit logging
CREATE TRIGGER waitlist_access_log
    AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.waitlist
    FOR EACH ROW
    EXECUTE FUNCTION public.log_waitlist_access();