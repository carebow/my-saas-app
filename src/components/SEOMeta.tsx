import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOMetaProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  noIndex?: boolean;
  structuredData?: any;
}

export const SEOMeta: React.FC<SEOMetaProps> = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage = "https://carebow.com/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  noIndex = false,
  structuredData
}) => {
  const fullTitle = title.includes('CareBow') ? title : `${title} | CareBow`;
  const fullDescription = description.length > 160 
    ? description.substring(0, 157) + '...' 
    : description;
  
  const defaultKeywords = [
    'AI healthcare',
    'symptom checker',
    'telemedicine',
    'healthcare AI',
    'medical advice',
    'health platform',
    'Ayurvedic medicine',
    'holistic health',
    'healthcare technology',
    'medical consultation'
  ];

  const allKeywords = [...new Set([...keywords, ...defaultKeywords])];

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={allKeywords.join(', ')} />
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl || window.location.href} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="CareBow" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="CareBow Team" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#2563eb" />
      
      {/* Healthcare Specific Meta Tags */}
      <meta name="healthcare:specialty" content="General Practice, Preventive Medicine, AI-Powered Healthcare" />
      <meta name="healthcare:compliance" content="HIPAA Compliant" />
      <meta name="healthcare:language" content="English, Spanish, Hindi" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData, null, 2)}
        </script>
      )}
    </Helmet>
  );
};

// Predefined SEO configurations for different page types
export const seoConfigs = {
  homepage: {
    title: "CareBow - AI-Powered Healthcare Platform | Personalized Health Insights",
    description: "Get personalized health insights with CareBow's AI-powered healthcare platform. Combining modern medicine with traditional healing wisdom for better health outcomes.",
    keywords: ["AI healthcare", "symptom checker", "personalized health", "telemedicine", "healthcare platform"]
  },
  
  symptomChecker: {
    title: "AI Symptom Checker | Get Instant Health Analysis | CareBow",
    description: "Use our advanced AI symptom checker for instant health analysis. Get personalized recommendations combining modern medicine with traditional healing wisdom.",
    keywords: ["symptom checker", "AI health analysis", "medical symptoms", "health assessment", "symptom analysis"]
  },
  
  about: {
    title: "About CareBow | AI Healthcare Innovation | Our Mission",
    description: "Learn about CareBow's mission to democratize healthcare through AI-powered technology, combining modern medicine with traditional healing wisdom.",
    keywords: ["about CareBow", "healthcare innovation", "AI healthcare", "healthcare mission", "healthcare technology"]
  },
  
  blog: {
    title: "Health Blog | Expert Insights & Tips | CareBow",
    description: "Read expert insights on AI-powered healthcare, traditional medicine, and wellness tips. Stay informed with CareBow's comprehensive health blog.",
    keywords: ["health blog", "healthcare insights", "wellness tips", "medical articles", "health education"]
  },
  
  privacy: {
    title: "Privacy Policy | Data Protection | CareBow",
    description: "Learn how CareBow protects your health data with HIPAA-compliant security measures and end-to-end encryption.",
    keywords: ["privacy policy", "data protection", "HIPAA compliance", "health data security", "patient privacy"]
  },
  
  terms: {
    title: "Terms of Service | CareBow Healthcare Platform",
    description: "Read CareBow's terms of service and understand our platform's usage guidelines and medical disclaimers.",
    keywords: ["terms of service", "platform guidelines", "medical disclaimers", "usage terms", "healthcare terms"]
  },
  
  disclaimer: {
    title: "Medical Disclaimer | Important Health Information | CareBow",
    description: "Important medical disclaimer and safety information for using CareBow's AI-powered healthcare platform.",
    keywords: ["medical disclaimer", "health safety", "medical advice", "healthcare disclaimer", "safety information"]
  }
};

// Function to get SEO config for specific page types
export const getSEOConfig = (pageType: keyof typeof seoConfigs, customData?: Partial<SEOMetaProps>) => {
  const baseConfig = seoConfigs[pageType];
  return {
    ...baseConfig,
    ...customData
  };
};
