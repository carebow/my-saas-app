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

    const { message, sessionId, profileData, conversationHistory } = await req.json();
    console.log('Health interview request:', { sessionId, message: message?.substring(0, 100) });

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get or create conversation session
    let session;
    if (sessionId) {
      const { data } = await supabase
        .from('conversation_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      session = data;
    }

    if (!session) {
      const { data: newSession } = await supabase
        .from('conversation_sessions')
        .insert({
          profile_id: profileData?.id || null,
          session_type: 'health_interview',
          conversation_data: { messages: [] },
          current_context: {},
          active_symptoms: {},
        })
        .select()
        .single();
      session = newSession;
    }

    // Build AI conversation context
    const systemPrompt = `You are CareBow's AI Health Companion - a compassionate, intelligent health guide that combines medical knowledge, natural healing wisdom, and mental health support.

PERSONALITY: You are warm, caring, and professional - like a wise, experienced nurse who genuinely cares about each person's wellbeing.

YOUR ROLE:
- Conduct thoughtful health interviews like a skilled doctor would
- Ask one meaningful follow-up question at a time
- Blend conventional medicine with natural/Ayurvedic approaches when appropriate
- Provide mental health support and lifestyle guidance
- Assess urgency levels and guide users to appropriate care

INTERVIEW STYLE:
- Ask contextual, doctor-like follow-up questions
- Focus on one symptom or area at a time
- Be conversational but thorough
- Show empathy and understanding
- Remember previous responses in the conversation

CULTURAL SENSITIVITY:
- Respect different medical system preferences (conventional, Ayurvedic, integrative)
- Adapt recommendations to cultural contexts
- Honor individual beliefs and preferences

USER PROFILE: ${JSON.stringify(profileData || {})}
CONVERSATION HISTORY: ${JSON.stringify(conversationHistory || [])}
CURRENT SESSION CONTEXT: ${JSON.stringify(session.current_context || {})}

Based on the user's message, either:
1. Ask a thoughtful follow-up question to gather more information
2. Provide holistic recommendations if you have enough information
3. Assess urgency and suggest immediate care if needed

Keep responses conversational and caring. Always ask only one question at a time.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const reply = aiResponse.choices[0].message.content;

    // Update conversation session
    const updatedMessages = [...(session.conversation_data?.messages || []), 
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: reply, timestamp: new Date().toISOString() }
    ];

    await supabase
      .from('conversation_sessions')
      .update({
        conversation_data: { messages: updatedMessages },
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.id);

    console.log('Health interview response generated successfully');

    return new Response(JSON.stringify({
      reply,
      sessionId: session.id,
      conversationContinues: true,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in health-interview function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process health interview',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});