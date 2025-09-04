-- Add RLS policies for caregiver_profiles view
-- Enable RLS on the view
ALTER VIEW public.caregiver_profiles SET (security_barrier = true);

-- Create RLS policies for the caregiver_profiles view
-- Allow authenticated users to view verified caregiver profiles (non-PII data only)
CREATE POLICY "Authenticated users can view caregiver profiles" 
ON public.caregiver_profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Allow admins to view all caregiver profiles
CREATE POLICY "Admins can view all caregiver profiles" 
ON public.caregiver_profiles 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  )
);