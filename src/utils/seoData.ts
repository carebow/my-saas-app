export interface SEOPageData {
  title: string;
  description: string;
  keywords: string;
  url: string;
  image?: string;
  structuredData?: any;
}

export const seoData: Record<string, SEOPageData> = {
  home: {
    title: "CareBow | AI-Powered In-Home Healthcare Network in USA",
    description: "Transform your family's healthcare with CareBow's AI-powered in-home care network. Get personalized medical care, elder care, pediatric services, and 24/7 health monitoring delivered to your home in Pittsburgh, PA and nationwide.",
    keywords: "home healthcare USA, in-home care Pittsburgh, AI healthcare, telemedicine services, elder care at home, pediatric home care, post-surgery recovery, urgent care at home, medication management, health monitoring, 24/7 healthcare, remote patient care, digital health Pittsburgh, healthcare innovation, personalized medical care, HIPAA compliant healthcare, licensed healthcare providers, medical care delivery, home nursing services, chronic disease management",
    url: "https://www.carebow.com",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "CareBow - AI-Powered In-Home Healthcare Network",
      "description": "Transform your family's healthcare experience with CareBow's AI-powered in-home care network.",
      "url": "https://www.carebow.com",
      "mainEntity": {
        "@type": "Organization",
        "name": "CareBow",
        "description": "USA's first tech-enabled in-home care network"
      }
    }
  },
  
  services: {
    title: "In-Home Healthcare Services | Elder Care, Pediatric Care | CareBow",
    description: "Comprehensive in-home healthcare services including elder care, pediatric care, post-surgery recovery, medication management, and 24/7 health monitoring. HIPAA compliant and licensed professionals.",
    keywords: "in-home healthcare services, elder care services, pediatric home care, post-surgery recovery, medication management, home nursing, chronic disease management, HIPAA compliant healthcare, licensed healthcare providers, home health aide, skilled nursing at home, medical care delivery",
    url: "https://www.carebow.com/services"
  },

  technology: {
    title: "AI Healthcare Technology | Telemedicine Platform | CareBow",
    description: "Discover CareBow's cutting-edge AI healthcare technology platform. Advanced telemedicine, health monitoring, and AI-powered diagnostics for personalized in-home medical care.",
    keywords: "AI healthcare technology, telemedicine platform, health monitoring technology, AI diagnostics, digital health platform, remote patient monitoring, healthcare AI, medical technology innovation, telehealth solutions, smart healthcare",
    url: "https://www.carebow.com/technology"
  },

  about: {
    title: "About CareBow | USA's First Tech-Enabled In-Home Care Network",
    description: "Learn about CareBow's mission to revolutionize healthcare delivery through AI-powered in-home care. Founded in 2024, we're transforming how families access quality healthcare at home.",
    keywords: "about CareBow, healthcare innovation, in-home care network, AI healthcare company, healthcare technology startup, medical care revolution, Pittsburgh healthcare, healthcare mission, healthcare vision",
    url: "https://www.carebow.com/about"
  },

  contact: {
    title: "Contact CareBow | Get In-Home Healthcare Services | Pittsburgh PA",
    description: "Contact CareBow for AI-powered in-home healthcare services in Pittsburgh, PA and nationwide. Call (412) 735-1957 for personalized medical care at home.",
    keywords: "contact CareBow, Pittsburgh healthcare, in-home care contact, healthcare services Pittsburgh, medical care contact, healthcare consultation, join waitlist, healthcare inquiry",
    url: "https://www.carebow.com/contact"
  },

  careers: {
    title: "Healthcare Careers at CareBow | Join Our In-Home Care Team",
    description: "Join CareBow's mission to revolutionize healthcare. Explore career opportunities in nursing, healthcare technology, AI development, and in-home care services. Apply today!",
    keywords: "healthcare careers, nursing jobs, healthcare technology jobs, AI healthcare careers, in-home care jobs, medical careers, healthcare employment, nursing opportunities, healthcare innovation careers",
    url: "https://www.carebow.com/careers"
  },

  blog: {
    title: "Healthcare Blog | In-Home Care Tips & Health Insights | CareBow",
    description: "Expert healthcare insights, in-home care tips, and health management advice from CareBow's medical professionals. Stay informed about the latest in healthcare innovation.",
    keywords: "healthcare blog, in-home care tips, health insights, medical advice, healthcare news, elder care tips, pediatric care advice, health management, healthcare innovation news",
    url: "https://www.carebow.com/blog"
  },

  diabetesHomeCare: {
    title: "Diabetes Home Care Services | Blood Sugar Management | CareBow",
    description: "Specialized diabetes home care services including blood sugar monitoring, medication management, dietary guidance, and 24/7 support. Expert diabetes care at home.",
    keywords: "diabetes home care, blood sugar monitoring, diabetes management, diabetic care at home, insulin management, diabetes medication, diabetic nursing care, glucose monitoring, diabetes support",
    url: "https://www.carebow.com/diabetes-home-care"
  },

  postStrokeRecovery: {
    title: "Post-Stroke Recovery Care at Home | Rehabilitation Services | CareBow",
    description: "Comprehensive post-stroke recovery care at home including physical therapy, speech therapy, medication management, and 24/7 monitoring. Expert stroke rehabilitation services.",
    keywords: "post-stroke recovery, stroke rehabilitation, stroke care at home, physical therapy at home, speech therapy, stroke recovery services, neurological care, stroke support, rehabilitation services",
    url: "https://www.carebow.com/post-stroke-recovery"
  },

  alzheimersCare: {
    title: "Alzheimer's & Dementia Care at Home | Memory Care Services | CareBow",
    description: "Compassionate Alzheimer's and dementia care at home. Specialized memory care services, safety monitoring, medication management, and family support. Expert dementia care.",
    keywords: "Alzheimer's care, dementia care at home, memory care services, dementia support, Alzheimer's home care, cognitive care, memory care, dementia nursing, Alzheimer's support",
    url: "https://www.carebow.com/alzheimers-care"
  },

  askCareBow: {
    title: "Ask CareBow AI | Free Health Consultation & Medical Advice",
    description: "Get instant health advice from CareBow's AI health assistant. Free medical consultations, symptom checker, and health guidance available 24/7. Try our AI healthcare assistant now.",
    keywords: "AI health assistant, free medical consultation, symptom checker, health advice AI, medical AI, healthcare chatbot, health consultation, AI doctor, medical guidance",
    url: "https://www.carebow.com/ask-carebow"
  },

  privacyPolicy: {
    title: "Privacy Policy | HIPAA Compliance | CareBow Healthcare",
    description: "CareBow's privacy policy and HIPAA compliance information. Learn how we protect your health information and maintain the highest standards of medical data security.",
    keywords: "privacy policy, HIPAA compliance, health information privacy, medical data security, healthcare privacy, patient privacy rights, health data protection",
    url: "https://www.carebow.com/privacy-policy"
  },

  termsOfService: {
    title: "Terms of Service | Healthcare Service Agreement | CareBow",
    description: "CareBow's terms of service for in-home healthcare services. Review our service agreement, terms and conditions, and healthcare service policies.",
    keywords: "terms of service, healthcare agreement, service terms, medical service terms, healthcare policies, service agreement, terms and conditions",
    url: "https://www.carebow.com/terms-of-service"
  },

  hipaaCompliance: {
    title: "HIPAA Compliance | Healthcare Data Security | CareBow",
    description: "CareBow's commitment to HIPAA compliance and healthcare data security. Learn about our privacy practices, data protection measures, and patient rights.",
    keywords: "HIPAA compliance, healthcare data security, medical privacy, patient data protection, health information security, HIPAA regulations, medical data privacy",
    url: "https://www.carebow.com/hipaa-compliance"
  }
};

