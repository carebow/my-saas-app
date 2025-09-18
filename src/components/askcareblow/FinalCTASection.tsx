import React from 'react';
// import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const FinalCTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 w-16 h-16 bg-accent/5 rounded-full blur-xl"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-8">
              <Heart className="w-10 h-10 text-primary" />
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Ready to Start Your 
              <span className="gradient-text"> Health Journey?</span>
            </h2>

            {/* Description */}
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience personalized natural health guidance in your preferred language. 
              Start with 3 free consultations and discover the power of AI-driven wellness.
            </p>

            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-10 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary" />
                <span>3 free consultations</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-primary" />
                <span>Instant access</span>
              </div>
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Button
                size="lg"
                className="bg-gradient-primary text-primary-foreground hover:opacity-90 px-12 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
                asChild
              >
                <Link to="/auth?redirect=/ask-carebow/app">
                  <img 
                    src="/images/carebow-logo.png" 
                    alt="CareBow Logo" 
                    className="w-6 h-6 mr-3"
                  />
                  Try CareBow Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>

            {/* Additional Info */}
            <p className="text-sm text-muted-foreground mt-6">
              Join thousands of users who've found natural relief with CareBow's AI guidance
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;