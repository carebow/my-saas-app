
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from '../ui/button';

const AnimatedHero = () => {
  const scrollToWaitlist = () => {
    // First check if we're on the homepage
    if (window.location.pathname === '/') {
      // We're on homepage, scroll to waitlist section
      const element = document.getElementById('waitlist');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // If element not found, wait a bit and try again (in case it's still loading)
        setTimeout(() => {
          const retryElement = document.getElementById('waitlist');
          if (retryElement) {
            retryElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      // If not on homepage, navigate to homepage with hash
      window.location.href = '/#waitlist';
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"
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
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Revolutionizing Healthcare at Home
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight"
          >
            The Future of{" "}
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
              Healthcare
            </span>{" "}
            is Here
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-8 leading-relaxed"
          >
            AI-powered, personalized in-home healthcare that adapts to your unique needs. 
            Experience the perfect blend of technology and compassionate care.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            size="lg"
            className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-1 text-lg font-semibold min-h-[44px]"
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

        {/* Floating stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          {[
            { number: "10K+", label: "Families Waiting" },
            { number: "24/7", label: "AI Support" },
            { number: "98%", label: "Care Satisfaction" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
              className="text-center p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg"
            >
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedHero;
