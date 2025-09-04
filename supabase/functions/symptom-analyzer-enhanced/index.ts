import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Extract Authorization header for user verification
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization required');
    }

    const { sessionId, symptoms, conversationHistory } = await req.json();
    console.log('Enhanced symptom analysis request:', { sessionId, symptoms });

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Verify user authentication and get profile
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    // Get conversation session and verify ownership
    const { data: session } = await supabase
      .from('conversation_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('profile_id', user.id)
      .single();

    if (!session) {
      throw new Error('Session not found or access denied');
    }

    // Create comprehensive analysis prompt
    const analysisPrompt = `You are CareBow's Advanced AI Health Analyzer. Provide a comprehensive health assessment based on the conversation.

USER PROFILE: ${JSON.stringify(profileData || {})}
CONVERSATION HISTORY: ${JSON.stringify(conversationHistory || [])}
REPORTED SYMPTOMS: ${JSON.stringify(symptoms || {})}

Provide a detailed analysis in JSON format with these sections:

{
  "assessment": {
    "primaryConcern": "Main health issue identified",
    "confidenceLevel": "high/medium/low",
    "urgencyLevel": "emergency/urgent/moderate/low",
    "reasoningProcess": "Detailed explanation of your analysis"
  },
  "recommendations": {
    "medical": [
      {
        "type": "immediate/routine/preventive",
        "title": "Recommendation title",
        "description": "Detailed description",
        "priority": "high/medium/low"
      }
    ],
    "natural": [
      {
        "type": "ayurvedic/herbal/dietary/lifestyle",
        "title": "Natural remedy title",
        "description": "Detailed description with usage instructions",
        "culturalContext": "Traditional background if applicable"
      }
    ],
    "mentalHealth": [
      {
        "type": "breathing/meditation/counseling/support",
        "title": "Mental health support",
        "description": "Detailed guidance"
      }
    ],
    "lifestyle": [
      {
        "type": "diet/exercise/sleep/stress",
        "title": "Lifestyle modification",
        "description": "Specific actionable advice"
      }
    ]
  },
  "followUp": {
    "needed": true/false,
    "timeframe": "immediate/24hours/week/month",
    "instructions": "What to watch for or when to seek care"
  },
  "redFlags": [
    "Symptoms that would require immediate medical attention"
  ]
}

Focus on holistic care that respects the user's cultural preferences and medical system choices.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: analysisPrompt },
          { role: 'user', content: 'Please provide a comprehensive health analysis based on the provided information.' }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    let analysis;
    
    try {
      analysis = JSON.parse(aiResponse.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      throw new Error('Failed to generate structured analysis');
    }

    // Create diagnostic session record (use authenticated user's ID)
    const { data: diagnosticSession } = await supabase
      .from('diagnostic_sessions')
      .insert({
        profile_id: user.id,
        session_type: 'enhanced_analysis',
        primary_complaint: analysis.assessment?.primaryConcern || 'General health concern',
        urgency_level: analysis.assessment?.urgencyLevel || 'low',
        ai_confidence_score: analysis.assessment?.confidenceLevel === 'high' ? 0.9 : 
                           analysis.assessment?.confidenceLevel === 'medium' ? 0.7 : 0.5,
        conversation_data: { 
          originalSession: sessionId,
          analysis,
          conversationHistory 
        },
        status: 'completed'
      })
      .select()
      .single();

    // Create symptom assessment record (use authenticated user's ID)
    const { data: symptomAssessment } = await supabase
      .from('symptom_assessments')
      .insert({
        session_id: diagnosticSession.id,
        profile_id: user.id,
        symptoms_reported: symptoms || {},
        assessment_reasoning: analysis.assessment?.reasoningProcess,
        confidence_level: analysis.assessment?.confidenceLevel || 'medium',
        urgency_classification: analysis.assessment?.urgencyLevel || 'low',
        follow_up_needed: analysis.followUp?.needed || false,
        follow_up_timeframe: analysis.followUp?.timeframe,
        red_flags: analysis.redFlags || [],
        differential_diagnoses: analysis.assessment || {}
      })
      .select()
      .single();

    // Save recommendations
    const recommendations = [];
    
    // Process all recommendation categories
    ['medical', 'natural', 'mentalHealth', 'lifestyle'].forEach(category => {
      if (analysis.recommendations?.[category]) {
        analysis.recommendations[category].forEach(rec => {
          recommendations.push({
            session_id: diagnosticSession.id,
            profile_id: user.id,
            recommendation_type: rec.type || category,
            category: category,
            title: rec.title,
            description: rec.description,
            priority_level: rec.priority || 'medium',
            cultural_context: rec.culturalContext || null,
            implementation_guidance: {
              instructions: rec.description,
              timeframe: analysis.followUp?.timeframe
            }
          });
        });
      }
    });

    if (recommendations.length > 0) {
      await supabase
        .from('health_recommendations')
        .insert(recommendations);
    }

    // Update conversation session status
    await supabase
      .from('conversation_sessions')
      .update({
        session_status: 'completed',
        urgency_level: analysis.assessment?.urgencyLevel,
        follow_up_needed: analysis.followUp?.needed,
        follow_up_date: analysis.followUp?.needed ? 
          new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null
      })
      .eq('id', sessionId);

    console.log('Enhanced symptom analysis completed successfully');

    return new Response(JSON.stringify({
      assessmentId: symptomAssessment.id,
      diagnosticSessionId: diagnosticSession.id,
      analysis,
      recommendations: recommendations.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in symptom-analyzer-enhanced function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to analyze symptoms',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});