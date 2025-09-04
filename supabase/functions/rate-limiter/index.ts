import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

// Rate limiting store (in production, use Redis or Supabase)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

class RateLimiter {
  private static cleanupExpiredEntries() {
    const now = Date.now()
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  }

  static checkLimit(identifier: string, maxRequests = 10, windowMs = 60000): boolean {
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

  static getRemainingRequests(identifier: string, maxRequests = 10): number {
    const record = rateLimitStore.get(identifier)
    if (!record || Date.now() > record.resetTime) {
      return maxRequests
    }
    return Math.max(0, maxRequests - record.count)
  }

  static getResetTime(identifier: string): number | null {
    const record = rateLimitStore.get(identifier)
    if (!record || Date.now() > record.resetTime) {
      return null
    }
    return record.resetTime
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = req.headers.get('user-agent') || ''
    
    // Different rate limits for different endpoints
    const url = new URL(req.url)
    let maxRequests = 10
    let windowMs = 60000 // 1 minute
    
    if (url.pathname.includes('waitlist')) {
      maxRequests = 3 // Stricter for waitlist
      windowMs = 300000 // 5 minutes
    } else if (url.pathname.includes('auth')) {
      maxRequests = 5 // Moderate for auth
      windowMs = 300000 // 5 minutes
    }
    
    const identifier = `${clientIP}:${url.pathname}`
    
    if (!RateLimiter.checkLimit(identifier, maxRequests, windowMs)) {
      console.log('[SECURITY] Rate limit exceeded', {
        ip: clientIP,
        path: url.pathname,
        userAgent,
        timestamp: new Date().toISOString()
      })
      
      const resetTime = RateLimiter.getResetTime(identifier)
      const headers = {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': resetTime ? Math.ceil(resetTime / 1000).toString() : ''
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 300
        }),
        { status: 429, headers }
      )
    }
    
    const remaining = RateLimiter.getRemainingRequests(identifier, maxRequests)
    const resetTime = RateLimiter.getResetTime(identifier)
    
    return new Response(
      JSON.stringify({ 
        message: 'Rate limit check passed',
        remaining,
        resetTime
      }),
      { 
        status: 200, 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': resetTime ? Math.ceil(resetTime / 1000).toString() : ''
        }
      }
    )

  } catch (error) {
    console.error('[SECURITY] Rate limiter error:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})