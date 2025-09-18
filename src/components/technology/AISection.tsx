
'use client'

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const AISection = () => {
  const features = [
    "Predictive health analytics with 95% accuracy",
    "Real-time family communication and alerts",
    "Caregiver matching with advanced AI algorithms",
    "Continuous health pattern analysis and insights",
    "Automated medication reminders and tracking",
    "Emergency detection and instant response coordination"
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              Advanced AI That Goes Beyond Basic Matching
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed">
              Unlike other platforms that only match caregivers to families, our AI provides 
              comprehensive health analytics, predictive insights, and proactive care coordination 
              that keeps families informed and parents safer.
            </p>
            <div className="space-y-3 md:space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-purple-500 mr-2 md:mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm md:text-base">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070"
              alt="AI Technology" 
              className="rounded-2xl shadow-2xl w-full"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-purple-900/20 via-transparent to-transparent"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AISection;
