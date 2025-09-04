
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { input } = await req.json()
    
    if (!input || typeof input !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid input parameter' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Rate limiting - simple implementation
    const userAgent = req.headers.get('user-agent') || 'unknown'
    console.log(`Geocoding request from: ${userAgent}, input: ${input.substring(0, 50)}`)

    // Use Google Places API with server-side key management
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY')
    
    if (!GOOGLE_MAPS_API_KEY) {
      console.error('Google Maps API key not configured')
      return new Response(
        JSON.stringify({ error: 'Service temporarily unavailable' }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Call Google Places API Autocomplete
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=(cities)&key=${GOOGLE_MAPS_API_KEY}`
    
    const response = await fetch(url)
    const data = await response.json()

    if (data.status === 'OK') {
      // Transform the response to match expected format
      const predictions = data.predictions.map((prediction: { description: string; place_id: string; structured_formatting: unknown }) => ({
        description: prediction.description,
        place_id: prediction.place_id,
        structured_formatting: prediction.structured_formatting
      }))

      return new Response(
        JSON.stringify({ predictions }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      console.error('Google Places API error:', data)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch location suggestions' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('Error in geocode-location function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
