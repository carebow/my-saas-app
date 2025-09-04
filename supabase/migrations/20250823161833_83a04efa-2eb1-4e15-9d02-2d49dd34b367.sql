-- Tighten subscribers RLS policies to prevent arbitrary inserts
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;

-- Create more restrictive INSERT policy for subscribers
CREATE POLICY "Users can create own subscription" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (
  (user_id = auth.uid() AND email = auth.email()) 
  OR 
  (user_id IS NULL AND email = auth.email())
);

-- Add DELETE policies for user-owned data tables
CREATE POLICY "Users can delete own health profile" 
ON public.health_profiles 
FOR DELETE 
USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own health recommendations" 
ON public.health_recommendations 
FOR DELETE 
USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own symptom assessments" 
ON public.symptom_assessments 
FOR DELETE 
USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own diagnostic sessions" 
ON public.diagnostic_sessions 
FOR DELETE 
USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own AI recommendations" 
ON public.ai_recommendations 
FOR DELETE 
USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own health insights" 
ON public.health_insights 
FOR DELETE 
USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own user preferences" 
ON public.user_preferences 
FOR DELETE 
USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own conversation sessions" 
ON public.conversation_sessions 
FOR DELETE 
USING (auth.uid() = profile_id);