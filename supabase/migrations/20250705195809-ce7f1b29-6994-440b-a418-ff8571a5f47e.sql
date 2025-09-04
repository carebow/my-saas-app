-- Create tables for AI Symptom Checker functionality

-- Extended health profiles for comprehensive medical information
CREATE TABLE public.health_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date_of_birth DATE,
  gender TEXT,
  blood_type TEXT,
  height_cm INTEGER,
  weight_kg DECIMAL(5,2),
  chronic_conditions TEXT[] DEFAULT '{}',
  current_medications TEXT[] DEFAULT '{}',
  allergies TEXT[] DEFAULT '{}',
  family_medical_history JSONB DEFAULT '{}',
  lifestyle_factors JSONB DEFAULT '{}',
  cultural_preferences JSONB DEFAULT '{}',
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  primary_language TEXT DEFAULT 'en',
  preferred_medical_system TEXT DEFAULT 'conventional', -- conventional, ayurvedic, integrated
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Diagnostic sessions for tracking AI conversations
CREATE TABLE public.diagnostic_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL DEFAULT 'symptom_check', -- symptom_check, follow_up, emergency
  status TEXT NOT NULL DEFAULT 'active', -- active, completed, abandoned
  primary_complaint TEXT NOT NULL,
  conversation_data JSONB DEFAULT '{}',
  ai_confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  urgency_level TEXT, -- emergency, urgent, routine, self_care
  session_duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Symptom assessments for storing AI analysis results
