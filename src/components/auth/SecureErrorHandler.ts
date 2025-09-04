
// Secure error handling to prevent information leakage
export class SecureErrorHandler {
  private static logError(error: unknown, context: string) {
    // In production, this would send to a secure logging service
    console.error(`[${context}] Security Event:`, {
      timestamp: new Date().toISOString(),
      context,
      message: error.message,
      // Don't log sensitive data like passwords, tokens, etc.
    });
  }

  static handleAuthError(error: unknown, context: string = 'auth'): string {
    this.logError(error, context);

    // Map specific errors to generic user-friendly messages
    const errorMessage = error?.message?.toLowerCase() || '';

    if (errorMessage.includes('invalid login credentials')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }

    if (errorMessage.includes('email not confirmed')) {
      return 'Please check your email and click the confirmation link before signing in.';
    }

    if (errorMessage.includes('user already registered')) {
      return 'An account with this email already exists. Please sign in instead.';
    }

    if (errorMessage.includes('rate limit')) {
      return 'Too many attempts. Please wait a few minutes before trying again.';
    }

    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }

    // Generic error message for anything else
    return 'An error occurred. Please try again. If the problem persists, contact support.';
  }

  static handleValidationError(error: unknown): string {
    if (error?.issues) {
      return error.issues[0]?.message || 'Please check your input and try again.';
    }
    return 'Please check your input and try again.';
  }

  static detectSuspiciousActivity(email: string, userAgent: string): boolean {
    // Basic suspicious activity detection
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /headless/i
    ];

    const isSuspiciousUserAgent = suspiciousPatterns.some(pattern => 
      pattern.test(userAgent)
    );

    const isSuspiciousEmail = email.includes('test') && email.includes('bot');

    if (isSuspiciousUserAgent || isSuspiciousEmail) {
      this.logError({ 
        type: 'suspicious_activity', 
        email: email.substring(0, 3) + '***', // Partial email for logging
        userAgent 
      }, 'security');
      return true;
    }

    return false;
  }
}
