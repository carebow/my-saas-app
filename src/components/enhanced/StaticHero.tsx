
import React from "react";
import { ArrowRight, Shield, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { smoothScrollTo } from "@/utils/smoothScroll";
import heroFamilyImage from "@/assets/hero-family-care.jpg";

const StaticHero = () => {
  const scrollToWaitlist = React.useCallback(() => {
    smoothScrollTo('waitlist', { offset: 80 });
  }, []);

  const watchDemo = React.useCallback(() => {
    window.open('https://cal.com/carebow/30min', '_blank', 'noopener,noreferrer');
  }, []);

  const goToAskCareBow = React.useCallback(() => {
    window.location.href = '/ask-carebow';
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Static background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-left">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-primary/20 text-foreground px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
              <Shield className="w-4 h-4 text-primary" />
              HIPAA Compliant • Licensed Caregivers
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Help Your Parents{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Age Safely at Home
              </span>{" "}
              — Without the Worry
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
              AI-powered care coordination that connects families with verified caregivers, 
              predictive health monitoring, and real-time insights — giving adult children peace of mind caring for aging parents.
            </p>

            {/* Key benefits */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Verified Caregivers</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">24/7 Monitoring</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Family Updates</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-8 py-4 rounded-xl shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:-translate-y-1 text-lg font-semibold min-h-[56px]"
                onClick={scrollToWaitlist}
              >
                <span>Get Early Access for Your Family</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-accent/30 text-accent hover:bg-accent/10 hover:border-accent px-8 py-4 rounded-xl text-lg font-semibold min-h-[56px] bg-card/80 backdrop-blur-sm"
                onClick={goToAskCareBow}
              >
                🧠 Try Ask CareBow AI
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary px-8 py-4 rounded-xl text-lg font-semibold min-h-[56px] bg-card/80 backdrop-blur-sm"
                onClick={watchDemo}
              >
                Book Demo Walkthrough
              </Button>
            </div>

            {/* Urgency element */}
            <div className="mt-6 text-sm text-muted-foreground">
              🔥 <span className="font-medium text-secondary">Limited spots available</span> - Join 3,000+ families on the waitlist
            </div>
          </div>

          {/* Right side - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroFamilyImage}
                alt="Caring millennial daughter helping her elderly father at home"
                className="w-full h-auto object-cover"
                width="600"
                height="400"
                loading="eager"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Static floating indicators */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-xl border border-primary/20">
              <div className="text-2xl font-bold text-primary">3,000+</div>
              <div className="text-sm text-muted-foreground">Families on Waitlist</div>
            </div>

            <div className="absolute -top-6 -right-6 bg-card rounded-xl p-4 shadow-xl border border-secondary/20">
              <div className="text-lg font-bold text-secondary">Coming Soon</div>
              <div className="text-sm text-muted-foreground">24/7 Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StaticHero;
