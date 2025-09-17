import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  type: 'organization' | 'website' | 'article' | 'faq' | 'medical_condition' | 'healthcare_provider';
  data: any;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const getStructuredData = () => {
    switch (type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "CareBow",
          "description": "AI-powered healthcare platform combining modern medicine with traditional healing wisdom",
          "url": "https://carebow.com",
          "logo": "https://carebow.com/logo.png",
          "foundingDate": "2024",
          "founders": [
            {
              "@type": "Person",
              "name": "Dr. Sarah Chen",
              "jobTitle": "Chief Medical Officer"
            },
            {
              "@type": "Person", 
              "name": "Dr. Raj Patel",
              "jobTitle": "Chief Technology Officer"
            }
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-555-123-4567",
            "contactType": "customer service",
            "email": "support@carebow.com"
          },
          "sameAs": [
            "https://twitter.com/carebow",
            "https://linkedin.com/company/carebow",
            "https://instagram.com/carebow"
          ],
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "San Francisco",
            "addressRegion": "CA",
            "addressCountry": "US"
          }
        };

      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "CareBow",
          "description": "AI-powered healthcare platform for personalized health insights and traditional medicine",
          "url": "https://carebow.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://carebow.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        };

      case 'article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title,
          "description": data.excerpt,
          "author": {
            "@type": "Person",
            "name": data.author
          },
          "publisher": {
            "@type": "Organization",
            "name": "CareBow",
            "logo": {
              "@type": "ImageObject",
              "url": "https://carebow.com/logo.png"
            }
          },
          "datePublished": data.publishedAt,
          "dateModified": data.publishedAt,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://carebow.com/blog/${data.slug}`
          },
          "image": data.imageUrl,
          "articleSection": data.category,
          "keywords": data.tags.join(", ")
        };

      case 'faq':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": data.questions.map((q: any) => ({
            "@type": "Question",
            "name": q.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": q.answer
            }
          }))
        };

      case 'medical_condition':
        return {
          "@context": "https://schema.org",
          "@type": "MedicalCondition",
          "name": data.name,
          "description": data.description,
          "cause": data.commonCauses,
          "signOrSymptom": data.relatedSymptoms,
          "possibleTreatment": {
            "@type": "MedicalTherapy",
            "name": "Self-care and medical consultation",
            "description": "Combination of self-care measures and professional medical advice"
          },
          "alternateName": data.keywords
        };

      case 'healthcare_provider':
        return {
          "@context": "https://schema.org",
          "@type": "MedicalOrganization",
          "name": "CareBow",
          "description": "AI-powered healthcare platform providing personalized health insights",
          "url": "https://carebow.com",
          "logo": "https://carebow.com/logo.png",
          "medicalSpecialty": [
            "General Practice",
            "Preventive Medicine",
            "Telemedicine",
            "AI-Powered Healthcare"
          ],
          "hasCredential": [
            {
              "@type": "EducationalOccupationalCredential",
              "credentialCategory": "HIPAA Compliance",
              "recognizedBy": {
                "@type": "Organization",
                "name": "US Department of Health and Human Services"
              }
            }
          ],
          "areaServed": {
            "@type": "Country",
            "name": "United States"
          },
          "availableLanguage": ["English", "Spanish", "Hindi"],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-555-123-4567",
            "contactType": "customer service",
            "email": "support@carebow.com",
            "availableLanguage": ["English", "Spanish", "Hindi"]
          }
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData, null, 2)}
      </script>
    </Helmet>
  );
};

// Predefined FAQ data for SEO
export const faqStructuredData = {
  questions: [
    {
      question: "What is CareBow and how does it work?",
      answer: "CareBow is an AI-powered healthcare platform that combines modern medicine with traditional healing wisdom. Our AI assistant analyzes your symptoms, provides personalized health insights, and connects you with appropriate care resources."
    },
    {
      question: "Is CareBow a substitute for professional medical care?",
      answer: "No, CareBow is not a substitute for professional medical advice, diagnosis, or treatment. It's designed to provide general health information and guidance. Always consult with qualified healthcare providers for serious health concerns."
    },
    {
      question: "How accurate is the AI's health analysis?",
      answer: "Our AI is trained on extensive medical databases and continuously improved through machine learning. However, it's designed to provide general guidance and should not be used for self-diagnosis."
    },
    {
      question: "Is my health information secure and private?",
      answer: "Yes, absolutely. We are fully HIPAA-compliant and use end-to-end encryption to protect your health data. All information is stored securely in encrypted databases."
    },
    {
      question: "Can I use CareBow for emergency medical situations?",
      answer: "No, CareBow is not designed for emergency situations. If you are experiencing a medical emergency, call 911 or go to your nearest emergency room immediately."
    }
  ]
};