export const getFAQStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is CareBow's in-home healthcare service?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "CareBow is USA's first tech-enabled in-home care network that brings AI-powered, compassionate healthcare directly to your doorstep. We offer elder care, pediatric care, post-surgery recovery, teleconsults, urgent care, and wellness services with 24/7 monitoring and family updates."
      }
    },
    {
      "@type": "Question",
      "name": "How does AI-powered healthcare work at CareBow?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our AI technology provides instant health assessments, medication reminders, symptom analysis, and health monitoring. It connects you with certified medical professionals when needed and maintains continuous health tracking while preserving the human touch in healthcare delivery."
      }
    },
    {
      "@type": "Question",
      "name": "What areas does CareBow serve?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "CareBow currently serves Pittsburgh, PA and is rapidly expanding nationwide across the United States. Join our waitlist to be notified when we launch in your area and receive priority access to our services."
      }
    },
    {
      "@type": "Question",
      "name": "Is CareBow HIPAA compliant and secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, CareBow is fully HIPAA compliant with enterprise-grade security measures. We prioritize your privacy and ensure all health information is protected with industry-standard encryption, secure data transmission, and strict access controls."
      }
    },
    {
      "@type": "Question",
      "name": "What types of healthcare professionals work with CareBow?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "CareBow works with licensed registered nurses, certified nursing assistants, physical therapists, occupational therapists, speech therapists, and board-certified physicians. All our healthcare professionals are thoroughly vetted, licensed, and experienced in home healthcare delivery."
      }
    },
    {
      "@type": "Question",
      "name": "How much do CareBow's services cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "CareBow offers flexible pricing plans starting with basic AI consultations and scaling to comprehensive in-home care packages. We work with insurance providers and offer transparent pricing. Contact us for a personalized quote based on your specific healthcare needs."
      }
    },
    {
      "@type": "Question",
      "name": "How quickly can I get care from CareBow?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI consultations are available instantly 24/7. For in-home visits, we typically schedule within 24-48 hours for routine care and provide same-day service for urgent needs. Emergency consultations are available immediately through our telemedicine platform."
      }
    },
    {
      "@type": "Question",
      "name": "Does CareBow accept insurance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We're working with major insurance providers to offer coverage for our services. Currently, we accept private pay and are in the process of becoming in-network with Medicare, Medicaid, and major private insurance plans. Contact us to discuss payment options."
      }
    }
  ]
});

export const getBreadcrumbStructuredData = (items: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});