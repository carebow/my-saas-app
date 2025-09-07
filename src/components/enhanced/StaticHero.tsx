
import React from "react";
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { smoothScrollTo } from "@/utils/smoothScroll";
import heroFamilyImage from "@/assets/hero-family-care.jpg";

const StaticHero = () => {
  const scrollToWaitlist = React.useCallback(() => {
    smoothScrollTo('waitlist', { offset: 80 });
  }, []);

  const learnMore = React.useCallback(() => {
    smoothScrollTo('how-it-works', { offset: 80 });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-carebow-primary-50 to-carebow-primary-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-carebow-primary-50 to-carebow-primary-100 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <div className="text-left">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-carebow-text-dark mb-8 leading-tight">
              Help Your Parents Age Safely at Home —{" "}
              <span className="text-carebow-primary">
                Without the Worry
              </span>
            </h1>
            
            <p className="text-xl text-carebow-text-medium max-w-2xl mb-10 leading-relaxed">
              Get personalized care plans, 24/7 monitoring, and peace of mind with CareBow's 
              comprehensive in-home healthcare services designed specifically for aging parents.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="bg-carebow-primary hover:bg-carebow-primary-700 text-white px-8 py-4 rounded-xl text-lg font-semibold min-h-[56px] shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={scrollToWaitlist}
              >
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-carebow-primary text-carebow-primary hover:bg-carebow-primary-50 px-8 py-4 rounded-xl text-lg font-semibold min-h-[56px]"
                onClick={learnMore}
              >
                Learn More
              </Button>
            </div>

            {/* Trust indicator */}
            <div className="inline-flex items-center gap-2 bg-carebow-bg-light text-carebow-text-light px-4 py-2 rounded-full text-sm font-medium">
              <Heart className="w-4 h-4 text-carebow-primary" />
              2,000+ Families Trust CareBow
            </div>
          </div>

          {/* Right side - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroFamilyImage}
                alt="Caring daughter helping her elderly father with tablet at home"
                className="w-full h-auto object-cover"
                width="600"
                height="500"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            
            {/* Floating trust indicator */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-xl border border-carebow-primary-200">
              <div className="text-2xl font-bold text-carebow-primary">2,000+</div>
              <div className="text-sm text-carebow-text-light">Families</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StaticHero;
