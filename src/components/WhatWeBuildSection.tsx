
import { motion } from "framer-motion";
import { Heart, Shield, Zap, Users, Brain, Clock, Stethoscope, Activity, UserCheck, Pill, Thermometer, Smartphone } from "lucide-react";
import AnimatedFeatureCard from "./enhanced/AnimatedFeatureCard";

const WhatWeBuildSection = () => {
  const features = [
    {
      icon: Heart,
      title: "Personalized Care Plans",
      description: "AI-driven care plans tailored to your unique health profile, family dynamics, and lifestyle preferences.",
      gradient: "bg-gradient-to-br from-pink-500 to-rose-500",
    },
    {
      icon: Shield,
      title: "HIPAA-Compliant Security",
      description: "Enterprise-grade security protecting your health data with end-to-end encryption and compliance standards.",
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
    },
    {
      icon: Activity,
      title: "Real-Time Monitoring",
      description: "Continuous health monitoring with instant alerts and proactive interventions when you need them most.",
      gradient: "bg-gradient-to-br from-purple-500 to-blue-500",
    },
    {
      icon: UserCheck,
      title: "Family Coordination",
      description: "Seamless communication tools connecting patients, families, and healthcare providers in one platform.",
      gradient: "bg-gradient-to-br from-green-500 to-emerald-500",
    },
    {
      icon: Stethoscope,
      title: "AI Health Assistant",
      description: "Intelligent assistant providing 24/7 health guidance, medication reminders, and emergency support.",
      gradient: "bg-gradient-to-br from-purple-500 to-violet-500",
    },
    {
      icon: Smartphone,
      title: "Flexible Scheduling",
      description: "Easy appointment booking with healthcare providers that fits your schedule and preferences.",
      gradient: "bg-gradient-to-br from-indigo-500 to-blue-500",
    },
  ];

  return (
    <section className="py-20 sm:py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-purple-100/20 to-blue-100/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center mb-16 sm:mb-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Heart className="w-4 h-4" />
            What We're Building
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 sm:mb-8">
            Healthcare Technology
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Built for Families
            </span>
          </h3>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
            We're creating the most comprehensive in-home healthcare platform that combines cutting-edge AI 
            with human compassion to deliver personalized care experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <AnimatedFeatureCard
              key={feature.title}
              {...feature}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center mt-16 sm:mt-20"
        >
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Ready to experience the future of healthcare? Join thousands of families already on our waitlist.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 font-semibold text-lg min-h-[44px]"
          >
            Join the Waitlist Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatWeBuildSection;
