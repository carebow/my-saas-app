import { motion } from "framer-motion";
import { 
  Clock, 
  Heart, 
  Activity, 
  Pill, 
  Stethoscope, 
  Shield, 
  Users, 
  Home, 
  Phone,
  ArrowRight
} from "lucide-react";

const ComprehensiveHealthcareServices = () => {
  const services = [
    {
      icon: Clock,
      title: "24/7 Monitoring",
      description: "Round-the-clock health monitoring with instant alerts for any changes in your parent's condition.",
      color: "carebow-red"
    },
    {
      icon: Heart,
      title: "Personalized Care Plans",
      description: "Customized care plans tailored to your parent's specific health needs and daily routines.",
      color: "carebow-primary"
    },
    {
      icon: Activity,
      title: "Health Analytics",
      description: "Advanced AI-powered analytics that track health trends and predict potential issues.",
      color: "carebow-green"
    },
    {
      icon: Pill,
      title: "Medication Management",
      description: "Professional medication management with reminders, tracking, and coordination with doctors.",
      color: "carebow-orange"
    },
    {
      icon: Stethoscope,
      title: "Medical Consultations",
      description: "On-demand virtual consultations with licensed physicians and specialists.",
      color: "carebow-blue"
    },
    {
      icon: Shield,
      title: "Emergency Response",
      description: "Immediate emergency response system with direct connection to medical professionals.",
      color: "carebow-primary"
    },
    {
      icon: Users,
      title: "Caregiver Matching",
      description: "AI-powered matching with verified caregivers who specialize in your parent's needs.",
      color: "carebow-green"
    },
    {
      icon: Home,
      title: "Home Safety Assessment",
      description: "Comprehensive home safety evaluations and modifications to prevent accidents.",
      color: "carebow-orange"
    },
    {
      icon: Phone,
      title: "Family Communication",
      description: "Regular updates and communication channels to keep family members informed.",
      color: "carebow-blue"
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-carebow-text-dark mb-6">
            Comprehensive Healthcare Services
          </h2>
          <p className="text-xl text-carebow-text-medium max-w-3xl mx-auto">
            Everything your parent needs for safe, comfortable aging at home, all in one comprehensive care package
          </p>
        </motion.div>

        {/* 3x3 Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-8 shadow-lg border border-carebow-primary-200 hover:shadow-xl transition-shadow group"
            >
              {/* Icon */}
              <div className={`w-16 h-16 ${getIconBgColor(service.color)} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <service.icon className={`w-8 h-8 ${getIconColor(service.color)}`} />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-carebow-text-dark mb-4">
                {service.title}
              </h3>
              
              <p className="text-carebow-text-medium mb-6 leading-relaxed">
                {service.description}
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
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-carebow-primary-50 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-carebow-primary-100 rounded-full blur-3xl opacity-20" />
        </div>
      </div>
    </section>
  );
};

export default ComprehensiveHealthcareServices;
