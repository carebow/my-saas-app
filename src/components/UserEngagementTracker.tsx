import React, { useEffect } from 'react';
import { useAnalyticsContext } from './AnalyticsProvider';

export const UserEngagementTracker: React.FC = () => {
  const { trackUserAction, trackFeatureUsage } = useAnalyticsContext();

  useEffect(() => {
    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        
        // Track milestone scroll depths
        if (scrollPercent >= 25 && maxScrollDepth < 25) {
          trackUserAction('scroll_25_percent');
        } else if (scrollPercent >= 50 && maxScrollDepth < 50) {
          trackUserAction('scroll_50_percent');
        } else if (scrollPercent >= 75 && maxScrollDepth < 75) {
          trackUserAction('scroll_75_percent');
        } else if (scrollPercent >= 90 && maxScrollDepth < 90) {
          trackUserAction('scroll_90_percent');
        }
      }
    };

    // Track time on page
    const startTime = Date.now();
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackUserAction('time_on_page', { seconds: timeSpent });
    };

    // Track clicks on key elements
    const trackClicks = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Track button clicks
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const buttonText = target.textContent?.trim() || 'Unknown Button';
        trackUserAction('button_click', { button_text: buttonText });
      }
      
      // Track link clicks
      if (target.tagName === 'A' || target.closest('a')) {
        const link = target.closest('a') as HTMLAnchorElement;
        trackUserAction('link_click', { 
          href: link.href,
          text: link.textContent?.trim() || 'Unknown Link'
        });
      }
      
      // Track form interactions
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        const formElement = target as HTMLInputElement;
        trackFeatureUsage('form_interaction', {
          field_type: formElement.type || formElement.tagName.toLowerCase(),
          field_name: formElement.name || formElement.id || 'unnamed'
        });
      }
    };

    // Add event listeners
    window.addEventListener('scroll', trackScrollDepth, { passive: true });
    window.addEventListener('beforeunload', trackTimeOnPage);
    document.addEventListener('click', trackClicks, { passive: true });

    // Track page load time
    if (document.readyState === 'complete') {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      trackUserAction('page_load_time', { milliseconds: loadTime });
    } else {
      window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        trackUserAction('page_load_time', { milliseconds: loadTime });
      });
    }

    return () => {
      window.removeEventListener('scroll', trackScrollDepth);
      window.removeEventListener('beforeunload', trackTimeOnPage);
      document.removeEventListener('click', trackClicks);
    };
  }, [trackUserAction, trackFeatureUsage]);

  return null; // This component doesn't render anything
};