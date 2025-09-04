
import { motion } from "framer-motion";
import { Clock, Stethoscope, DollarSign, Bell, CheckCircle, ArrowRight, Heart, Shield, UserCheck, Activity } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "No More Clinic Queues",
      description: "Skip the waiting rooms and endless phone calls. Get matched with verified caregivers instantly through our intelligent platform.",
      stat: "Average wait time: 15 minutes",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: "Instant Medical Guidance",
      description: "Need a quick second opinion for your child's fever at midnight? Our AI + Teleconsult system provides immediate expert care.",
      stat: "24/7 availability",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Transparent, Affordable Care",
      description: "Avoid expensive hospital bills for routine procedures. Bring qualified, cost-effective care directly to your home.",
      stat: "Save up to 60% on care costs",
      gradient: "from-purple-500 to-violet-600"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Never Miss Medication",
      description: "Smart reminders and remote tracking ensure you or your loved ones never miss important medications or appointments.",
      stat: "99% medication adherence",
      gradient: "from-purple-500 to-blue-600"
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
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7
      }
    }
  };

  return (
    <section id="benefits" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-1/3 h-96 bg-gradient-to-r from-blue-100/50 to-transparent blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-64 bg-gradient-to-l from-purple-100/50 to-transparent blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8">
            How CareBow{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transforms
            </span>{" "}
            Your Daily Life
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Real solutions for everyday health concerns and caregiving challenges, designed to make healthcare simple, accessible, and stress-free.
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              variants={itemVariants}
              transition={{ ease: "easeOut" }}
              className="group relative"
            >
              <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 relative overflow-hidden">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
                
                {/* Number indicator */}
                <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 font-bold text-lg group-hover:text-blue-600 transition-colors">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${benefit.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {benefit.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  {benefit.description}
                </p>
                
                {/* Stat */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm font-medium text-slate-500">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    {benefit.stat}
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="bg-gradient-to-r from-blue-50 via-purple-50/50 to-blue-50 rounded-3xl p-12 lg:p-16 text-center border border-blue-100 shadow-xl"
        >
          <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
            Seamless. Secure. Human.
          </h3>
          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Our mission is to make healthcare accessible, affordable, and personalized for everyone, right at home. Because the best care happens when technology meets compassion.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
