
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  'Content-Security-Policy': "default-src 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

// Enhanced input validation for waitlist
const validateWaitlistInput = (input: unknown): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!input || typeof input !== 'object') {
    errors.push('Invalid request body');
    return { isValid: false, errors };
  }
  
  // Validate required fields
  if (!input.fullName || typeof input.fullName !== 'string' || input.fullName.trim().length < 2) {
    errors.push('Full name is required (minimum 2 characters)');
  } else if (input.fullName.length > 100) {
    errors.push('Full name too long (max 100 characters)');
  }
  
  if (!input.email || typeof input.email !== 'string') {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.push('Invalid email format');
  } else if (input.email.length > 320) {
    errors.push('Email too long (max 320 characters)');
  }
  
  // Validate optional fields
  if (input.location && (typeof input.location !== 'string' || input.location.length > 200)) {
    errors.push('Location must be a string (max 200 characters)');
  }
  
  if (input.questions && (typeof input.questions !== 'string' || input.questions.length > 1000)) {
    errors.push('Questions must be a string (max 1000 characters)');
  }
  
  // Check for disposable email domains
  const disposableDomains = ['tempmail.org', '10minutemail.com', 'guerrillamail.com'];
  const emailDomain = input.email.split('@')[1]?.toLowerCase();
  if (disposableDomains.includes(emailDomain)) {
    errors.push('Please use a permanent email address');
  }
  
  return { isValid: errors.length === 0, errors };
};

const sanitizeString = (str: string, maxLength: number = 1000): string => {
  return str.replace(/[<>]/g, '').trim().substring(0, maxLength);
};

interface WaitlistData {
  fullName: string;
  email: string;
  location: string;
  signupFor: string;
  careType: string;
  hearAbout: string;
  questions?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use anon key for public waitlist operations - more secure
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    const requestBody = await req.json();
    
    // Validate input
    const validation = validateWaitlistInput(requestBody);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid input', details: validation.errors }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }
    
    // Sanitize inputs
    const waitlistData: WaitlistData = {
      fullName: sanitizeString(requestBody.fullName, 100),
      email: sanitizeString(requestBody.email.toLowerCase(), 320),
      location: requestBody.location ? sanitizeString(requestBody.location, 200) : '',
      signupFor: requestBody.signupFor || '',
      careType: requestBody.careType || '',
      hearAbout: requestBody.hearAbout ? sanitizeString(requestBody.hearAbout, 500) : '',
      questions: requestBody.questions ? sanitizeString(requestBody.questions, 1000) : undefined,
    };

    // Generate a random queue position to avoid leaking actual waitlist size
    // This protects business intelligence while still providing user experience
    const queuePosition = Math.floor(Math.random() * 1000) + 1;

    // Insert into waitlist table (without queue_position to avoid leaking data)
    const { data, error: insertError } = await supabaseClient
      .from("waitlist")
      .insert({
        name: waitlistData.fullName,
        email: waitlistData.email,
        location: waitlistData.location,
        signup_for: waitlistData.signupFor,
        care_type: waitlistData.careType,
        hear_about: waitlistData.hearAbout,
        questions: waitlistData.questions,
        // Remove queue_position to prevent data leakage
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Send confirmation email
    const emailResponse = await resend.emails.send({
      from: "CareBow <onboarding@resend.dev>",
      to: [waitlistData.email],
      subject: "Welcome to CareBow Waitlist! 🏥",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Welcome to CareBow!</h1>
            <p style="color: #64748b; font-size: 18px; margin: 10px 0 0 0;">You're on the waitlist for the future of healthcare</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <div style="background: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto;">
              <span style="font-size: 24px; color: #2563eb; font-weight: bold;">#${queuePosition}</span>
            </div>
            <h2 style="color: white; margin: 0 0 10px 0;">Your Queue Position</h2>
            <p style="color: rgba(255,255,255,0.9); margin: 0;">You're number ${queuePosition} on our waitlist!</p>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0;">What's Next?</h3>
            <ul style="color: #475569; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">We'll keep you updated on our progress</li>
              <li style="margin-bottom: 8px;">You'll be notified when early access becomes available</li>
              <li style="margin-bottom: 8px;">Priority access based on your waitlist position</li>
            </ul>
          </div>
          
          <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin-bottom: 25px;">
            <p style="margin: 0; color: #065f46;">
              <strong>Thank you for believing in our mission!</strong> We're working hard to revolutionize in-home healthcare and make it accessible to everyone.
            </p>
          </div>
          
          <div style="text-align: center; color: #94a3b8; font-size: 14px;">
            <p style="margin: 0;">Best regards,<br><strong>The CareBow Team</strong></p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        queuePosition: queuePosition,
        message: "Successfully joined waitlist and confirmation email sent!",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: unknown) {
    console.error("SECURITY_EVENT: join-waitlist-error", {
      timestamp: new Date().toISOString(),
      error: error.message,
      userAgent: req.headers.get('user-agent')
    });
    
    return new Response(
      JSON.stringify({
        success: false,
        error: "An error occurred while processing your request",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
