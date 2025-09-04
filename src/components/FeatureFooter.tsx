
import { Button } from "@/components/ui/button";
import { HeartPulse, UsersRound, Bot, Clock, ArrowRight, Stethoscope, UserCheck, Activity } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "What We're Building",
    icon: <Stethoscope className="w-7 h-7" />,
    desc: "A tech-enabled care platform bridging families & healthcare pros—easy, smart, trusted.",
    gradient: "from-blue-500 to-purple-600"
  },
  {
    title: "Our Services",
    icon: <UsersRound className="w-7 h-7" />,
    desc: "Home visits, urgent care, AI symptom checker, teleconsults, therapy, and more.",
    gradient: "from-blue-600 to-indigo-600"
  },
  {
    title: "Our Technology",
    icon: <HeartPulse className="w-7 h-7" />,
    desc: "Smart matching, real-time dashboards, geo-tracking, care AI, and seamless automation.",
    gradient: "from-purple-500 to-indigo-600"
  },
  {
    title: "Life Benefits",
    icon: <Clock className="w-7 h-7" />,
    desc: "Faster care, personalized suggestions, full transparency, and peace of mind—daily.",
    gradient: "from-indigo-500 to-purple-600"
  },
];

const FeatureFooter = () => {
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
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Clean background decoration */}
      <div className="absolute inset-0 bg-white"></div>
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-to-r from-blue-50/30 to-purple-50/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-purple-50/30 to-blue-50/30 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Why CareBow is{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Different
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We're not just another healthcare platform. We're reimagining how care is delivered with cutting-edge technology and human compassion.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              transition={{ ease: "easeOut" }}
              className="group relative"
            >
              <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 h-full">
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>
                
                {/* Hover arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-5 h-5 text-blue-500" />
                </div>
                
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="text-center"
        >
          <Button
            size="lg"
            className="h-16 px-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg font-semibold group"
            onClick={scrollToWaitlist}
          >
            Join Our Waitlist
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureFooter;
