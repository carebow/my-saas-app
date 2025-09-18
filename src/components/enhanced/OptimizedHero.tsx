
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from '../ui/button';
import { useEffect, useState } from "react";

const OptimizedHero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  
  useEffect(() => {
    // Delay animations until after initial render
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToWaitlist = () => {
    if (window.location.pathname === '/') {
      const element = document.getElementById('waitlist');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = '/#waitlist';
    }
  };

  // Simplified animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: shouldReduceMotion ? 0 : 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.6 }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30">
      {/* Simplified background - no continuous animations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
      </div>

      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} className="mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Revolutionizing Healthcare at Home
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            The Future of{" "}
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Healthcare
            </span>{" "}
            is Here
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            AI-powered, personalized in-home healthcare that adapts to your unique needs. 
            Experience the perfect blend of technology and compassionate care.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Button
            size="lg"
            className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 text-lg font-semibold min-h-[44px]"
            onClick={scrollToWaitlist}
          >
            <span>Join the Waitlist</span>
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50 px-8 py-4 rounded-xl text-lg font-semibold min-h-[44px]"
          >
            Watch Demo
          </Button>
        </motion.div>

        {/* Simplified stats - no complex animations */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          {[
            { number: "10K+", label: "Families Waiting" },
            { number: "24/7", label: "AI Support" },
            { number: "98%", label: "Care Satisfaction" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg"
            >
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default OptimizedHero;
