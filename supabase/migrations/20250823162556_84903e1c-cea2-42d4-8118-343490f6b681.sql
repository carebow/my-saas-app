-- Remove the problematic public policy that exposes PII
DROP POLICY IF EXISTS "Public can view safe caregiver data" ON public.caregivers;

-- The caregivers table should only be accessible to admins directly
-- All public access should go through the get_caregivers_safe() function
-- which only returns safe, non-PII fields: id, rating, reviews_count, 
-- experience_years, verification_status, specialities, languages, bio, image_url

-- The existing "Admin can view all caregiver data" policy remains in place
-- This ensures:
-- 1. Only admins can access the caregivers table directly
-- 2. Public users must use get_caregivers_safe() function for safe access
-- 3. PII fields (name, email, phone) are completely protected from public access