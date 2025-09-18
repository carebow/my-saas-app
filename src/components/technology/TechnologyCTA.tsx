
'use client'

import { motion } from "framer-motion";
import { Button } from "../ui/button";

const TechnologyCTA = () => {
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
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6 md:space-y-8"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Experience the Future of Healthcare
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            See how our technology can transform your family's healthcare experience. 
            Book a demo to explore our platform firsthand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12 md:h-14 px-6 md:px-8 text-sm md:text-base"
              asChild
            >
              <a href="https://cal.com/carebow/30min" target="_blank" rel="noopener noreferrer">
                Book Demo Walkthrough
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50 h-12 md:h-14 px-6 md:px-8 text-sm md:text-base"
              onClick={scrollToWaitlist}
            >
              Join Waitlist
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechnologyCTA;
