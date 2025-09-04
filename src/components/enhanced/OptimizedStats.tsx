
import React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface StatProps {
  number: string;
  label: string;
  suffix?: string;
  delay?: number;
}

const OptimizedStat = ({ number, label, suffix = "", delay = 0 }: StatProps) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();
  const [count, setCount] = React.useState(0);
  
  const targetNumber = parseInt(number.replace(/[^\d]/g, ''));
  
  React.useEffect(() => {
    if (isInView && targetNumber && !shouldReduceMotion) {
      let start = 0;
      const increment = targetNumber / 30; // Reduced iterations for performance
      const timer = setInterval(() => {
        start += increment;
        if (start >= targetNumber) {
          setCount(targetNumber);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 50);
      
      return () => clearInterval(timer);
    } else if (isInView) {
      // For reduced motion, show final number immediately
      setCount(targetNumber);
    }
  }, [isInView, targetNumber, shouldReduceMotion]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: shouldReduceMotion ? 0.1 : 0.4, 
        delay: shouldReduceMotion ? 0 : delay
      }}
      className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl hover:border-purple-200 transition-all duration-300"
    >
      <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
        {targetNumber ? `${count.toLocaleString()}${suffix}` : number}
      </div>
      <div className="text-sm font-medium text-slate-600">{label}</div>
    </motion.div>
  );
};

const OptimizedStats = () => {
  const shouldReduceMotion = useReducedMotion();
  
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
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.6 }}
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
            <OptimizedStat
              key={stat.label}
              {...stat}
              delay={shouldReduceMotion ? 0 : index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OptimizedStats;
