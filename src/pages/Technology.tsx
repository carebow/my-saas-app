
import React from "react";
import SEO from "../components/SEO";
import Navbar from "../components/UnifiedNavigation";
import Footer from "../components/UnifiedFooter";

const Technology = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "AI-Powered Healthcare Technology by CareBow",
    "description": "Discover how CareBow's cutting-edge AI technology, machine learning algorithms, and secure healthcare platform revolutionize in-home medical care delivery.",
    "author": {
      "@type": "Organization",
      "name": "CareBow"
    },
    "publisher": {
      "@type": "Organization",
      "name": "CareBow"
    },
    "about": {
      "@type": "Thing",
      "name": "Healthcare Technology"
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AI Healthcare Technology | CareBow Innovation Platform"
        description="Explore CareBow's revolutionary AI-powered healthcare technology. Learn about our machine learning algorithms, secure patient data platform, predictive analytics, and cutting-edge medical technology that powers in-home care."
        keywords="AI healthcare technology, machine learning healthcare, healthcare innovation, medical AI, predictive healthcare analytics, secure healthcare platform, digital health technology, telemedicine technology, remote patient monitoring, healthcare automation, medical data analytics, AI diagnosis, smart healthcare"
        url="https://www.carebow.com/technology"
        structuredData={structuredData}
      />
      <Navbar />
      
      <main className="pt-20">
        <TechnologyHero />
        <TechnologyStack />
        <TechnologyStats />
        <AISection />
        <TechnologyCTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default Technology;
