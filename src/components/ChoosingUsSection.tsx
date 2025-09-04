
import { Check, Shield, MessageCircle, Clock, Heart, Zap, Stethoscope, Activity, UserCheck, Pill } from 'lucide-react';
import { motion } from 'framer-motion';

const ChoosingUsSection = () => {
  const reasons = [
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Transparent Pricing & Services",
      description: "No hidden fees, surprise charges, or confusing billing. Know exactly what you're paying for with our clear, upfront pricing model.",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: <MessageCircle className="w-7 h-7" />,
      title: "Direct Communication Hub",
      description: "Secure, HIPAA-compliant messaging with your entire care team. Get answers when you need them, not when it's convenient for others.",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: <Stethoscope className="w-7 h-7" />,
      title: "24/7 Care Availability",
      description: "Health emergencies don't follow business hours. Access our AI-powered triage and emergency care network whenever you need support.",
      gradient: "from-purple-500 to-violet-600"
    },
    {
      icon: <Heart className="w-7 h-7" />,
      title: "Technology with Compassion",
      description: "Advanced AI and automation enhance human care, never replace it. Every interaction is designed to be more personal, not less.",
      gradient: "from-red-500 to-pink-600"
    },
    {
      icon: <Activity className="w-7 h-7" />,
      title: "Proactive Wellness Focus",
      description: "Move beyond sick-care to true healthcare. Our platform focuses on prevention, early intervention, and long-term wellness goals.",
      gradient: "from-purple-500 to-blue-500"
    },
    {
      icon: <UserCheck className="w-7 h-7" />,
      title: "Verified Care Network",
      description: "Every caregiver is thoroughly vetted, licensed, and continuously monitored. Your safety and quality of care are never compromised.",
      gradient: "from-teal-500 to-blue-500"
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
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8">
            Why Families{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Choose CareBow
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Unlike other caregiving platforms that only provide basic matching, CareBow delivers comprehensive AI-powered care coordination with predictive analytics and proactive family communication.
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              variants={itemVariants}
              transition={{ ease: "easeOut" }}
              className="group relative"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 h-full relative overflow-hidden">
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${reason.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
                
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${reason.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {reason.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {reason.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {reason.description}
                </p>
                
                {/* Decorative corner element */}
                <div className="absolute top-6 right-6 w-6 h-6 border-2 border-slate-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`w-full h-full rounded-full bg-gradient-to-r ${reason.gradient} opacity-30`}></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ChoosingUsSection;
