
import { Shield, Smartphone, MapPin, Bell, Stethoscope, Check } from 'lucide-react';
// import { motion } from 'framer-motion';

const TechnologySection = () => {
  const technologies = [
    {
      icon: <Stethoscope className="h-6 w-6" />,
      title: "AI Symptom Checker",
      description: "Instantly suggest remedies, bookings, or teleconsults based on symptoms."
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Location-Based Matching",
      description: "Show nearby trusted care centers or caregivers with real-time availability."
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "User App & Admin CMS",
      description: "Smooth booking, chat, and real-time updates through our intuitive interfaces."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Compliant",
      description: "Data privacy, EVV (Electronic Visit Verification), and patient records protection."
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "Insights & Reminders",
      description: "Automated medication alerts, visit tracking, and health habit nudges."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="technology" className="py-16 md:py-24 bg-gradient-to-b from-white to-carebow-blue/5 overflow-hidden">
      <div className="section-container relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Premium decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-carebow-blue/10 rounded-full blur-3xl opacity-60 -z-10 animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-carebow-mint/20 rounded-full blur-3xl opacity-60 -z-10 animate-[pulse_10s_ease-in-out_infinite]"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-carebow-text-dark mb-4 md:mb-6 leading-tight">
            Cutting-Edge Technology <span className="text-carebow-primary">Powering</span> Healthcare
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-carebow-text-medium max-w-2xl mx-auto">
            Behind our compassionate care is powerful technology that ensures quality, safety, and seamless experiences for patients and providers alike.
          </p>
        </motion.div>
        
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
          {/* Feature Image */}
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:w-1/2"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-carebow-blue/70 via-carebow-primary/40 to-carebow-mint/70 opacity-30 blur-3xl rounded-3xl"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070" 
                  alt="Modern laptop computer showcasing healthcare technology innovation" 
                  className="w-full h-[400px] md:h-[500px] object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-carebow-primary/40 via-transparent to-transparent"></div>
                
                {/* Floating badges */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="absolute top-6 md:top-8 left-6 md:left-8 bg-white/90 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full shadow-lg"
                >
                  <p className="font-medium text-carebow-primary flex items-center text-sm md:text-base">
                    <Check size={16} className="mr-1" /> HIPAA Compliant
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="absolute bottom-6 md:bottom-8 right-6 md:right-8 bg-white/90 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full shadow-lg"
                >
                  <p className="font-medium text-carebow-accent flex items-center text-sm md:text-base">
                    <Check size={16} className="mr-1" /> AI-Powered
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          {/* Features List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <ul className="space-y-6 md:space-y-8">
              {technologies.map((tech, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  transition={{ ease: "easeOut" }}
                  className="flex group"
                >
                  <div className="mr-4 md:mr-5 bg-gradient-to-br from-carebow-primary to-carebow-blue p-[1px] rounded-full flex-shrink-0">
                    <div className="bg-white rounded-full p-2.5 md:p-3.5 text-carebow-primary group-hover:scale-110 transition-transform duration-300 shadow-md">
                      {tech.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg md:text-xl text-carebow-text-dark mb-1 md:mb-2 group-hover:text-carebow-primary transition-colors">
                      {tech.title}
                    </h3>
                    <p className="text-carebow-text-medium text-sm md:text-lg leading-relaxed">{tech.description}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom gradient shape */}
        <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-carebow-primary/30 to-transparent"></div>
      </div>
    </section>
  );
};

export default TechnologySection;
