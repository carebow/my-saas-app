
'use client'

import { motion } from "framer-motion";

const TechnologyStats = () => {
  const stats = [
    { number: "99.9%", label: "Platform Uptime" },
    { number: "256-bit", label: "SSL Encryption" },
    { number: "<2s", label: "Response Time" },
    { number: "24/7", label: "System Monitoring" }
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
            Built for Reliability
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Our platform is engineered for healthcare-grade performance and security.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center text-white"
            >
              <div className="text-2xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2">{stat.number}</div>
              <div className="text-sm md:text-lg opacity-90">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnologyStats;
