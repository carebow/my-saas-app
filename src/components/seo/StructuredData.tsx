import React from 'react';

interface StructuredDataProps {
  type: 'organization' | 'website' | 'service' | 'faq' | 'breadcrumb' | 'review' | 'article';
  data: any;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const getStructuredData = () => {
    const baseContext = "https://schema.org";
    
    switch (type) {
      case 'organization':
        return {
          "@context": baseContext,
          "@type": "Organization",
          "@id": "https://www.carebow.com/#organization",
          "name": "CareBow",
          "url": "https://www.carebow.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.carebow.com/images/carebow-logo.png",
            "width": 512,
            "height": 512
          },
          "description": "USA's first tech-enabled in-home care network, bringing AI-powered, compassionate healthcare directly to your doorstep.",
          "foundingDate": "2024",
          "founder": {
            "@type": "Person",
            "name": "CareBow Team"
          },
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "telephone": "+1-412-735-1957",
              "contactType": "customer service",
              "email": "info@carebow.com",
              "availableLanguage": ["English"],
              "areaServed": "US",
              "hoursAvailable": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "00:00",
                "closes": "23:59"
              }
            }
          ],
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Pittsburgh",
            "addressRegion": "PA",
            "addressCountry": "US"
          },
          "areaServed": {
            "@type": "Country",
            "name": "United States"
          },
          "sameAs": [
            "https://twitter.com/carebow",
            "https://www.linkedin.com/company/carebow",
            "https://www.facebook.com/carebow"
          ],
          "knowsAbout": [
            "Home Healthcare",
            "Telemedicine",
            "AI Healthcare",
            "Elder Care",
            "Pediatric Care",
            "Post-Surgery Recovery",
            "Medication Management",
            "Health Monitoring"
          ],
          ...data
        };

      case 'website':
        return {
          "@context": baseContext,
          "@type": "WebSite",
          "@id": "https://www.carebow.com/#website",
          "url": "https://www.carebow.com",
          "name": "CareBow",
          "description": "AI-Powered In-Home Healthcare Network",
          "publisher": {
            "@id": "https://www.carebow.com/#organization"
          },
          "potentialAction": [
            {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://www.carebow.com/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          ],
          "inLanguage": "en-US",
          ...data
        };

      case 'service':
        return {
          "@context": baseContext,
          "@type": "MedicalOrganization",
          "@id": "https://www.carebow.com/#medical-organization",
          "name": "CareBow",
          "url": "https://www.carebow.com",
          "description": "AI-powered in-home healthcare network providing personalized medical care at home",
          "medicalSpecialty": [
            "Home Healthcare",
            "Telemedicine", 
            "Preventive Care",
            "Elder Care",
            "Pediatric Care",
            "Post-Surgery Recovery",
            "Chronic Disease Management",
            "Urgent Care",
            "Medication Management",
            "Health Monitoring"
          ],
          "availableService": [
            {
              "@type": "MedicalService",
              "name": "AI-Powered Health Consultations",
              "description": "Instant AI-backed health assessments with immediate access to certified medical professionals",
              "serviceType": "Telemedicine",
              "provider": {
                "@id": "https://www.carebow.com/#organization"
              }
            },
            {
              "@type": "MedicalService",
              "name": "In-Home Elder Care",
              "description": "Comprehensive elder care services including medication management, mobility assistance, and companionship",
              "serviceType": "Home Healthcare",
              "provider": {
                "@id": "https://www.carebow.com/#organization"
              }
            },
            {
              "@type": "MedicalService",
              "name": "Pediatric Home Care",
              "description": "Specialized child-friendly health services with trained pediatric healthcare professionals",
              "serviceType": "Pediatric Care",
              "provider": {
                "@id": "https://www.carebow.com/#organization"
              }
            },
            {
              "@type": "MedicalService",
              "name": "Post-Surgery Recovery Care",
              "description": "Professional post-operative care and recovery support in your home environment",
              "serviceType": "Recovery Care",
              "provider": {
                "@id": "https://www.carebow.com/#organization"
              }
            },
            {
              "@type": "MedicalService",
              "name": "24/7 Health Monitoring",
              "description": "Technology-enabled continuous health monitoring with family updates and emergency response",
              "serviceType": "Health Monitoring",
              "provider": {
                "@id": "https://www.carebow.com/#organization"
              }
            }
          ],
          "areaServed": {
            "@type": "Country",
            "name": "United States"
          },
          "hasCredential": {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "HIPAA Compliant"
          },
          ...data
        };

      case 'faq':
        return {
          "@context": baseContext,
          "@type": "FAQPage",
          "mainEntity": data.questions?.map((q: any) => ({
            "@type": "Question",
            "name": q.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": q.answer
            }
          })) || []
        };

      case 'breadcrumb':
        return {
          "@context": baseContext,
          "@type": "BreadcrumbList",
          "itemListElement": data.items?.map((item: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          })) || []
        };

      case 'review':
        return {
          "@context": baseContext,
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": data.rating,
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": data.author
          },
          "reviewBody": data.body,
          "itemReviewed": {
            "@type": "Organization",
            "@id": "https://www.carebow.com/#organization"
          },
          ...data
        };

      case 'article':
        return {
          "@context": baseContext,
          "@type": "Article",
          "headline": data.headline,
          "description": data.description,
          "image": data.image,
          "author": {
            "@type": "Person",
            "name": data.author
          },
          "publisher": {
            "@id": "https://www.carebow.com/#organization"
          },
          "datePublished": data.datePublished,
          "dateModified": data.dateModified,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": data.url
          },
          ...data
        };

      default:
        return data;
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData())
      }}
    />
  );
};

export default StructuredData;