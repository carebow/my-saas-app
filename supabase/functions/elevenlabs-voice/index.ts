import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, personality = 'caring', tone = 'warm' } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!elevenLabsApiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    // Define system prompts based on personality and tone
    let systemPrompt = `You are CareBow, a compassionate AI health assistant. You provide helpful, empathetic health guidance while being clear that you're not providing medical diagnosis. Keep responses concise (2-3 sentences maximum) and ${tone}.`;

    if (personality === 'professional') {
      systemPrompt = `You are CareBow, a professional AI health assistant. Provide clear, evidence-based health information while emphasizing the importance of consulting healthcare professionals. Keep responses brief and ${tone}.`;
    } else if (personality === 'friendly') {
      systemPrompt = `You are CareBow, a friendly AI health companion. You're here to help with health questions in a supportive, understanding way. Keep responses conversational and ${tone}.`;
    }

    // Get text response from OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.statusText}`);
    }

    const openAIData = await openAIResponse.json();
    const textResponse = openAIData.choices[0]?.message?.content;

    if (!textResponse) {
      throw new Error('No response from OpenAI');
    }

    // Select voice based on personality and tone
    let voiceId = '9BWtsMINqrJLrRacOk9x'; // Aria - default caring voice
    
    if (personality === 'professional') {
      voiceId = 'CwhRBWXzGAHq8TQ4Fs17'; // Roger - professional
    } else if (personality === 'friendly') {
      voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Sarah - friendly
    }

    if (tone === 'calm') {
      voiceId = 'pFZP5JQG7iQjIQuC4Bku'; // Lily - calm
    } else if (tone === 'energetic') {
      voiceId = 'TX3LPaxmHKxFdv7VOQHJ'; // Liam - energetic
    }

    // Generate speech with ElevenLabs
    const elevenLabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${elevenLabsApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text: textResponse,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.0,
          use_speaker_boost: true
        }
      }),
    });

    if (!elevenLabsResponse.ok) {
      throw new Error(`ElevenLabs API error: ${elevenLabsResponse.statusText}`);
    }

    // Convert audio to base64
    const audioBuffer = await elevenLabsResponse.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    return new Response(JSON.stringify({
      text: textResponse,
      audio_base64: base64Audio
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in elevenlabs-voice function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      text: "I'm sorry, I'm having trouble responding right now. Please try again."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});