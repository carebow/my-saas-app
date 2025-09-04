
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AnimatedFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
}

const AnimatedFeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  gradient, 
  delay = 0 
}: AnimatedFeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="group relative"
    >
      <div className="relative p-8 bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-2xl hover:border-purple-200 transition-all duration-500 overflow-hidden">
        {/* Animated gradient background */}
        <motion.div
          className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${gradient}`}
          initial={{ scale: 0, rotate: 45 }}
          whileHover={{ scale: 1.5, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        
        {/* Icon with animated background */}
        <motion.div
          className="relative mb-6"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`w-16 h-16 ${gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        <motion.h3
          className="text-xl font-bold text-slate-900 mb-3 group-hover:text-purple-700 transition-colors duration-300"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h3>
        
        <motion.p
          className="text-slate-600 leading-relaxed"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {description}
        </motion.p>

        {/* Subtle animation indicator */}
        <motion.div
          className="absolute bottom-4 right-4 w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-20"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.div>
  );
};

export default AnimatedFeatureCard;
