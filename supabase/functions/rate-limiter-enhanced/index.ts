import { corsHeaders } from '../_shared/cors.ts';

// Enhanced rate limiter with IP-based tracking
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

class EnhancedRateLimiter {
  static checkLimit(identifier: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);
    
    if (!entry || now > entry.resetTime) {
      // Reset or create new entry
      rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (entry.count >= maxRequests) {
      return false;
    }
    
    entry.count++;
    return true;
  }
  
  static getRemainingRequests(identifier: string, maxRequests: number = 100): number {
    const entry = rateLimitStore.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return maxRequests;
    }
    return Math.max(0, maxRequests - entry.count);
  }
  
  static getResetTime(identifier: string): number | null {
    const entry = rateLimitStore.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return null;
    }
    return entry.resetTime;
  }
  
  // Clean up expired entries periodically
  static cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }
}

// Clean up every 5 minutes
setInterval(() => EnhancedRateLimiter.cleanup(), 5 * 60 * 1000);

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Extract client IP and create identifier
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    const url = new URL(req.url);
    const path = url.pathname;
    
    // Different limits for different endpoints
    let maxRequests = 100;
    let windowMs = 60000; // 1 minute
    
    // Stricter limits for sensitive endpoints
    if (path.includes('auth') || path.includes('signup') || path.includes('login')) {
      maxRequests = 10;
      windowMs = 60000; // 1 minute
    } else if (path.includes('waitlist')) {
      maxRequests = 5;
      windowMs = 300000; // 5 minutes
    } else if (path.includes('voice') || path.includes('ai')) {
      maxRequests = 50;
      windowMs = 60000; // 1 minute
    }
    
    const identifier = `${clientIP}_${path}`;
    
    // Check rate limit
    if (!EnhancedRateLimiter.checkLimit(identifier, maxRequests, windowMs)) {
      const resetTime = EnhancedRateLimiter.getResetTime(identifier);
      
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          resetTime: resetTime
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetTime ? Math.ceil(resetTime / 1000).toString() : '',
            'Retry-After': windowMs.toString()
          }
        }
      );
    }
    
    const remaining = EnhancedRateLimiter.getRemainingRequests(identifier, maxRequests);
    const resetTime = EnhancedRateLimiter.getResetTime(identifier);
    
    return new Response(
      JSON.stringify({
        success: true,
        remaining: remaining,
        resetTime: resetTime
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
    );
    
  } catch (error) {
    console.error('Rate limiter error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});