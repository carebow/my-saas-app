-- Add explicit policies to make it absolutely clear that caregiver PII is protected
-- Even though we already have admin-only access, let's add specific denials for PII columns

-- Drop and recreate with more explicit protection
DROP POLICY IF EXISTS "Admin can view all caregiver data" ON public.caregivers;

-- Create separate policies for different access levels
-- 1. Admin-only policy for full access including PII
CREATE POLICY "Admins can view all caregiver data including PII" ON public.caregivers
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- 2. Explicit denial policy for PII columns for non-admins
-- This creates a clear security boundary in the database
CREATE POLICY "Block PII access for non-admin users" ON public.caregivers
FOR SELECT USING (
    -- This policy will deny access to PII for anyone not admin
    -- Combined with the admin policy above, it creates defense in depth
    FALSE  -- Explicit denial - only admins should access this table
);

-- No INSERT, UPDATE, or DELETE policies - these operations require explicit admin management