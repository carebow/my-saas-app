
import Navbar from "../components/UnifiedNavigation";
import HeroSection from "../components/HeroSection";
import EnhancedWaitlistSection from "../components/EnhancedWaitlistSection";
import Footer from "../components/UnifiedFooter";
import SEO from "../components/SEO";
import LazyVisible from "../components/LazyVisible";
import { lazy } from "react";

// Lazy load below-the-fold sections
const HowItWorksSection = lazy(() => import("../components/HowItWorksSection"));
const TrustSignalsSection = lazy(() => import("../components/TrustSignalsSection"));
const ServicesSection = lazy(() => import("../components/ServicesSection"));
const BenefitsSection = lazy(() => import("../components/BenefitsSection"));
const CompetitiveDifferentiation = lazy(() => import("../components/CompetitiveDifferentiation"));
const StaticStats = lazy(() => import("../components/enhanced/StaticStats"));
const FAQSection = lazy(() => import("../components/FAQSection"));
const ComingSoonSection = lazy(() => import("../components/ComingSoonSection"));

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "CareBow - AI-Powered In-Home Healthcare Network",
    "description": "Transform your family's healthcare experience with CareBow's AI-powered in-home care network. Get personalized medical care, elder care, pediatric services, and 24/7 health monitoring at home.",
    "url": "https://www.carebow.com",
    "mainEntity": {
      "@type": "Organization",
      "name": "CareBow",
      "description": "USA's first tech-enabled in-home care network"
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="CareBow | AI-Powered In-Home Healthcare Network in USA"
        description="Transform your family's healthcare with CareBow's AI-powered in-home care network. Get personalized medical care, elder care, pediatric services, and 24/7 health monitoring delivered to your home in Pittsburgh, PA and nationwide."
        keywords="home healthcare USA, in-home care Pittsburgh, AI healthcare, telemedicine services, elder care at home, pediatric home care, post-surgery recovery, urgent care at home, medication management, health monitoring, 24/7 healthcare, remote patient care, digital health Pittsburgh, healthcare innovation, personalized medical care"
        url="https://www.carebow.com"
        structuredData={structuredData}
      />
      <Navbar />
      <main>
        <HeroSection />
        <LazyVisible>
          <HowItWorksSection />
        </LazyVisible>
        <LazyVisible>
          <TrustSignalsSection />
        </LazyVisible>
        <LazyVisible>
          <ServicesSection />
        </LazyVisible>
        <LazyVisible>
          <BenefitsSection />
        </LazyVisible>
        <LazyVisible>
          <CompetitiveDifferentiation />
        </LazyVisible>
        <LazyVisible>
          <StaticStats />
        </LazyVisible>
        <LazyVisible>
          <FAQSection />
        </LazyVisible>
        <EnhancedWaitlistSection />
        <LazyVisible>
          <ComingSoonSection />
        </LazyVisible>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
