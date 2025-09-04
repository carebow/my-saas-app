import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { seoData, SEOPageData } from '../utils/seoData';

export const useSEO = (pageKey?: string, customData?: Partial<SEOPageData>) => {
  const location = useLocation();
  
  useEffect(() => {
    // Determine page key from location if not provided
    const currentPageKey = pageKey || getPageKeyFromPath(location.pathname);
    const pageData = seoData[currentPageKey] || seoData.home;
    
    // Merge with custom data if provided
    const finalData = { ...pageData, ...customData };
    
    // Update document title
    document.title = finalData.title;
    
    // Update meta description
    updateMetaTag('description', finalData.description);
    updateMetaTag('keywords', finalData.keywords);
    
    // Update Open Graph tags
    updateMetaTag('og:title', finalData.title, 'property');
    updateMetaTag('og:description', finalData.description, 'property');
    updateMetaTag('og:url', finalData.url, 'property');
    
    // Update Twitter tags
    updateMetaTag('twitter:title', finalData.title);
    updateMetaTag('twitter:description', finalData.description);
    
    // Update canonical URL
    updateCanonicalUrl(finalData.url);
    
    // Track page view for analytics
    if (typeof gtag !== 'undefined') {
      gtag('config', 'G-SM8RQTDWBH', {
        page_title: finalData.title,
        page_location: finalData.url,
        page_path: location.pathname
      });
    }
    
  }, [location.pathname, pageKey, customData]);
};

const getPageKeyFromPath = (pathname: string): string => {
  const pathMap: Record<string, string> = {
    '/': 'home',
    '/services': 'services',
    '/technology': 'technology',
    '/about': 'about',
    '/contact': 'contact',
    '/careers': 'careers',
    '/blog': 'blog',
    '/diabetes-home-care': 'diabetesHomeCare',
    '/post-stroke-recovery': 'postStrokeRecovery',
    '/alzheimers-care': 'alzheimersCare',
    '/ask-carebow': 'askCareBow',
    '/privacy-policy': 'privacyPolicy',
    '/terms-of-service': 'termsOfService',
    '/hipaa-compliance': 'hipaaCompliance'
  };
  
  return pathMap[pathname] || 'home';
};

const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

const updateCanonicalUrl = (url: string) => {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  
  canonical.setAttribute('href', url);
};

// SEO performance monitoring
export const trackSEOMetrics = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Track Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          // Track LCP
          if (typeof gtag !== 'undefined') {
            gtag('event', 'LCP', {
              event_category: 'Web Vitals',
              value: Math.round(entry.startTime),
              non_interaction: true,
            });
          }
        }
        
        if (entry.entryType === 'first-input') {
          // Track FID
          if (typeof gtag !== 'undefined') {
            gtag('event', 'FID', {
              event_category: 'Web Vitals',
              value: Math.round(entry.processingStart - entry.startTime),
              non_interaction: true,
            });
          }
        }
        
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          // Track CLS
          if (typeof gtag !== 'undefined') {
            gtag('event', 'CLS', {
              event_category: 'Web Vitals',
              value: Math.round((entry as any).value * 1000),
              non_interaction: true,
            });
          }
        }
      });
    });
    
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      // Fallback for browsers that don't support all entry types
      console.log('Some performance metrics not supported');
    }
  }
};