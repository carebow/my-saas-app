-- Fix database function security issues with proper search paths

-- 1. Fix the is_admin() function with secure search path and remove the duplicate
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.is_admin(uuid);

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
STABLE 
SECURITY DEFINER
SET search_path = 'public', 'auth'
AS $$
BEGIN
  -- For now, return false. This can be enhanced later with admin role system
  -- When implementing admin roles, create a separate user_roles table
  RETURN false;
END;
$$;

-- 2. Fix handle_new_user() function with secure search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'auth'
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email);
  RETURN new;
END;
$$;

-- 3. Fix update_updated_at_column() function with secure search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 4. Strengthen RLS policies - remove permissive null profile_id policies

-- Fix diagnostic_sessions policies
DROP POLICY IF EXISTS "Users can create diagnostic sessions" ON public.diagnostic_sessions;
DROP POLICY IF EXISTS "Users can update own diagnostic sessions" ON public.diagnostic_sessions;
DROP POLICY IF EXISTS "Users can view own diagnostic sessions" ON public.diagnostic_sessions;

CREATE POLICY "Users can create own diagnostic sessions" 
ON public.diagnostic_sessions 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own diagnostic sessions" 
ON public.diagnostic_sessions 
FOR UPDATE 
TO authenticated
USING (auth.uid() = profile_id);

CREATE POLICY "Users can view own diagnostic sessions" 
ON public.diagnostic_sessions 
FOR SELECT 
TO authenticated
USING (auth.uid() = profile_id);

-- Fix symptom_assessments policies
DROP POLICY IF EXISTS "Users can create symptom assessments" ON public.symptom_assessments;
DROP POLICY IF EXISTS "Users can view own symptom assessments" ON public.symptom_assessments;

CREATE POLICY "Users can create own symptom assessments" 
ON public.symptom_assessments 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can view own symptom assessments" 
ON public.symptom_assessments 
FOR SELECT 
TO authenticated
USING (auth.uid() = profile_id);

-- Fix ai_recommendations policies
DROP POLICY IF EXISTS "Users can create AI recommendations" ON public.ai_recommendations;
DROP POLICY IF EXISTS "Users can view own AI recommendations" ON public.ai_recommendations;

CREATE POLICY "Users can create own AI recommendations" 
ON public.ai_recommendations 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can view own AI recommendations" 
ON public.ai_recommendations 
FOR SELECT 
TO authenticated
USING (auth.uid() = profile_id);

-- Fix care_pathways policies
DROP POLICY IF EXISTS "Users can create care pathways" ON public.care_pathways;
DROP POLICY IF EXISTS "Users can update own care pathways" ON public.care_pathways;
DROP POLICY IF EXISTS "Users can view own care pathways" ON public.care_pathways;

CREATE POLICY "Users can create own care pathways" 
ON public.care_pathways 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own care pathways" 
ON public.care_pathways 
FOR UPDATE 
TO authenticated
USING (auth.uid() = profile_id);

CREATE POLICY "Users can view own care pathways" 
ON public.care_pathways 
FOR SELECT 
TO authenticated
USING (auth.uid() = profile_id);

-- 5. Add security audit function for sensitive operations
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type text,
  table_name text,
  record_id uuid DEFAULT NULL,
  user_id uuid DEFAULT auth.uid(),
  metadata jsonb DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log security events for monitoring
  -- In production, this would write to a security audit table
  RAISE LOG 'SECURITY_EVENT: type=% table=% record=% user=% meta=%', 
    event_type, table_name, record_id, user_id, metadata;
END;
$$;