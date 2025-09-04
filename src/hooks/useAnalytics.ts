import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const useAnalytics = () => {
  const location = useLocation();

  // Track page views
  useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'G-SM8RQTDWBH', {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location]);

  // Track custom events
  const trackEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', eventName, {
        event_category: 'User Interaction',
        ...parameters,
      });
    }
  }, []);

  // Track user engagement events
  const trackUserAction = useCallback((action: string, details?: Record<string, any>) => {
    trackEvent('user_action', {
      action,
      page: location.pathname,
      ...details,
    });
  }, [trackEvent, location.pathname]);

  // Track feature usage
  const trackFeatureUsage = useCallback((feature: string, details?: Record<string, any>) => {
    trackEvent('feature_usage', {
      feature,
      page: location.pathname,
      ...details,
    });
  }, [trackEvent, location.pathname]);

  // Track conversion events
  const trackConversion = useCallback((type: string, value?: number) => {
    trackEvent('conversion', {
      conversion_type: type,
      value,
      page: location.pathname,
    });
  }, [trackEvent, location.pathname]);

  return {
    trackEvent,
    trackUserAction,
    trackFeatureUsage,
    trackConversion,
  };
};