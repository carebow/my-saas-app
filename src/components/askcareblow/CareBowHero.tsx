import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Stethoscope, Play, Shield, Globe, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const CareBowHero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
      
      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-12 h-12 bg-primary/10 rounded-full blur-sm"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-32 right-10 w-8 h-8 bg-accent/10 rounded-full blur-sm"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Beta Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm font-medium text-primary mb-6"
          >
            <Stethoscope className="w-4 h-4" />
            BETA - Your Health Buddy
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">NEW</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            Your AI-Powered Journey to{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Natural Wellness
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            Experience the future of healthcare with our intelligent AI assistant that speaks with empathy, 
            understands your symptoms, and guides you through personalized natural remedies in 7 languages.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button
              size="lg"
              className="bg-gradient-primary text-primary-foreground hover:opacity-90 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <Link to="/auth?redirect=/ask-carebow/app">
                <Heart className="w-5 h-5 mr-2" />
                Begin Your Health Journey
              </Link>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection('features')}
              className="px-8 py-4 text-lg font-semibold border-2 hover:bg-muted"
            >
              <Play className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            <div className="flex flex-col items-center p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">25,000+</div>
              <div className="text-sm text-muted-foreground">AI-Guided Healings</div>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-3">
                <Globe className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-foreground">7</div>
              <div className="text-sm text-muted-foreground">Voice-Enabled Languages</div>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-foreground">100%</div>
              <div className="text-sm text-muted-foreground">AI-Protected Privacy</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CareBowHero;