
import { motion } from "framer-motion";
import { Smartphone, Truck, Building2, Watch } from "lucide-react";

const ComingSoonSection = () => {
  const comingSoon = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile Apps",
      subtitle: "iOS + Android",
      description: "Native mobile experience for seamless care on-the-go",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Pharmacy Delivery",
      subtitle: "Same-day delivery",
      description: "Prescription medications delivered directly to your door",
      gradient: "from-green-500 to-blue-500"
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Care Center Network",
      subtitle: "20+ partnerships",
      description: "Expanded network of certified home care centers nationwide",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Watch className="w-8 h-8" />,
      title: "Wearable Integration",
      subtitle: "Health monitoring",
      description: "Seamless integration with popular health wearables and devices",
      gradient: "from-purple-500 to-blue-500"
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
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-100/30 via-transparent to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8">
            What's{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Coming Next
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            We're constantly innovating to bring you the most comprehensive and advanced healthcare experience possible. Here's what's on the horizon.
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {comingSoon.map((item, index) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              transition={{ ease: "easeOut" }}
              className="group relative"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 text-center h-full relative overflow-hidden">
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
                
                {/* Icon */}
                <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-r ${item.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl mx-auto`}>
                  {item.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <div className="text-sm font-medium text-blue-600 mb-4">
                  {item.subtitle}
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {item.description}
                </p>
                
                {/* Coming soon badge */}
                <div className="absolute top-4 right-4 bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-full">
                  Coming Soon
                </div>
                
                {/* Progress indicator */}
                <div className="mt-6 w-full bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full bg-gradient-to-r ${item.gradient}`} style={{ width: `${Math.random() * 40 + 60}%` }}></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Newsletter signup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-20 bg-gradient-to-r from-blue-50 via-purple-50/50 to-blue-50 rounded-3xl p-12 text-center border border-blue-100 shadow-xl"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Be the First to Know
          </h3>
          <p className="text-slate-600 mb-6">
            Get notified when these exciting features launch and gain early access to new capabilities.
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-blue-100 border border-blue-200 rounded-full text-blue-700 font-medium">
            📧 Updates delivered via our waitlist
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComingSoonSection;
