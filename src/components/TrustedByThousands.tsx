import { motion } from "framer-motion";
import { Users, Clock, Heart, Shield } from "lucide-react";

const TrustedByThousands = () => {
  const stats = [
    {
      number: "10,000+",
      label: "Families",
      icon: Users,
      description: "Trust CareBow for their loved ones' care"
    },
    {
      number: "24/7",
      label: "Support",
      icon: Clock,
      description: "Round-the-clock monitoring and assistance"
    },
    {
      number: "98%",
      label: "Satisfaction",
      icon: Heart,
      description: "Customer satisfaction rate"
    },
    {
      number: "150+",
      label: "Caregivers",
      icon: Shield,
      description: "Licensed and verified professionals"
    }
  ];

  return (
    <section className="py-20 bg-carebow-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-carebow-primary-100 max-w-3xl mx-auto">
            Join thousands of families who have found peace of mind with CareBow's comprehensive care services
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 transition-colors">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              
              {/* Number */}
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                {stat.number}
              </div>
              
              {/* Label */}
              <div className="text-lg font-semibold text-white mb-2">
                {stat.label}
              </div>
              
              {/* Description */}
              <div className="text-carebow-primary-100 text-sm">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
};

export default TrustedByThousands;
