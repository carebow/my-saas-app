import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Security-Policy': "default-src 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

// Input validation and sanitization
const validateVoiceChatInput = (input: unknown): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!input || typeof input !== 'object') {
    errors.push('Invalid request body');
    return { isValid: false, errors };
  }
  
  if (!input.message || typeof input.message !== 'string') {
    errors.push('Message is required and must be a string');
  } else if (input.message.length > 1000) {
    errors.push('Message too long (max 1000 characters)');
  }
  
  if (input.personality && !['friendly_nurse', 'wise_monk', 'traditional_doctor'].includes(input.personality)) {
    errors.push('Invalid personality type');
  }
  
  if (input.tone && !['gentle', 'direct', 'detailed', 'short'].includes(input.tone)) {
    errors.push('Invalid tone type');
  }
  
  return { isValid: errors.length === 0, errors };
};

const sanitizeInput = (str: string): string => {
  return str.replace(/[<>]/g, '').trim().substring(0, 1000);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    
    // Validate input
    const validation = validateVoiceChatInput(requestBody);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validation.errors }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Sanitize inputs
    const message = sanitizeInput(requestBody.message);
    const personality = requestBody.personality || 'friendly_nurse';
    const tone = requestBody.tone || 'gentle';
    const healthProfile = requestBody.healthProfile || {};

    console.log('Received message:', message);
    console.log('Personality:', personality, 'Tone:', tone);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const elevenLabsApiKey = Deno.env.get('ELEVEN_LABS_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    if (!elevenLabsApiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    // Personality-based system prompts
    const personalityPrompts = {
      friendly_nurse: `You are CareBow, a warm and caring AI health assistant with the heart of a compassionate nurse. You're patient, nurturing, and always make people feel heard and cared for. You combine clinical knowledge with emotional support.`,
      wise_monk: `You are CareBow, a mindful AI health assistant with the wisdom of an ancient healer. You emphasize holistic wellness, inner peace, and natural healing. You speak with gentle wisdom and focus on mind-body-spirit connections.`,
      traditional_doctor: `You are CareBow, a thorough AI health assistant with the expertise of a traditional physician. You're methodical, evidence-based, and comprehensive in your assessments while remaining approachable and caring.`
    };

    // Tone adjustments
    const toneInstructions = {
      gentle: "Use a soft, reassuring tone. Be extra empathetic and patient. Keep responses warm and comforting.",
      direct: "Be clear and to the point while remaining caring. Focus on actionable advice. Use concise language.",
      detailed: "Provide comprehensive explanations and thorough guidance. Be educational while staying accessible.",
      short: "Keep responses very concise but warm. Focus on key points. Maximum 2 sentences for voice interaction."
    };

    // Enhanced system prompt
    const systemPrompt = `${personalityPrompts[personality] || personalityPrompts.friendly_nurse}

${toneInstructions[tone] || toneInstructions.gentle}

Your core capabilities:
- Conduct thoughtful health interviews with relevant follow-up questions
- Provide holistic recommendations covering medical advice, Ayurvedic approaches, mental health support, and lifestyle guidance
- Assess urgency levels and guide users to appropriate care
- Build personalized health profiles over time
- Always prioritize user safety and emotional wellbeing

Current user health profile: ${JSON.stringify(healthProfile || {})}

For voice interactions, keep responses conversational and naturally spoken. Always end with reassurance and support.`;

    // Step 1: Get chat completion from OpenAI
    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: personality === 'wise_monk' ? 0.8 : 0.7,
        max_tokens: tone === 'short' ? 100 : tone === 'detailed' ? 300 : 150,
      }),
    });

    if (!chatResponse.ok) {
      const error = await chatResponse.json();
      throw new Error(`OpenAI request failed: ${error.error?.message || 'Unknown error'}`);
    }

    const chatData = await chatResponse.json();
    const responseText = chatData.choices[0].message.content;

    console.log('Generated response:', responseText);

    // Select voice based on personality
    const voiceIds = {
      friendly_nurse: '9BWtsMINqrJLrRacOk9x', // Aria - warm and caring
      wise_monk: 'EXAVITQu4vr4xnSDxMaL', // Sarah - calm and wise
      traditional_doctor: 'CwhRBWXzGAHq8TQ4Fs17' // Roger - professional and clear
    };

    const selectedVoiceId = voiceIds[personality] || voiceIds.friendly_nurse;

    // Voice settings based on tone
    const voiceSettings = {
      gentle: { stability: 0.6, similarity_boost: 0.8, style: 0.2 },
      direct: { stability: 0.7, similarity_boost: 0.7, style: 0.0 },
      detailed: { stability: 0.8, similarity_boost: 0.6, style: 0.1 },
      short: { stability: 0.7, similarity_boost: 0.7, style: 0.0 }
    };

    const currentVoiceSettings = voiceSettings[tone] || voiceSettings.gentle;

    // Step 2: Convert text to speech using ElevenLabs
    const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsApiKey,
      },
      body: JSON.stringify({
        text: responseText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          ...currentVoiceSettings,
          use_speaker_boost: true
        }
      }),
    });

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      console.error('ElevenLabs error:', errorText);
      throw new Error(`ElevenLabs TTS failed: ${errorText}`);
    }

    // Convert audio to base64
    const audioBuffer = await ttsResponse.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    console.log('Audio generated successfully with ElevenLabs');

    return new Response(
      JSON.stringify({
        text: responseText,
        audioContent: base64Audio,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('SECURITY_EVENT: voice-chat-error', {
      timestamp: new Date().toISOString(),
      error: error.message,
      userAgent: req.headers.get('user-agent')
    });
    
    return new Response(
      JSON.stringify({ 
        error: 'I apologize, but I encountered an error. Please try again.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});