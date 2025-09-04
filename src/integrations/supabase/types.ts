export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          created_at: string | null
          id: string
          is_primary: boolean | null
          line1: string
          line2: string | null
          postal_code: string
          profile_id: string
          state: string
          title: string
          updated_at: string | null
        }
        Insert: {
          city: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          line1: string
          line2?: string | null
          postal_code: string
          profile_id: string
          state: string
          title: string
          updated_at?: string | null
        }
        Update: {
          city?: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          line1?: string
          line2?: string | null
          postal_code?: string
          profile_id?: string
          state?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_recommendations: {
        Row: {
          alternative_options: Json | null
          assessment_id: string
          confidence_score: number | null
          contraindications: Json | null
          created_at: string
          cultural_adaptations: Json | null
          drug_interactions: Json | null
          evidence_sources: string[] | null
          expected_outcomes: string | null
          id: string
          medical_system: string
          monitoring_parameters: Json | null
          profile_id: string | null
          recommendation_type: string
          recommendations: Json
          updated_at: string
        }
        Insert: {
          alternative_options?: Json | null
          assessment_id: string
          confidence_score?: number | null
          contraindications?: Json | null
          created_at?: string
          cultural_adaptations?: Json | null
          drug_interactions?: Json | null
          evidence_sources?: string[] | null
          expected_outcomes?: string | null
          id?: string
          medical_system?: string
          monitoring_parameters?: Json | null
          profile_id?: string | null
          recommendation_type: string
          recommendations?: Json
          updated_at?: string
        }
        Update: {
          alternative_options?: Json | null
          assessment_id?: string
          confidence_score?: number | null
          contraindications?: Json | null
          created_at?: string
          cultural_adaptations?: Json | null
          drug_interactions?: Json | null
          evidence_sources?: string[] | null
          expected_outcomes?: string | null
          id?: string
          medical_system?: string
          monitoring_parameters?: Json | null
          profile_id?: string | null
          recommendation_type?: string
          recommendations?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "symptom_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_recommendations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          care_recipient_id: string
          caregiver_id: string
          created_at: string | null
          date_time: string
          duration: number
          id: string
          notes: string | null
          profile_id: string
          service_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          care_recipient_id: string
          caregiver_id: string
          created_at?: string | null
          date_time: string
          duration: number
          id?: string
          notes?: string | null
          profile_id: string
          service_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          care_recipient_id?: string
          caregiver_id?: string
          created_at?: string | null
          date_time?: string
          duration?: number
          id?: string
          notes?: string | null
          profile_id?: string
          service_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_care_recipient_id_fkey"
            columns: ["care_recipient_id"]
            isOneToOne: false
            referencedRelation: "care_recipients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_caregiver_id_fkey"
            columns: ["caregiver_id"]
            isOneToOne: false
            referencedRelation: "caregiver_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_caregiver_id_fkey"
            columns: ["caregiver_id"]
            isOneToOne: false
            referencedRelation: "caregivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      care_pathways: {
        Row: {
          assessment_id: string
          booking_id: string | null
          created_at: string
          id: string
          notes: string | null
          outcome: Json | null
          pathway_type: string
          priority_level: string
          profile_id: string | null
          provider_type: string | null
          scheduled_datetime: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assessment_id: string
          booking_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          outcome?: Json | null
          pathway_type: string
          priority_level: string
          profile_id?: string | null
          provider_type?: string | null
          scheduled_datetime?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assessment_id?: string
          booking_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          outcome?: Json | null
          pathway_type?: string
          priority_level?: string
          profile_id?: string | null
          provider_type?: string | null
          scheduled_datetime?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_pathways_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "symptom_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_pathways_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_pathways_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      care_recipients: {
        Row: {
          age: number
          allergies: string[] | null
          created_at: string | null
          id: string
          medical_conditions: string[] | null
          name: string
          notes: string | null
          profile_id: string
          relationship: string
          updated_at: string | null
        }
        Insert: {
          age: number
          allergies?: string[] | null
          created_at?: string | null
          id?: string
          medical_conditions?: string[] | null
          name: string
          notes?: string | null
          profile_id: string
          relationship: string
          updated_at?: string | null
        }
        Update: {
          age?: number
          allergies?: string[] | null
          created_at?: string | null
          id?: string
          medical_conditions?: string[] | null
          name?: string
          notes?: string | null
          profile_id?: string
          relationship?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "care_recipients_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      caregiver_public_profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          experience_years: number | null
          id: string
          image_url: string | null
          languages: string[] | null
          name: string | null
          rating: number | null
          reviews_count: number | null
          specialities: string[] | null
          updated_at: string | null
          verification_status: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          experience_years?: number | null
          id?: string
          image_url?: string | null
          languages?: string[] | null
          name?: string | null
          rating?: number | null
          reviews_count?: number | null
          specialities?: string[] | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          experience_years?: number | null
          id?: string
          image_url?: string | null
          languages?: string[] | null
          name?: string | null
          rating?: number | null
          reviews_count?: number | null
          specialities?: string[] | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      caregivers: {
        Row: {
          bio: string | null
          created_at: string | null
          email: string
          experience_years: number | null
          id: string
          image_url: string | null
          languages: string[] | null
          name: string
          phone: string
          rating: number | null
          reviews_count: number | null
          specialities: string[] | null
          updated_at: string | null
          verification_status: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          email: string
          experience_years?: number | null
          id?: string
          image_url?: string | null
          languages?: string[] | null
          name: string
          phone: string
          rating?: number | null
          reviews_count?: number | null
          specialities?: string[] | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          email?: string
          experience_years?: number | null
          id?: string
          image_url?: string | null
          languages?: string[] | null
          name?: string
          phone?: string
          rating?: number | null
          reviews_count?: number | null
          specialities?: string[] | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      conversation_sessions: {
        Row: {
          active_symptoms: Json | null
          conversation_data: Json | null
          created_at: string
          current_context: Json | null
          follow_up_date: string | null
          follow_up_needed: boolean | null
          id: string
          profile_id: string | null
          session_status: string | null
          session_type: string
          updated_at: string
          urgency_level: string | null
        }
        Insert: {
          active_symptoms?: Json | null
          conversation_data?: Json | null
          created_at?: string
          current_context?: Json | null
          follow_up_date?: string | null
          follow_up_needed?: boolean | null
          id?: string
          profile_id?: string | null
          session_status?: string | null
          session_type?: string
          updated_at?: string
          urgency_level?: string | null
        }
        Update: {
          active_symptoms?: Json | null
          conversation_data?: Json | null
          created_at?: string
          current_context?: Json | null
          follow_up_date?: string | null
          follow_up_needed?: boolean | null
          id?: string
          profile_id?: string | null
          session_status?: string | null
          session_type?: string
          updated_at?: string
          urgency_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_sessions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_sessions: {
        Row: {
          ai_confidence_score: number | null
          conversation_data: Json | null
          created_at: string
          id: string
          primary_complaint: string
          profile_id: string | null
          session_duration_seconds: number | null
          session_type: string
          status: string
          updated_at: string
          urgency_level: string | null
        }
        Insert: {
          ai_confidence_score?: number | null
          conversation_data?: Json | null
          created_at?: string
          id?: string
          primary_complaint: string
          profile_id?: string | null
          session_duration_seconds?: number | null
          session_type?: string
          status?: string
          updated_at?: string
          urgency_level?: string | null
        }
        Update: {
          ai_confidence_score?: number | null
          conversation_data?: Json | null
          created_at?: string
          id?: string
          primary_complaint?: string
          profile_id?: string | null
          session_duration_seconds?: number | null
          session_type?: string
          status?: string
          updated_at?: string
          urgency_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_sessions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_insights: {
        Row: {
          confidence_score: number | null
          created_at: string
          id: string
          insight_data: Json
          insight_type: string
          profile_id: string | null
          time_period: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          insight_data: Json
          insight_type: string
          profile_id?: string | null
          time_period?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          insight_data?: Json
          insight_type?: string
          profile_id?: string | null
          time_period?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_insights_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_profiles: {
        Row: {
          allergies: string[] | null
          blood_type: string | null
          care_preferences: Json | null
          chronic_conditions: string[] | null
          communication_preferences: Json | null
          created_at: string
          cultural_preferences: Json | null
          current_medications: string[] | null
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          family_medical_history: Json | null
          gender: string | null
          height_cm: number | null
          id: string
          lifestyle_factors: Json | null
          lifestyle_preferences: Json | null
          medical_history: Json | null
          mental_health_history: Json | null
          preferred_medical_system: string | null
          primary_language: string | null
          profile_id: string
          symptom_tracking: Json | null
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          allergies?: string[] | null
          blood_type?: string | null
          care_preferences?: Json | null
          chronic_conditions?: string[] | null
          communication_preferences?: Json | null
          created_at?: string
          cultural_preferences?: Json | null
          current_medications?: string[] | null
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          family_medical_history?: Json | null
          gender?: string | null
          height_cm?: number | null
          id?: string
          lifestyle_factors?: Json | null
          lifestyle_preferences?: Json | null
          medical_history?: Json | null
          mental_health_history?: Json | null
          preferred_medical_system?: string | null
          primary_language?: string | null
          profile_id: string
          symptom_tracking?: Json | null
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          allergies?: string[] | null
          blood_type?: string | null
          care_preferences?: Json | null
          chronic_conditions?: string[] | null
          communication_preferences?: Json | null
          created_at?: string
          cultural_preferences?: Json | null
          current_medications?: string[] | null
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          family_medical_history?: Json | null
          gender?: string | null
          height_cm?: number | null
          id?: string
          lifestyle_factors?: Json | null
          lifestyle_preferences?: Json | null
          medical_history?: Json | null
          mental_health_history?: Json | null
          preferred_medical_system?: string | null
          primary_language?: string | null
          profile_id?: string
          symptom_tracking?: Json | null
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "health_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_recommendations: {
        Row: {
          category: string
          created_at: string
          cultural_context: string | null
          description: string | null
          effectiveness_tracking: Json | null
          evidence_level: string | null
          id: string
          implementation_guidance: Json | null
          priority_level: string | null
          profile_id: string | null
          recommendation_type: string
          session_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          cultural_context?: string | null
          description?: string | null
          effectiveness_tracking?: Json | null
          evidence_level?: string | null
          id?: string
          implementation_guidance?: Json | null
          priority_level?: string | null
          profile_id?: string | null
          recommendation_type: string
          session_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          cultural_context?: string | null
          description?: string | null
          effectiveness_tracking?: Json | null
          evidence_level?: string | null
          id?: string
          implementation_guidance?: Json | null
          priority_level?: string | null
          profile_id?: string | null
          recommendation_type?: string
          session_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_recommendations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_recommendations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "conversation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_knowledge_base: {
        Row: {
          age_demographics: Json | null
          condition_code: string | null
          condition_name: string
          created_at: string
          diagnostic_criteria: Json | null
          evidence_level: string | null
          geographic_prevalence: Json | null
          id: string
          last_reviewed: string | null
          medical_system: string
          prevalence_data: Json | null
          red_flags: Json | null
          risk_factors: Json | null
          seasonal_patterns: Json | null
          symptoms: Json
          updated_at: string
        }
        Insert: {
          age_demographics?: Json | null
          condition_code?: string | null
          condition_name: string
          created_at?: string
          diagnostic_criteria?: Json | null
          evidence_level?: string | null
          geographic_prevalence?: Json | null
          id?: string
          last_reviewed?: string | null
          medical_system?: string
          prevalence_data?: Json | null
          red_flags?: Json | null
          risk_factors?: Json | null
          seasonal_patterns?: Json | null
          symptoms?: Json
          updated_at?: string
        }
        Update: {
          age_demographics?: Json | null
          condition_code?: string | null
          condition_name?: string
          created_at?: string
          diagnostic_criteria?: Json | null
          evidence_level?: string | null
          geographic_prevalence?: Json | null
          id?: string
          last_reviewed?: string | null
          medical_system?: string
          prevalence_data?: Json | null
          red_flags?: Json | null
          risk_factors?: Json | null
          seasonal_patterns?: Json | null
          symptoms?: Json
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string | null
          id: string
          payment_method: string | null
          profile_id: string
          status: string | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string | null
          id?: string
          payment_method?: string | null
          profile_id: string
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string | null
          id?: string
          payment_method?: string | null
          profile_id?: string
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string | null
          description: string
          duration: number
          id: string
          image_url: string | null
          price: number
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          duration: number
          id?: string
          image_url?: string | null
          price: number
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          duration?: number
          id?: string
          image_url?: string | null
          price?: number
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      symptom_assessments: {
        Row: {
          assessment_reasoning: string | null
          confidence_level: string
          created_at: string
          differential_diagnoses: Json | null
          follow_up_needed: boolean | null
          follow_up_timeframe: string | null
          id: string
          profile_id: string | null
          red_flags: Json | null
          risk_factors: Json | null
          session_id: string
          symptoms_reported: Json
          updated_at: string
          urgency_classification: string
        }
        Insert: {
          assessment_reasoning?: string | null
          confidence_level: string
          created_at?: string
          differential_diagnoses?: Json | null
          follow_up_needed?: boolean | null
          follow_up_timeframe?: string | null
          id?: string
          profile_id?: string | null
          red_flags?: Json | null
          risk_factors?: Json | null
          session_id: string
          symptoms_reported?: Json
          updated_at?: string
          urgency_classification: string
        }
        Update: {
          assessment_reasoning?: string | null
          confidence_level?: string
          created_at?: string
          differential_diagnoses?: Json | null
          follow_up_needed?: boolean | null
          follow_up_timeframe?: string | null
          id?: string
          profile_id?: string | null
          red_flags?: Json | null
          risk_factors?: Json | null
          session_id?: string
          symptoms_reported?: Json
          updated_at?: string
          urgency_classification?: string
        }
        Relationships: [
          {
            foreignKeyName: "symptom_assessments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "symptom_assessments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          ai_personality: string | null
          communication_style: string | null
          created_at: string
          follow_up_frequency: string | null
          id: string
          language_preference: string | null
          medical_system_preference: string | null
          notification_preferences: Json | null
          privacy_settings: Json | null
          profile_id: string | null
          updated_at: string
          urgency_threshold: string | null
        }
        Insert: {
          ai_personality?: string | null
          communication_style?: string | null
          created_at?: string
          follow_up_frequency?: string | null
          id?: string
          language_preference?: string | null
          medical_system_preference?: string | null
          notification_preferences?: Json | null
          privacy_settings?: Json | null
          profile_id?: string | null
          updated_at?: string
          urgency_threshold?: string | null
        }
        Update: {
          ai_personality?: string | null
          communication_style?: string | null
          created_at?: string
          follow_up_frequency?: string | null
          id?: string
          language_preference?: string | null
          medical_system_preference?: string | null
          notification_preferences?: Json | null
          privacy_settings?: Json | null
          profile_id?: string | null
          updated_at?: string
          urgency_threshold?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          care_type: string | null
          email: string
          hear_about: string | null
          id: string
          joined_at: string
          location: string | null
          name: string
          questions: string | null
          queue_position: number | null
          signup_for: string | null
        }
        Insert: {
          care_type?: string | null
          email: string
          hear_about?: string | null
          id?: string
          joined_at?: string
          location?: string | null
          name: string
          questions?: string | null
          queue_position?: number | null
          signup_for?: string | null
        }
        Update: {
          care_type?: string | null
          email?: string
          hear_about?: string | null
          id?: string
          joined_at?: string
          location?: string | null
          name?: string
          questions?: string | null
          queue_position?: number | null
          signup_for?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      caregiver_profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          experience_years: number | null
          id: string | null
          image_url: string | null
          languages: string[] | null
          rating: number | null
          reviews_count: number | null
          specialities: string[] | null
          verification_status: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          experience_years?: number | null
          id?: string | null
          image_url?: string | null
          languages?: string[] | null
          rating?: number | null
          reviews_count?: number | null
          specialities?: string[] | null
          verification_status?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          experience_years?: number | null
          id?: string | null
          image_url?: string | null
          languages?: string[] | null
          rating?: number | null
          reviews_count?: number | null
          specialities?: string[] | null
          verification_status?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_waitlist_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          event_type: string
          metadata?: Json
          record_id?: string
          table_name: string
          user_id?: string
        }
        Returns: undefined
      }
      search_caregivers: {
        Args: { search_language?: string; search_speciality?: string }
        Returns: {
          bio: string
          experience_years: number
          id: string
          image_url: string
          languages: string[]
          rating: number
          reviews_count: number
          specialities: string[]
          verification_status: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
