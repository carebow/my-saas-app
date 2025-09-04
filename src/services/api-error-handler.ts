/**
 * API Error Handler with Sentry integration for CareBow
 */
import { captureException, captureMessage, addBreadcrumb } from '@/lib/sentry';

export interface ApiError extends Error {
  status?: number;
  statusText?: string;
  data?: any;
  url?: string;
  method?: string;
}

/**
 * Enhanced API error handler with Sentry integration
 */
export class ApiErrorHandler {
  static handleError(error: any, context?: {
    url?: string;
    method?: string;
    requestData?: any;
    userId?: string;
  }): ApiError {
    let apiError: ApiError;
    
    if (error.response) {
      // HTTP error response
      apiError = new Error(error.response.data?.detail || error.response.statusText || 'API Error') as ApiError;
      apiError.status = error.response.status;
      apiError.statusText = error.response.statusText;
      apiError.data = error.response.data;
    } else if (error.request) {
      // Network error
      apiError = new Error('Network error - please check your connection') as ApiError;
      apiError.status = 0;
    } else {
      // Other error
      apiError = new Error(error.message || 'Unknown error occurred') as ApiError;
    }
    
    // Add context
    if (context) {
      apiError.url = context.url;
      apiError.method = context.method;
    }
    
    // Add breadcrumb for debugging
    addBreadcrumb(
      `API Error: ${apiError.message}`,
      'http',
      'error',
      {
        url: context?.url,
        method: context?.method,
        status: apiError.status,
        statusText: apiError.statusText,
      }
    );
    
    // Capture to Sentry based on error type
    if (apiError.status && apiError.status >= 500) {
      // Server errors - capture as exceptions
      captureException(apiError, {
        user: context?.userId ? { id: context.userId } : undefined,
        extra: {
          requestData: context?.requestData,
          responseData: apiError.data,
          url: context?.url,
          method: context?.method,
        },
        tags: {
          errorType: 'api',
          errorCategory: 'server',
          statusCode: String(apiError.status),
        },
      });
    } else if (apiError.status === 0) {
      // Network errors
      captureException(apiError, {
        user: context?.userId ? { id: context.userId } : undefined,
        extra: {
          url: context?.url,
          method: context?.method,
        },
        tags: {
          errorType: 'network',
          errorCategory: 'connectivity',
        },
      });
    } else if (apiError.status && apiError.status >= 400 && apiError.status < 500) {
      // Client errors - capture as messages (less critical)
      captureMessage(
        `Client Error: ${apiError.message}`,
        'warning',
        {
          user: context?.userId ? { id: context.userId } : undefined,
          extra: {
            requestData: context?.requestData,
            responseData: apiError.data,
            url: context?.url,
            method: context?.method,
          },
          tags: {
            errorType: 'api',
            errorCategory: 'client',
            statusCode: String(apiError.status),
          },
        }
      );
    }
    
    return apiError;
  }
  
  /**
   * Handle authentication errors specifically
   */
  static handleAuthError(error: any, context?: { url?: string; method?: string }): ApiError {
    const apiError = this.handleError(error, context);
    
    // Add specific handling for auth errors
    if (apiError.status === 401) {
      addBreadcrumb('User authentication failed', 'auth', 'warning');
      
      // Trigger logout or redirect to login
      // This could be handled by your auth context/store
      window.dispatchEvent(new CustomEvent('auth:logout', { 
        detail: { reason: 'token_expired' } 
      }));
    }
    
    return apiError;
  }
  
  /**
   * Handle payment errors specifically
   */
  static handlePaymentError(error: any, context?: { 
    url?: string; 
    method?: string; 
    paymentData?: any;
    userId?: string;
  }): ApiError {
    const apiError = this.handleError(error, context);
    
    // Add payment-specific context
    addBreadcrumb('Payment operation failed', 'payment', 'error', {
      status: apiError.status,
      paymentData: context?.paymentData,
    });
    
    // Capture payment errors with high priority
    captureException(apiError, {
      user: context?.userId ? { id: context.userId } : undefined,
      extra: {
        paymentData: context?.paymentData,
        url: context?.url,
        method: context?.method,
      },
      tags: {
        errorType: 'payment',
        errorCategory: 'transaction',
        statusCode: String(apiError.status || 0),
      },
    });
    
    return apiError;
  }
}

/**
 * Axios interceptor for automatic error handling
 */
export function setupApiErrorInterceptor(axiosInstance: any, getCurrentUser?: () => { id: string } | null) {
  axiosInstance.interceptors.response.use(
    (response: any) => {
      // Add successful request breadcrumb
      addBreadcrumb(
        `API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`,
        'http',
        'info',
        {
          status: response.status,
          url: response.config.url,
          method: response.config.method,
        }
      );
      return response;
    },
    (error: any) => {
      const user = getCurrentUser?.();
      const context = {
        url: error.config?.url,
        method: error.config?.method,
        requestData: error.config?.data,
        userId: user?.id,
      };
      
      // Handle different types of errors
      if (error.config?.url?.includes('/auth/')) {
        throw ApiErrorHandler.handleAuthError(error, context);
      } else if (error.config?.url?.includes('/payment')) {
        throw ApiErrorHandler.handlePaymentError(error, {
          ...context,
          paymentData: error.config?.data,
        });
      } else {
        throw ApiErrorHandler.handleError(error, context);
      }
    }
  );
}