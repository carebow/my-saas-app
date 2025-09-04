import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Security-Policy': "default-src 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

// Enhanced input validation for symptom analysis
const validateSymptomInput = (input: unknown): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!input || typeof input !== 'object') {
    errors.push('Invalid request body');
    return { isValid: false, errors };
  }
  
  if (!input.symptoms || typeof input.symptoms !== 'string') {
    errors.push('Symptoms are required and must be a string');
  } else if (input.symptoms.length > 2000) {
    errors.push('Symptoms description too long (max 2000 characters)');
  }
  
  if (input.userContext) {
    const { age, gender } = input.userContext;
    if (age && (typeof age !== 'number' || age < 0 || age > 150)) {
      errors.push('Age must be a valid number between 0 and 150');
    }
    if (gender && typeof gender !== 'string') {
      errors.push('Gender must be a string');
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

const sanitizeInput = (str: string): string => {
  return str.replace(/[<>]/g, '').trim().substring(0, 2000);
};

interface SymptomAnalysisRequest {
  sessionId?: string;
  profileId?: string;
  symptoms: string;
  conversationHistory?: Array<{role: string, content: string}>;
  userContext?: {
    age?: number;
    gender?: string;
    medicalHistory?: string[];
    currentMedications?: string[];
    location?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with anon key for user operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get authorization header and authenticate user
    const authorization = req.headers.get('Authorization');
    if (!authorization) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authorization.replace('Bearer ', '')
    );
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requestBody = await req.json();
    
    // Validate input
    const validation = validateSymptomInput(requestBody);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validation.errors }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Sanitize and extract data
    const { 
      sessionId, 
      conversationHistory = [], 
      userContext = {} 
    } = requestBody;
    // Use authenticated user ID instead of client-supplied profileId
    const profileId = user.id;
    
    const symptoms = sanitizeInput(requestBody.symptoms);

    console.log('Analyzing symptoms:', { symptoms: symptoms.substring(0, 100), userContext });

    // If sessionId provided, verify it belongs to the user
    if (sessionId) {
      const { data: existingSession, error: sessionCheckError } = await supabaseClient
        .from('diagnostic_sessions')
        .select('id, profile_id')
        .eq('id', sessionId)
        .eq('profile_id', profileId)
        .maybeSingle();
      
      if (sessionCheckError) {
        throw new Error(`Session verification failed: ${sessionCheckError.message}`);
      }
      
      if (!existingSession) {
        return new Response(
          JSON.stringify({ error: 'Session not found or access denied' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Create or update diagnostic session
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const { data: sessionData, error: sessionError } = await supabaseClient
        .from('diagnostic_sessions')
        .insert({
          profile_id: profileId,
          primary_complaint: symptoms,
          conversation_data: { history: conversationHistory },
          status: 'active'
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Error creating session:', sessionError);
        throw new Error('Failed to create diagnostic session');
      }
      currentSessionId = sessionData.id;
    }

    // Build comprehensive prompt for symptom analysis
    const systemPrompt = `You are CareBow AI, an empathetic, emotionally intelligent health companion specializing in comprehensive symptom analysis. Your mission is to help users feel heard, understood, and safely guided through their health concerns.

Your approach:

🧘‍♀️ **Emotional Intelligence First:**
- Recognize signs of anxiety, fear, or confusion in users' messages
- Offer immediate comfort and reassurance when someone seems worried
- Use warm, natural language that feels like talking to a caring friend
- Validate their concerns: "I understand you're worried about..."

💬 **Gentle Assessment:**
- Ask 1-2 thoughtful follow-up questions about severity, triggers, and emotional state
- Consider their age, gender, medical history, and cultural background
- Identify red flags with calm urgency, not alarm
- Use natural language for possible conditions, avoiding clinical jargon

🌿 **Holistic Care Guidance:**
- Suggest safe, natural remedies when appropriate
- Consider both conventional and traditional healing approaches
- Provide clear care level recommendations (self-care, routine, urgent, emergency)
- Always include emotional support alongside medical guidance

❤️ **Supportive Next Steps:**
- If emergency: "I'm concerned about these symptoms. Please seek immediate care."
- If routine: "Let's monitor this together. Here's what to watch for..."
- Always offer hope and reassurance where appropriate

Remember: You're not just analyzing symptoms - you're providing comfort to someone who may be scared about their health. Lead with empathy, follow with expertise.

Patient Context:
${userContext.age ? `Age: ${userContext.age}` : ''}
${userContext.gender ? `Gender: ${userContext.gender}` : ''}
${userContext.medicalHistory?.length ? `Medical History: ${userContext.medicalHistory.join(', ')}` : ''}
${userContext.currentMedications?.length ? `Current Medications: ${userContext.currentMedications.join(', ')}` : ''}
${userContext.location ? `Location: ${userContext.location}` : ''}

Respond in JSON format with:
{
  "response": "Your warm, empathetic response to the patient",
  "followUpQuestions": ["gentle question1", "caring question2"],
  "preliminaryAssessment": {
    "possibleConditions": [{"condition": "name in natural language", "confidence": 0.8, "reasoning": "why this makes sense"}],
    "urgencyLevel": "routine|urgent|emergency",
    "redFlags": ["concerning sign1", "concerning sign2"],
    "recommendedAction": "what they should do next, with emotional support"
  },
  "needsMoreInfo": true/false
}`;

    // Prepare conversation for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: symptoms }
    ];

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.statusText}`);
    }

    const aiResult = await openAIResponse.json();
    let analysisResult;

    try {
      analysisResult = JSON.parse(aiResult.choices[0].message.content);
    } catch (e) {
      // Fallback if JSON parsing fails
      analysisResult = {
        response: aiResult.choices[0].message.content,
        needsMoreInfo: true,
        preliminaryAssessment: {
          urgencyLevel: 'routine',
          recommendedAction: 'Please provide more specific information about your symptoms.'
        }
      };
    }

    // Update session with conversation data
    const updatedHistory = [...conversationHistory, 
      { role: 'user', content: symptoms },
      { role: 'assistant', content: analysisResult.response }
    ];

    await supabaseClient
      .from('diagnostic_sessions')
      .update({
        conversation_data: { history: updatedHistory },
        urgency_level: analysisResult.preliminaryAssessment?.urgencyLevel || 'routine',
        updated_at: new Date().toISOString()
      })
      .eq('id', currentSessionId);

    // If assessment is complete, create symptom assessment record
    if (!analysisResult.needsMoreInfo && analysisResult.preliminaryAssessment) {
      const assessment = analysisResult.preliminaryAssessment;
      
      await supabaseClient
        .from('symptom_assessments')
        .insert({
          session_id: currentSessionId,
          profile_id: profileId,
          symptoms_reported: { primary: symptoms, context: userContext },
          differential_diagnoses: assessment.possibleConditions || [],
          red_flags: assessment.redFlags || [],
          assessment_reasoning: analysisResult.response,
          confidence_level: assessment.possibleConditions?.[0]?.confidence > 0.7 ? 'high' : 
                           assessment.possibleConditions?.[0]?.confidence > 0.4 ? 'medium' : 'low',
          urgency_classification: assessment.urgencyLevel || 'routine',
          follow_up_needed: assessment.urgencyLevel !== 'self_care'
        });
    }

    console.log('Analysis completed successfully');

    return new Response(JSON.stringify({
      success: true,
      sessionId: currentSessionId,
      analysis: analysisResult
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('SECURITY_EVENT: symptom-analyzer-error', {
      timestamp: new Date().toISOString(),
      error: error.message,
      userAgent: req.headers.get('user-agent')
    });
    
    return new Response(JSON.stringify({ 
      error: 'An error occurred during symptom analysis'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});