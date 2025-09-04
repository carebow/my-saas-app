import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
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
    if (!elevenLabsApiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    const { message, personality, tone, profileData, sessionId } = await req.json();
    console.log('Enhanced voice chat request:', { personality, tone, sessionId: sessionId ? 'present' : 'none' });

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user preferences if available
    let userPrefs = null;
    if (profileData?.id) {
      const { data } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('profile_id', profileData.id)
        .single();
      userPrefs = data;
    }

    // Determine AI personality and voice based on preferences
    const aiPersonality = userPrefs?.ai_personality || personality || 'caring_nurse';
    const communicationStyle = userPrefs?.communication_style || tone || 'balanced';
    const medicalSystemPref = userPrefs?.medical_system_preference || 'integrated';

    // Build personality-specific system prompt
    const personalityPrompts = {
      caring_nurse: "You are a warm, caring nurse with years of experience. You speak with genuine compassion and make people feel heard and supported.",
      wise_healer: "You are a wise traditional healer who combines ancient wisdom with modern understanding. You speak thoughtfully and honor both scientific and traditional knowledge.",
      professional_doctor: "You are a knowledgeable, professional doctor who explains things clearly and methodically while maintaining empathy.",
      friendly_guide: "You are a friendly health guide who makes complex health topics easy to understand. You're approachable and encouraging."
    };

    const stylePrompts = {
      gentle: "Keep your tone very gentle and soothing. Speak slowly and reassuringly.",
      direct: "Be clear and direct while remaining caring. Get to the point efficiently.",
      detailed: "Provide thorough explanations and comprehensive guidance.",
      balanced: "Balance warmth with professionalism, being neither too casual nor too formal."
    };

    const systemPrompt = `You are CareBow's AI Health Companion with the following characteristics:

PERSONALITY: ${personalityPrompts[aiPersonality] || personalityPrompts.caring_nurse}

COMMUNICATION STYLE: ${stylePrompts[communicationStyle] || stylePrompts.balanced}

MEDICAL APPROACH: ${medicalSystemPref === 'ayurvedic' ? 'Focus primarily on Ayurvedic and natural approaches.' :
                  medicalSystemPref === 'conventional' ? 'Focus primarily on conventional medical approaches.' :
                  'Integrate both conventional and traditional/natural approaches harmoniously.'}

USER PROFILE: ${profileData ? 'Available' : 'None'}

Guidelines:
- Keep responses conversational and natural for voice interaction
- Show genuine care and empathy
- Ask thoughtful follow-up questions
- Provide actionable, holistic health guidance
- Always consider both immediate relief and long-term wellness
- Respect cultural and personal preferences
- Keep responses to 2-3 sentences for voice clarity

Remember: You're having a caring conversation, not giving a medical lecture.`;

    // Get OpenAI response
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
        max_tokens: 300, // Shorter for voice
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const aiData = await openAIResponse.json();
    const textResponse = aiData.choices[0].message.content;

    // Select voice based on personality and preferences
    const voiceMap = {
      caring_nurse: 'EXAVITQu4vr4xnSDxMaL', // Sarah - warm, caring
      wise_healer: 'FGY2WhTYpPnrIDTdsKH5', // Laura - wise, thoughtful
      professional_doctor: 'TX3LPaxmHKxFdv7VOQHJ', // Liam - professional
      friendly_guide: 'XB0fDUnXU5powFXDhCwa' // Charlotte - friendly
    };

    const selectedVoice = voiceMap[aiPersonality] || voiceMap.caring_nurse;

    // Generate speech with ElevenLabs
    const elevenLabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${elevenLabsApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: textResponse,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.0,
          use_speaker_boost: true
        }
      }),
    });

    if (!elevenLabsResponse.ok) {
      const errorText = await elevenLabsResponse.text();
      console.error('ElevenLabs API error:', errorText);
      throw new Error(`ElevenLabs API error: ${elevenLabsResponse.status}`);
    }

    // Convert audio to base64
    const audioArrayBuffer = await elevenLabsResponse.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioArrayBuffer)));

    // Update session if provided
    if (sessionId && profileData?.id) {
      await supabase
        .from('conversation_sessions')
        .update({
          conversation_data: {
            lastInteraction: {
              message,
              response: textResponse,
              timestamp: new Date().toISOString(),
              personality: aiPersonality,
              style: communicationStyle
            }
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);
    }

    console.log('Enhanced voice chat response generated successfully');

    return new Response(JSON.stringify({
      text: textResponse,
      audioContent: base64Audio,
      personality: aiPersonality,
      voice: selectedVoice
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in voice-chat-enhanced function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate voice response',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});