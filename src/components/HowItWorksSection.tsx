import { motion } from "framer-motion";
import { Heart, Users, Shield, ArrowRight } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Heart,
      title: "Personalized Care Plans",
      description: "We create customized care plans tailored to your parent's specific health needs, preferences, and daily routines.",
      learnMore: "Learn More"
    },
    {
      icon: Users,
      title: "Expert Caregiver Matching",
      description: "Our AI matches you with verified, experienced caregivers who specialize in your parent's specific conditions and care requirements.",
      learnMore: "Learn More"
    },
    {
      icon: Shield,
      title: "24/7 Health Monitoring",
      description: "Advanced monitoring technology keeps track of your parent's health status and alerts you to any changes or concerns immediately.",
      learnMore: "Learn More"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-carebow-bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-carebow-text-dark mb-6">
            How CareBow Works for Your Family
          </h2>
          <p className="text-xl text-carebow-text-medium max-w-3xl mx-auto">
            Three simple steps to give your parents the care they deserve while giving you complete peace of mind
          </p>
        </motion.div>

        {/* Three column layout */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="text-center group"
            >
              {/* Icon */}
              <div className="w-20 h-20 bg-carebow-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-carebow-primary-200 transition-colors duration-300">
                <step.icon className="w-10 h-10 text-carebow-primary" />
              </div>
              
              {/* Content */}
              <h3 className="text-2xl font-bold text-carebow-text-dark mb-4">
                {step.title}
              </h3>
              
              <p className="text-lg text-carebow-text-medium mb-6 leading-relaxed">
                {step.description}
              </p>
              
              {/* Learn More Link */}
              <a 
                href="#" 
                className="inline-flex items-center text-carebow-primary hover:text-carebow-primary-700 font-medium group-hover:gap-2 transition-all duration-300"
              >
                {step.learnMore}
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-carebow-primary-50 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-carebow-primary-100 rounded-full blur-3xl opacity-20" />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;