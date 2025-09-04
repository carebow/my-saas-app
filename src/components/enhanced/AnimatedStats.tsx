
import React from "react";
import { motion, useInView } from "framer-motion";

interface StatProps {
  number: string;
  label: string;
  suffix?: string;
  delay?: number;
}

const AnimatedStat = ({ number, label, suffix = "", delay = 0 }: StatProps) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = React.useState(0);
  
  const targetNumber = parseInt(number.replace(/[^\d]/g, ''));
  
  React.useEffect(() => {
    if (isInView && targetNumber) {
      let start = 0;
      const increment = targetNumber / 50;
      const timer = setInterval(() => {
        start += increment;
        if (start >= targetNumber) {
          setCount(targetNumber);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 30);
      
      return () => clearInterval(timer);
    }
  }, [isInView, targetNumber]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl hover:border-purple-200 transition-all duration-300"
    >
      <motion.div
        className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2"
        animate={isInView ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, delay: delay + 0.3 }}
      >
        {targetNumber ? `${count.toLocaleString()}${suffix}` : number}
      </motion.div>
      <div className="text-sm font-medium text-slate-600">{label}</div>
    </motion.div>
  );
};

const AnimatedStats = () => {
  const stats = [
    { number: "10000", label: "Families on Waitlist", suffix: "+" },
    { number: "24/7", label: "AI-Powered Support" },
    { number: "98", label: "Satisfaction Rate", suffix: "%" },
    { number: "150", label: "Healthcare Partners", suffix: "+" },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Join the growing community of families experiencing better healthcare at home
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <AnimatedStat
              key={stat.label}
              {...stat}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedStats;
