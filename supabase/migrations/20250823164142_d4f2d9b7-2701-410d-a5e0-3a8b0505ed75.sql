-- Check current waitlist policies and ensure only admins can read customer data
-- Remove any potential public read access and ensure strict admin-only access

-- First, drop all existing policies to start clean
DROP POLICY IF EXISTS "Admin can view waitlist entries" ON public.waitlist;
DROP POLICY IF EXISTS "Allow insert for all" ON public.waitlist;
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Public can view waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Users can view waitlist" ON public.waitlist;

-- Create a single, secure policy for waitlist reads - ADMIN ONLY
CREATE POLICY "Admins only can view waitlist data" ON public.waitlist
FOR SELECT USING (
    -- Only users with admin role can view waitlist data
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Allow anyone to join the waitlist (this is needed for the signup form)
CREATE POLICY "Allow public waitlist signup" ON public.waitlist
FOR INSERT WITH CHECK (true);

-- Prevent any updates or deletes to protect data integrity
-- No UPDATE or DELETE policies = no one can modify existing entries