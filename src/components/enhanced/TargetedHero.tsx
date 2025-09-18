
import { motion } from "framer-motion";
import { ArrowRight, Shield, Users, Clock } from "lucide-react";
import { Button } from '../ui/button';
import { scrollToElement } from "@/utils/scrollUtils";
import heroFamilyImage from "@/assets/hero-family-care.jpg";

const TargetedHero = () => {
  const scrollToWaitlist = () => {
    if (window.location.pathname === '/') {
      const element = document.getElementById('waitlist');
      if (element) {
        scrollToElement('#waitlist', { duration: 1.5, offset: -100 });
      } else {
        setTimeout(() => {
          const retryElement = document.getElementById('waitlist');
          if (retryElement) {
            scrollToElement('#waitlist', { duration: 1.5, offset: -100 });
          }
        }, 100);
      }
    } else {
      window.location.href = '/#waitlist';
    }
  };

  const watchDemo = () => {
    window.open('https://cal.com/carebow/30min', '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-carebow-blue/20 to-carebow-mint/20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-carebow-secondary/10 to-carebow-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            {/* Trust badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-carebow-primary/20 text-carebow-text-dark px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg"
            >
              <Shield className="w-4 h-4 text-carebow-primary" />
              HIPAA Compliant • Licensed Caregivers
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-carebow-text-dark mb-6 leading-tight"
            >
              Help Your Parents{" "}
              <span className="bg-gradient-to-r from-carebow-primary via-carebow-secondary to-carebow-accent bg-clip-text text-transparent">
                Age Safely at Home
              </span>{" "}
              — Without the Worry
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg sm:text-xl text-carebow-text-medium max-w-2xl mb-8 leading-relaxed"
            >
              AI-powered care coordination that gives millennial families peace of mind 
              while keeping parents independent and comfortable in their own home.
            </motion.p>

            {/* Key benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-6 mb-8"
            >
              <div className="flex items-center gap-2 text-carebow-text-medium">
                <Users className="w-5 h-5 text-carebow-primary" />
                <span className="text-sm font-medium">Verified Caregivers</span>
              </div>
              <div className="flex items-center gap-2 text-carebow-text-medium">
                <Clock className="w-5 h-5 text-carebow-primary" />
                <span className="text-sm font-medium">24/7 Monitoring</span>
              </div>
              <div className="flex items-center gap-2 text-carebow-text-medium">
                <Shield className="w-5 h-5 text-carebow-primary" />
                <span className="text-sm font-medium">Family Updates</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="group bg-gradient-to-r from-carebow-primary to-carebow-secondary hover:from-carebow-primary/90 hover:to-carebow-secondary/90 text-white px-8 py-4 rounded-xl shadow-2xl hover:shadow-carebow-primary/25 transition-all duration-300 transform hover:-translate-y-1 text-lg font-semibold min-h-[56px]"
                onClick={scrollToWaitlist}
              >
                <span>Get Early Access for Your Family</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-carebow-accent/30 text-carebow-accent hover:bg-carebow-accent/10 hover:border-carebow-accent px-8 py-4 rounded-xl text-lg font-semibold min-h-[56px] bg-white/80 backdrop-blur-sm"
                onClick={() => window.location.href = '/ask-carebow'}
              >
                🧠 Try Ask CareBow AI
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-carebow-primary/30 text-carebow-primary hover:bg-carebow-blue/20 hover:border-carebow-primary px-8 py-4 rounded-xl text-lg font-semibold min-h-[56px] bg-white/80 backdrop-blur-sm"
                onClick={watchDemo}
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Urgency element */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-6 text-sm text-carebow-text-light"
            >
              🔥 <span className="font-medium text-carebow-secondary">Limited spots available</span> - Join 3,000+ families on the waitlist
            </motion.div>
          </motion.div>

          {/* Right side - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroFamilyImage}
                alt="Caring millennial daughter helping her elderly father at home"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating trust indicators */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl border border-carebow-blue/20"
            >
              <div className="text-2xl font-bold text-carebow-primary">3,000+</div>
              <div className="text-sm text-carebow-text-medium">Families on Waitlist</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-xl border border-carebow-mint/20"
            >
              <div className="text-lg font-bold text-carebow-secondary">Coming Soon</div>
              <div className="text-sm text-carebow-text-medium">24/7 Support</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TargetedHero;
