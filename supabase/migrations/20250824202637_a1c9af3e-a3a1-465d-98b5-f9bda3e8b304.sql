
-- 1) Ensure RLS remains enabled on the caregivers table
ALTER TABLE public.caregivers ENABLE ROW LEVEL SECURITY;

-- 2) Remove any user-facing SELECT policies that expose full rows (and thus PII)
DROP POLICY IF EXISTS "Users can view non-PII caregiver data" ON public.caregivers;
DROP POLICY IF EXISTS "Users can view public caregiver info only" ON public.caregivers;

-- Note: Admin policies remain in place:
--   - "Admins can view all caregiver data" (SELECT)
--   - "Admins have full caregiver access" (ALL)
-- These are already present and rely on user_roles to gate access.

-- 3) Provide the safe surface for users via a view (non-PII only)
CREATE OR REPLACE VIEW public.caregiver_public_profiles AS
SELECT
  id,
  name,
  rating,
  reviews_count,
  experience_years,
  verification_status,
  specialities,
  languages,
  bio,
  image_url,
  created_at,
  updated_at
FROM public.caregivers
WHERE verification_status = 'verified';

-- Harden the view to prevent predicate pushdown/side-channel leakage
ALTER VIEW public.caregiver_public_profiles SET (security_barrier = true);

-- 4) Grant read access to authenticated users on the safe view only
GRANT SELECT ON public.caregiver_public_profiles TO authenticated;