CREATE TABLE public.symptom_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.diagnostic_sessions(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  symptoms_reported JSONB NOT NULL DEFAULT '{}',
  differential_diagnoses JSONB DEFAULT '{}', -- Array of possible conditions with confidence scores
  risk_factors JSONB DEFAULT '{}',
  red_flags JSONB DEFAULT '{}',
  assessment_reasoning TEXT,
  confidence_level TEXT NOT NULL, -- high, medium, low
  urgency_classification TEXT NOT NULL, -- emergency, urgent, routine, self_care
  follow_up_needed BOOLEAN DEFAULT false,
  follow_up_timeframe TEXT, -- immediate, 24h, 48h, 1week, 2weeks
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI recommendations for treatment and care pathways
CREATE TABLE public.ai_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES public.symptom_assessments(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL, -- treatment, lifestyle, referral, monitoring
  medical_system TEXT NOT NULL DEFAULT 'conventional', -- conventional, ayurvedic, integrated
  recommendations JSONB NOT NULL DEFAULT '{}',
  contraindications JSONB DEFAULT '{}',
  drug_interactions JSONB DEFAULT '{}',
  monitoring_parameters JSONB DEFAULT '{}',
  expected_outcomes TEXT,
  alternative_options JSONB DEFAULT '{}',
  cultural_adaptations JSONB DEFAULT '{}',
  confidence_score DECIMAL(3,2),
  evidence_sources TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Medical knowledge base for symptom-to-condition mappings
CREATE TABLE public.medical_knowledge_base (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  condition_name TEXT NOT NULL,
  condition_code TEXT, -- ICD-11 or SNOMED CT codes
  medical_system TEXT NOT NULL DEFAULT 'conventional', -- conventional, ayurvedic, tcm
  symptoms JSONB NOT NULL DEFAULT '{}',
  risk_factors JSONB DEFAULT '{}',
  diagnostic_criteria JSONB DEFAULT '{}',
  red_flags JSONB DEFAULT '{}',
  prevalence_data JSONB DEFAULT '{}',
  age_demographics JSONB DEFAULT '{}',
  geographic_prevalence JSONB DEFAULT '{}',
  seasonal_patterns JSONB DEFAULT '{}',
  evidence_level TEXT, -- high, moderate, low
  last_reviewed DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Care pathway tracking
CREATE TABLE public.care_pathways (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES public.symptom_assessments(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  pathway_type TEXT NOT NULL, -- teleconsult, home_visit, emergency, self_care, lab_test
  provider_type TEXT, -- doctor, nurse, specialist, lab, pharmacy
  scheduled_datetime TIMESTAMP WITH TIME ZONE,
  booking_id UUID REFERENCES public.bookings(id),
  status TEXT NOT NULL DEFAULT 'recommended', -- recommended, scheduled, completed, cancelled
  priority_level TEXT NOT NULL, -- emergency, urgent, routine
  notes TEXT,
  outcome JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.health_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_pathways ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for health_profiles
CREATE POLICY "Users can view own health profile" ON public.health_profiles
  FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can update own health profile" ON public.health_profiles
  FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own health profile" ON public.health_profiles
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Create RLS policies for diagnostic_sessions
CREATE POLICY "Users can view own diagnostic sessions" ON public.diagnostic_sessions
  FOR SELECT USING (auth.uid() = profile_id OR profile_id IS NULL);
CREATE POLICY "Users can create diagnostic sessions" ON public.diagnostic_sessions
  FOR INSERT WITH CHECK (auth.uid() = profile_id OR profile_id IS NULL);
CREATE POLICY "Users can update own diagnostic sessions" ON public.diagnostic_sessions
  FOR UPDATE USING (auth.uid() = profile_id OR profile_id IS NULL);

-- Create RLS policies for symptom_assessments
CREATE POLICY "Users can view own symptom assessments" ON public.symptom_assessments
  FOR SELECT USING (auth.uid() = profile_id OR profile_id IS NULL);
CREATE POLICY "Users can create symptom assessments" ON public.symptom_assessments
  FOR INSERT WITH CHECK (auth.uid() = profile_id OR profile_id IS NULL);

-- Create RLS policies for ai_recommendations
CREATE POLICY "Users can view own AI recommendations" ON public.ai_recommendations
  FOR SELECT USING (auth.uid() = profile_id OR profile_id IS NULL);
CREATE POLICY "Users can create AI recommendations" ON public.ai_recommendations
  FOR INSERT WITH CHECK (auth.uid() = profile_id OR profile_id IS NULL);

-- Create RLS policies for medical_knowledge_base (public read access)
CREATE POLICY "Public can view medical knowledge base" ON public.medical_knowledge_base
  FOR SELECT USING (true);

-- Create RLS policies for care_pathways
CREATE POLICY "Users can view own care pathways" ON public.care_pathways
  FOR SELECT USING (auth.uid() = profile_id OR profile_id IS NULL);
CREATE POLICY "Users can create care pathways" ON public.care_pathways
  FOR INSERT WITH CHECK (auth.uid() = profile_id OR profile_id IS NULL);
CREATE POLICY "Users can update own care pathways" ON public.care_pathways
  FOR UPDATE USING (auth.uid() = profile_id OR profile_id IS NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_health_profiles_updated_at
  BEFORE UPDATE ON public.health_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_diagnostic_sessions_updated_at
  BEFORE UPDATE ON public.diagnostic_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_symptom_assessments_updated_at
  BEFORE UPDATE ON public.symptom_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_recommendations_updated_at
  BEFORE UPDATE ON public.ai_recommendations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medical_knowledge_base_updated_at
  BEFORE UPDATE ON public.medical_knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_care_pathways_updated_at
  BEFORE UPDATE ON public.care_pathways
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_health_profiles_profile_id ON public.health_profiles(profile_id);
CREATE INDEX idx_diagnostic_sessions_profile_id ON public.diagnostic_sessions(profile_id);
CREATE INDEX idx_diagnostic_sessions_status ON public.diagnostic_sessions(status);
CREATE INDEX idx_symptom_assessments_session_id ON public.symptom_assessments(session_id);
CREATE INDEX idx_symptom_assessments_urgency ON public.symptom_assessments(urgency_classification);
CREATE INDEX idx_ai_recommendations_assessment_id ON public.ai_recommendations(assessment_id);
CREATE INDEX idx_medical_kb_condition ON public.medical_knowledge_base(condition_name);
CREATE INDEX idx_care_pathways_assessment_id ON public.care_pathways(assessment_id);
CREATE INDEX idx_care_pathways_status ON public.care_pathways(status);