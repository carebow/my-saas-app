/**
 * Sentry configuration for CareBow frontend error monitoring
 */
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { env } from './env';

// Environment configuration
const SENTRY_DSN = env.NEXT_PUBLIC_SENTRY_DSN;
const ENVIRONMENT = env.NEXT_PUBLIC_ENVIRONMENT || 'development';
const VERSION = env.NEXT_PUBLIC_APP_VERSION || '1.0.0';

/**
 * Initialize Sentry for error monitoring and performance tracking
 */
export function initSentry(): void {
  // Temporarily disable Sentry to debug the error
  console.info('Sentry initialization disabled for debugging');
  return;
  
  if (!SENTRY_DSN) {
    console.info('Sentry DSN not configured, skipping Sentry initialization');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    release: VERSION,
    
    // Integrations
    integrations: [
      new BrowserTracing({
        // Simplified browser tracing without React Router instrumentation
        // to avoid import issues during initialization
      }),
    ],
    
    // Performance monitoring
    tracesSampleRate: ENVIRONMENT === 'development' ? 1.0 : 0.1,
    
    // Error sampling
    sampleRate: 1.0,
    
    // Additional configuration
    attachStacktrace: true,
    
    // Don't send personally identifiable information
    beforeSend(event, hint) {
      return filterSensitiveData(event, hint);
    },
    
    // Filter performance transactions
    beforeSendTransaction(event) {
      return filterPerformanceData(event);
    },
    
    // Configure allowed URLs (optional)
    allowUrls: [
      // Add your domain here in production
      /localhost/,
      /carebow\.com/,
    ],
    
    // Ignore certain errors
    ignoreErrors: [
      // Browser extensions
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded',
      'Script error.',
      
      // Network errors
      'NetworkError',
      'Failed to fetch',
      
      // React development warnings
      'Warning: ',
    ],
  });

  // Set global tags
  Sentry.setTag('component', 'frontend');
  Sentry.setTag('framework', 'react');
  
  console.info(`Sentry initialized for environment: ${ENVIRONMENT}`);
}

/**
 * Filter sensitive data before sending to Sentry
 */
function filterSensitiveData(event: Sentry.Event, hint: Sentry.EventHint): Sentry.Event | null {
  // Remove sensitive information from the event
  if (event.request?.data) {
    const data = event.request.data;
    
    // Remove password fields
    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data };
      delete sanitized.password;
      delete sanitized.confirmPassword;
      delete sanitized.currentPassword;
      delete sanitized.newPassword;
      event.request.data = sanitized;
    }
  }
  
  // Remove sensitive headers
  if (event.request?.headers) {
    const headers = { ...event.request.headers };
    delete headers.Authorization;
    delete headers.Cookie;
    event.request.headers = headers;
  }
  
  // Add custom context
  event.tags = {
    ...event.tags,
    userAgent: navigator.userAgent,
    url: window.location.href,
  };
  
  return event;
}

/**
 * Filter performance data before sending to Sentry
 */
function filterPerformanceData(event: Sentry.Event): Sentry.Event | null {
  // Don't track certain routes in production
  if (ENVIRONMENT === 'production') {
    const transactionName = event.transaction;
    if (transactionName?.includes('/health') || transactionName?.includes('/ping')) {
      return null;
    }
  }
  
  return event;
}

/**
 * Capture exception with additional context
 */
export function captureException(
  error: Error,
  context?: {
    user?: { id: string; email?: string };
    extra?: Record<string, any>;
    tags?: Record<string, string>;
  }
): void {
  Sentry.withScope((scope) => {
    if (context?.user) {
      scope.setUser(context.user);
    }
    
    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }
    
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }
    
    Sentry.captureException(error);
  });
}

/**
 * Capture message with additional context
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: {
    user?: { id: string; email?: string };
    extra?: Record<string, any>;
    tags?: Record<string, string>;
  }
): void {
  Sentry.withScope((scope) => {
    if (context?.user) {
      scope.setUser(context.user);
    }
    
    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }
    
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }
    
    Sentry.captureMessage(message, level);
  });
}

/**
 * Set user context for current session
 */
export function setUserContext(user: { id: string; email?: string; name?: string }): void {
  Sentry.setUser({
    id: user.id,
    email: ENVIRONMENT === 'development' ? user.email : undefined,
    username: user.name,
  });
}

/**
 * Add breadcrumb for debugging context
 */
export function addBreadcrumb(
  message: string,
  category: string = 'custom',
  level: Sentry.SeverityLevel = 'info',
  data?: Record<string, any>
): void {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  });
}

/**
 * Clear user context (on logout)
 */
export function clearUserContext(): void {
  Sentry.setUser(null);
}
