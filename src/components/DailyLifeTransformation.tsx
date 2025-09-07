import { motion } from "framer-motion";
import { 
  CheckCircle, 
  Heart, 
  Shield, 
  Clock, 
  Users, 
  Home,
  ArrowRight
} from "lucide-react";

const DailyLifeTransformation = () => {
  const transformations = [
    {
      icon: CheckCircle,
      title: "No More Guess-Questions",
      description: "Get clear, professional answers about your parent's health and care needs from medical experts.",
      color: "carebow-green"
    },
    {
      icon: Heart,
      title: "Peace of Mind",
      description: "Sleep better knowing your parent is safe, monitored, and receiving professional care 24/7.",
      color: "carebow-red"
    },
    {
      icon: Shield,
      title: "Professional Care",
      description: "Licensed caregivers provide expert care tailored to your parent's specific health conditions.",
      color: "carebow-primary"
    },
    {
      icon: Clock,
      title: "Time for Family",
      description: "Spend quality time with your parent instead of worrying about their daily care needs.",
      color: "carebow-orange"
    },
    {
      icon: Users,
      title: "Family Coordination",
      description: "Keep all family members informed and involved in your parent's care journey.",
      color: "carebow-blue"
    },
    {
      icon: Home,
      title: "Safe Independence",
      description: "Your parent can maintain their independence while staying safe in their own home.",
      color: "carebow-green"
    }
  ];

  const getIconBgColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'carebow-red': 'bg-carebow-red/20',
      'carebow-primary': 'bg-carebow-primary-100',
      'carebow-green': 'bg-carebow-green/20',
      'carebow-orange': 'bg-carebow-orange/20',
      'carebow-blue': 'bg-carebow-blue/20'
    };
    return colorMap[color] || 'bg-carebow-primary-100';
  };

  const getIconColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'carebow-red': 'text-carebow-red',
      'carebow-primary': 'text-carebow-primary',
      'carebow-green': 'text-carebow-green',
      'carebow-orange': 'text-carebow-orange',
      'carebow-blue': 'text-carebow-blue'
    };
    return colorMap[color] || 'text-carebow-primary';
  };

  return (
    <section className="py-20 bg-carebow-bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-carebow-text-dark mb-6">
            How CareBow Transforms Your Daily Life
          </h2>
          <p className="text-xl text-carebow-text-medium max-w-3xl mx-auto">
            Experience the peace of mind that comes with knowing your parent is safe, cared for, and thriving at home
          </p>
        </motion.div>

        {/* 2x3 Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {transformations.map((transformation, index) => (
            <motion.div
              key={transformation.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-8 shadow-lg border border-carebow-primary-200 hover:shadow-xl transition-shadow group"
            >
              {/* Icon */}
              <div className={`w-16 h-16 ${getIconBgColor(transformation.color)} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <transformation.icon className={`w-8 h-8 ${getIconColor(transformation.color)}`} />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-carebow-text-dark mb-4">
                {transformation.title}
              </h3>
              
              <p className="text-carebow-text-medium mb-6 leading-relaxed">
                {transformation.description}
              </p>
              
              {/* Learn More Link */}
              <a 
                href="#" 
                className="inline-flex items-center text-carebow-primary hover:text-carebow-primary-700 font-medium group-hover:gap-2 transition-all duration-300"
              >
                Learn More
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-carebow-primary-50 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-carebow-primary-100 rounded-full blur-3xl opacity-20" />
        </div>
      </div>
    </section>
  );
};

export default DailyLifeTransformation;
