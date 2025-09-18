
import { Heart, Hospital, Baby, Phone, Brain, Clock, Stethoscope, UserCheck, Shield, Activity, Pill, Thermometer } from 'lucide-react';
// import { motion } from 'framer-motion';

const ServicesSection = () => {
  const services = [
    {
      icon: <Heart className="h-6 w-6 md:h-8 md:w-8 text-white" />,
      title: "Elder Care at Home",
      description: "Compassionate caregivers for companionship, hygiene, medication, and mobility support with 24/7 monitoring.",
      gradient: "from-red-500 to-pink-600",
      features: ["Medication Management", "Mobility Assistance", "Companionship", "Health Monitoring"]
    },
    {
      icon: <Hospital className="h-6 w-6 md:h-8 md:w-8 text-white" />,
      title: "Post-Surgery Recovery",
      description: "Skilled nursing, wound care, and therapy services delivered safely in your home environment.",
      gradient: "from-blue-500 to-cyan-600",
      features: ["Wound Care", "Physical Therapy", "Medication Administration", "Recovery Monitoring"]
    },
    {
      icon: <Baby className="h-6 w-6 md:h-8 md:w-8 text-white" />,
      title: "Pediatric Home Care",
      description: "Specialized child-friendly health services with trained pediatric healthcare professionals.",
      gradient: "from-green-500 to-emerald-600",
      features: ["Child-Safe Protocols", "Pediatric Specialists", "Family Education", "Growth Monitoring"]
    },
    {
      icon: <Stethoscope className="h-6 w-6 md:h-8 md:w-8 text-white" />,
      title: "AI Teleconsult",
      description: "Instant AI-backed health assessments plus immediate access to certified medical professionals.",
      gradient: "from-purple-500 to-violet-600",
      features: ["AI Symptom Analysis", "Doctor Consultations", "Prescription Management", "Health Records"]
    },
    {
      icon: <Activity className="h-6 w-6 md:h-8 md:w-8 text-white" />,
      title: "Urgent Care",
      description: "Rapid-response home visits and online consultations for acute health concerns and emergencies.",
      gradient: "from-purple-500 to-blue-600",
      features: ["24/7 Availability", "Emergency Response", "Rapid Diagnosis", "Immediate Treatment"]
    },
    {
      icon: <Shield className="h-6 w-6 md:h-8 md:w-8 text-white" />,
      title: "Wellness & Prevention",
      description: "Proactive health guidance, natural treatments, and lifestyle coaching for optimal wellbeing.",
      gradient: "from-teal-500 to-green-600",
      features: ["Health Coaching", "Nutrition Guidance", "Fitness Planning", "Preventive Care"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="services" className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/30 via-transparent to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 md:mb-6 lg:mb-8 px-4 sm:px-0">
            Comprehensive{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Healthcare Services
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
            From emergency care to wellness coaching, we provide a complete spectrum of healthcare services delivered with precision and compassion.
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              transition={{ ease: "easeOut" }}
              className="group relative"
            >
              <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 h-full relative overflow-hidden mx-2 sm:mx-0">
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl md:rounded-3xl`}></div>
                
                {/* Icon */}
                <div className={`inline-flex p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-r ${service.gradient} text-white mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {service.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-3 md:mb-4 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-4 md:mb-6 text-sm md:text-base">
                  {service.description}
                </p>
                
                {/* Features */}
                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-xs md:text-sm text-slate-500">
                      <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r ${service.gradient} mr-2 md:mr-3 flex-shrink-0`}></div>
                      <span className="leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* Decorative corner */}
                <div className="absolute top-4 md:top-6 right-4 md:right-6 w-6 h-6 md:w-8 md:h-8 border-2 border-slate-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`w-full h-full rounded-full bg-gradient-to-r ${service.gradient} opacity-20`}></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
