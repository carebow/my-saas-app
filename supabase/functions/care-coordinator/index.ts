import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CareCoordinationRequest {
  assessmentId: string;
  profileId: string;
  urgencyLevel: 'emergency' | 'urgent' | 'routine' | 'self_care';
  preferredCareType?: string;
  location?: string;
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

    const { 
      assessmentId, 
      urgencyLevel, 
      preferredCareType, 
      location 
    }: Omit<CareCoordinationRequest, 'profileId'> = await req.json();
    // Use authenticated user ID instead of client-supplied profileId
    const profileId = user.id;

    console.log('Coordinating care:', { assessmentId, urgencyLevel, preferredCareType });

    // Get the symptom assessment details and verify ownership
    const { data: assessment, error: assessmentError } = await supabaseClient
      .from('symptom_assessments')
      .select(`
        *,
        diagnostic_sessions (
          primary_complaint,
          conversation_data
        )
      `)
      .eq('id', assessmentId)
      .eq('profile_id', profileId)
      .single();

    if (assessmentError) {
      return new Response(
        JSON.stringify({ error: 'Assessment not found or access denied' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get available caregivers based on urgency and location (safe data only)
    const { data: availableCaregivers } = await supabaseClient
      .rpc('get_caregivers_safe')
      .limit(5);

    // Determine care pathways based on urgency
    const careRecommendations = [];

    switch (urgencyLevel) {
      case 'emergency':
        careRecommendations.push({
          pathway_type: 'emergency',
          provider_type: 'emergency',
          priority_level: 'emergency',
          notes: 'Immediate medical attention required. Please call emergency services or go to the nearest emergency room.',
          estimated_wait_time: '0 minutes',
          cost_estimate: 'Emergency care pricing'
        });
        break;

      case 'urgent':
        // Teleconsultation option
        careRecommendations.push({
          pathway_type: 'teleconsult',
          provider_type: 'doctor',
          priority_level: 'urgent',
          notes: 'Same-day medical consultation recommended. Available for immediate video consultation.',
          estimated_wait_time: '15-30 minutes',
          cost_estimate: '$75-125'
        });

        // Home visit option if caregivers available
        if (availableCaregivers?.length > 0) {
          careRecommendations.push({
            pathway_type: 'home_visit',
            provider_type: 'doctor',
            priority_level: 'urgent',
            notes: 'Medical professional can visit your home within 2-4 hours.',
            estimated_wait_time: '2-4 hours',
            cost_estimate: '$150-250',
            available_providers: availableCaregivers.slice(0, 3)
          });
        }
        break;

      case 'routine':
        // Teleconsultation
        careRecommendations.push({
          pathway_type: 'teleconsult',
          provider_type: 'doctor',
          priority_level: 'routine',
          notes: 'Schedule a consultation within 24-48 hours with a qualified healthcare professional.',
          estimated_wait_time: '1-2 days',
          cost_estimate: '$50-100'
        });

        // Home visit option
        if (availableCaregivers?.length > 0) {
          careRecommendations.push({
            pathway_type: 'home_visit',
            provider_type: 'doctor',
            priority_level: 'routine',
            notes: 'Schedule a home visit with a healthcare professional at your convenience.',
            estimated_wait_time: '1-3 days',
            cost_estimate: '$100-200',
            available_providers: availableCaregivers
          });
        }

        // Lab test option if needed
        careRecommendations.push({
          pathway_type: 'lab_test',
          provider_type: 'lab',
          priority_level: 'routine',
          notes: 'Consider lab tests to confirm diagnosis. Home sample collection available.',
          estimated_wait_time: '1-2 days',
          cost_estimate: '$25-150'
        });
        break;

      case 'self_care':
        careRecommendations.push({
          pathway_type: 'self_care',
          provider_type: null,
          priority_level: 'routine',
          notes: 'Self-care measures recommended. Monitor symptoms and seek care if they worsen.',
          estimated_wait_time: 'Immediate',
          cost_estimate: '$0-50 for OTC medications'
        });

        // Optional follow-up
        careRecommendations.push({
          pathway_type: 'teleconsult',
          provider_type: 'nurse',
          priority_level: 'routine',
          notes: 'Optional follow-up consultation with a nurse for guidance and reassurance.',
          estimated_wait_time: '2-24 hours',
          cost_estimate: '$25-50'
        });
        break;
    }

    // Store care pathway recommendations
    const carePathwayInserts = careRecommendations.map(rec => ({
      assessment_id: assessmentId,
      profile_id: profileId,
      pathway_type: rec.pathway_type,
      provider_type: rec.provider_type,
      priority_level: rec.priority_level,
      notes: rec.notes,
      status: 'recommended'
    }));

    const { error: pathwayError } = await supabaseClient
      .from('care_pathways')
      .insert(carePathwayInserts);

    if (pathwayError) {
      console.error('Error storing care pathways:', pathwayError);
      throw new Error('Failed to store care recommendations');
    }

    // Generate AI-powered care coordination message
    const coordinationMessage = `Based on your symptoms and assessment, I've identified several care options for you:

${careRecommendations.map((rec, index) => `
${index + 1}. **${rec.pathway_type.replace('_', ' ').toUpperCase()}**
   - Wait Time: ${rec.estimated_wait_time}
   - Estimated Cost: ${rec.cost_estimate}
   - ${rec.notes}
`).join('\n')}

I recommend starting with the **${careRecommendations[0].pathway_type.replace('_', ' ')}** option given your symptom urgency level.

Would you like me to help you schedule any of these care options?`;

    console.log('Care coordination completed successfully');

    return new Response(JSON.stringify({
      success: true,
      urgencyLevel,
      recommendations: careRecommendations,
      coordinationMessage,
      nextSteps: urgencyLevel === 'emergency' 
        ? ['Call emergency services immediately', 'Go to nearest emergency room']
        : ['Choose preferred care option', 'Schedule appointment', 'Follow care instructions']
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in care coordination:', error);
    return new Response(JSON.stringify({ 
      error: 'An error occurred during care coordination',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});