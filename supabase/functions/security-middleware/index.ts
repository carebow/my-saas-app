
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block'
}

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

class SecurityMiddleware {
  private static cleanupExpiredEntries() {
    const now = Date.now()
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  }

  static checkRateLimit(identifier: string, maxRequests = 10, windowMs = 60000): boolean {
    this.cleanupExpiredEntries()
    
    const now = Date.now()
    const record = rateLimitStore.get(identifier)
    
    if (!record || now > record.resetTime) {
      rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs })
      return true
    }
    
    if (record.count >= maxRequests) {
      return false
    }
    
    record.count++
    return true
  }

  static validateInput(input: unknown): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    // Check for common XSS patterns
    const xssPatterns = [/<script/i, /javascript:/i, /on\w+=/i, /<iframe/i]
    const inputString = JSON.stringify(input)
    
    for (const pattern of xssPatterns) {
      if (pattern.test(inputString)) {
        errors.push('Potentially malicious content detected')
        break
      }
    }
    
    // Check input length
    if (inputString.length > 10000) {
      errors.push('Input too large')
    }
    
    return { isValid: errors.length === 0, errors }
  }

  static sanitizeInput(obj: unknown): unknown {
    if (typeof obj === 'string') {
      return obj
        .replace(/[<>]/g, '') // Remove potential XSS characters
        .trim()
        .substring(0, 1000) // Limit length
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeInput(item))
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = this.sanitizeInput(value)
      }
      return sanitized
    }
    
    return obj
  }

  static detectSuspiciousActivity(request: Request): boolean {
    const userAgent = request.headers.get('user-agent') || ''
    const suspiciousPatterns = [
      /bot/i, /crawler/i, /spider/i, /headless/i, /automated/i
    ]
    
    return suspiciousPatterns.some(pattern => pattern.test(userAgent))
  }

  static logSecurityEvent(event: unknown) {
    // Sanitize sensitive data before logging
    const sanitizedEvent = {
      ...event,
      // Remove PII and sensitive data
      email: event.email ? event.email.replace(/(.{2}).*(@.*)/, '$1***$2') : undefined,
      ip: event.ip ? event.ip.replace(/\d+$/, 'xxx') : undefined,
      userAgent: event.userAgent ? event.userAgent.substring(0, 50) + '...' : undefined
    };
    
    console.log('[SECURITY]', {
      timestamp: new Date().toISOString(),
      ...sanitizedEvent
    })
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = req.headers.get('user-agent') || ''
    
    // Rate limiting check
    if (!SecurityMiddleware.checkRateLimit(`${clientIP}:${url.pathname}`, 20, 60000)) {
      SecurityMiddleware.logSecurityEvent({
        type: 'rate_limit_exceeded',
        ip: clientIP,
        path: url.pathname
      })
      
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Suspicious activity detection
    if (SecurityMiddleware.detectSuspiciousActivity(req)) {
      SecurityMiddleware.logSecurityEvent({
        type: 'suspicious_activity',
        ip: clientIP,
        userAgent,
        path: url.pathname
      })
      
      return new Response(
        JSON.stringify({ error: 'Access denied.' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate and sanitize input for POST requests
    if (req.method === 'POST') {
      const body = await req.json()
      const validation = SecurityMiddleware.validateInput(body)
      
      if (!validation.isValid) {
        SecurityMiddleware.logSecurityEvent({
          type: 'invalid_input',
          ip: clientIP,
          errors: validation.errors,
          path: url.pathname
        })
        
        return new Response(
          JSON.stringify({ error: 'Invalid input detected.' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
    }

    // Example: Enhanced auth operation with security checks
    if (url.pathname === '/auth' && req.method === 'POST') {
      const body = await req.json()
      const sanitizedBody = SecurityMiddleware.sanitizeInput(body)
      
      // Additional auth-specific security checks
      if (sanitizedBody.email && typeof sanitizedBody.email === 'string') {
        const email = sanitizedBody.email.toLowerCase().trim()
        
        // Check for disposable email domains
        const disposableDomains = ['tempmail.org', '10minutemail.com', 'guerrillamail.com']
        const domain = email.split('@')[1]
        
        if (disposableDomains.includes(domain)) {
          SecurityMiddleware.logSecurityEvent({
            type: 'disposable_email_attempt',
            ip: clientIP,
            domain
          })
          
          return new Response(
            JSON.stringify({ error: 'Please use a permanent email address.' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }
      }
    }

    // Log successful security check
    SecurityMiddleware.logSecurityEvent({
      type: 'request_processed',
      ip: clientIP,
      path: url.pathname,
      method: req.method
    })

    return new Response(
      JSON.stringify({ 
        message: 'Security middleware processed successfully',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    SecurityMiddleware.logSecurityEvent({
      type: 'middleware_error',
      error: error.message
    })
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
