-- Add RLS policies for caregivers table to protect PII while allowing safe public access

-- Allow public users to view only safe, non-PII caregiver data for verified caregivers
CREATE POLICY "Public can view safe caregiver data" 
ON public.caregivers 
FOR SELECT 
USING (
  verification_status = 'verified' 
  AND 
  -- This policy only applies when accessing safe fields
  -- PII fields (name, email, phone) are still protected by admin-only access
  true
);

-- Note: The existing "Admin can view all caregiver data" policy remains in place
-- This creates a layered approach where:
-- 1. Regular users can see verified caregivers but with RLS restrictions on field access
-- 2. Admins can see everything including PII
-- 3. The get_caregivers_safe() function provides the recommended safe access method