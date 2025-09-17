import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics 4 tracking
export const Analytics: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname,
      });
    }
  }, [location]);

  return null;
};

// Custom event tracking
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Common tracking events for CareBow
export const trackingEvents = {
  // User engagement
  symptomCheckerUsed: (symptom: string) => trackEvent('symptom_checker_used', { symptom }),
  aiChatStarted: () => trackEvent('ai_chat_started'),
  healthDashboardViewed: () => trackEvent('health_dashboard_viewed'),
  writerDashboardAccessed: () => trackEvent('writer_dashboard_accessed'),
  
  // Content engagement
  blogPostRead: (postTitle: string, category: string) => trackEvent('blog_post_read', { post_title: postTitle, category }),
  faqViewed: (question: string) => trackEvent('faq_viewed', { question }),
  symptomPageViewed: (symptom: string) => trackEvent('symptom_page_viewed', { symptom }),
  
  // Conversion events
  newsletterSignup: (source: string) => trackEvent('newsletter_signup', { source }),
  contactFormSubmitted: (formType: string) => trackEvent('contact_form_submitted', { form_type: formType }),
  emergencyNoticeClicked: () => trackEvent('emergency_notice_clicked'),
  
  // Health-specific events
  urgencyLevelAssessed: (level: string) => trackEvent('urgency_level_assessed', { urgency_level: level }),
  ayurvedicRemedyViewed: (remedy: string) => trackEvent('ayurvedic_remedy_viewed', { remedy }),
  selfCareTipViewed: (tip: string) => trackEvent('self_care_tip_viewed', { tip }),
  
  // Error tracking
  apiError: (endpoint: string, error: string) => trackEvent('api_error', { endpoint, error }),
  userError: (error: string, page: string) => trackEvent('user_error', { error, page }),
};

// Performance tracking
export const trackPerformance = (metricName: string, value: number, unit: string = 'ms') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'timing_complete', {
      name: metricName,
      value: Math.round(value),
      event_category: 'Performance',
      event_label: unit,
    });
  }
};

// SEO tracking
export const trackSEO = (keyword: string, position: number, page: string) => {
  trackEvent('seo_keyword_clicked', {
    keyword,
    position,
    page,
  });
};

// Health engagement tracking
export const trackHealthEngagement = (action: string, details: Record<string, any> = {}) => {
  trackEvent('health_engagement', {
    action,
    ...details,
  });
};

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
