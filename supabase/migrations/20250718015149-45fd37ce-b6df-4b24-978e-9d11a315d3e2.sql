-- Enhanced health profiles with comprehensive health data
ALTER TABLE public.health_profiles 
ADD COLUMN IF NOT EXISTS medical_history JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS lifestyle_preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS communication_preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS family_medical_history JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS mental_health_history JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS symptom_tracking JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS care_preferences JSONB DEFAULT '{}';

-- Create conversation sessions table for continuity
CREATE TABLE IF NOT EXISTS public.conversation_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id),
  session_type TEXT NOT NULL DEFAULT 'general',
  conversation_data JSONB DEFAULT '{}',
  current_context JSONB DEFAULT '{}',
  active_symptoms JSONB DEFAULT '{}',
  session_status TEXT DEFAULT 'active',
  urgency_level TEXT,
  follow_up_needed BOOLEAN DEFAULT false,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create health recommendations table
CREATE TABLE IF NOT EXISTS public.health_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.conversation_sessions(id),
  profile_id UUID REFERENCES public.profiles(id),
  recommendation_type TEXT NOT NULL,
  category TEXT NOT NULL, -- medical, ayurvedic, mental_health, lifestyle
  title TEXT NOT NULL,
  description TEXT,
  priority_level TEXT DEFAULT 'medium',
  evidence_level TEXT,
  cultural_context TEXT,
  implementation_guidance JSONB DEFAULT '{}',
  effectiveness_tracking JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) UNIQUE,
  ai_personality TEXT DEFAULT 'caring_nurse',
  communication_style TEXT DEFAULT 'balanced',
  medical_system_preference TEXT DEFAULT 'integrated',
  language_preference TEXT DEFAULT 'en',
  urgency_threshold TEXT DEFAULT 'medium',
  follow_up_frequency TEXT DEFAULT 'as_needed',
  privacy_settings JSONB DEFAULT '{}',
  notification_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create health insights table for tracking patterns
CREATE TABLE IF NOT EXISTS public.health_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id),
  insight_type TEXT NOT NULL,
  insight_data JSONB NOT NULL,
  confidence_score NUMERIC,
  time_period TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.conversation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversation_sessions
CREATE POLICY "Users can view own conversation sessions" 
ON public.conversation_sessions FOR SELECT 
USING (auth.uid() = profile_id);

CREATE POLICY "Users can create own conversation sessions" 
ON public.conversation_sessions FOR INSERT 
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own conversation sessions" 
ON public.conversation_sessions FOR UPDATE 
USING (auth.uid() = profile_id);

-- RLS Policies for health_recommendations
CREATE POLICY "Users can view own health recommendations" 
ON public.health_recommendations FOR SELECT 
USING (auth.uid() = profile_id);

CREATE POLICY "Users can create own health recommendations" 
ON public.health_recommendations FOR INSERT 
WITH CHECK (auth.uid() = profile_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view own preferences" 
ON public.user_preferences FOR SELECT 
USING (auth.uid() = profile_id);

CREATE POLICY "Users can create own preferences" 
ON public.user_preferences FOR INSERT 
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own preferences" 
ON public.user_preferences FOR UPDATE 
USING (auth.uid() = profile_id);

-- RLS Policies for health_insights
CREATE POLICY "Users can view own health insights" 
ON public.health_insights FOR SELECT 
USING (auth.uid() = profile_id);

CREATE POLICY "Users can create own health insights" 
ON public.health_insights FOR INSERT 
WITH CHECK (auth.uid() = profile_id);

-- Update triggers
CREATE TRIGGER update_conversation_sessions_updated_at
BEFORE UPDATE ON public.conversation_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_recommendations_updated_at
BEFORE UPDATE ON public.health_recommendations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();