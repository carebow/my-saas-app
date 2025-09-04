
import { motion } from "framer-motion";
import { Stethoscope, Shield, Smartphone, MapPin, Bell, Zap, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const TechnologyStack = () => {
  const technologies = [
    {
      icon: <Stethoscope className="h-8 w-8" />,
      title: "AI-Powered Symptom Checker",
      description: "Advanced machine learning algorithms analyze symptoms and provide instant recommendations for care pathways.",
      features: ["Natural Language Processing", "Medical Knowledge Base", "Risk Assessment", "Care Recommendations"],
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Smart Location Matching",
      description: "Real-time geolocation services connect you with the nearest verified healthcare providers and care centers.",
      features: ["GPS Integration", "Provider Availability", "Distance Optimization", "Traffic Analysis"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070"
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Seamless Mobile Experience",
      description: "Intuitive mobile and web applications designed for patients, families, and healthcare providers.",
      features: ["Cross-Platform Compatibility", "Offline Functionality", "Push Notifications", "Real-time Updates"],
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "Bank-grade security with HIPAA compliance ensuring your health data is always protected.",
      features: ["End-to-End Encryption", "HIPAA Compliance", "Secure Data Storage", "Access Controls"],
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070"
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: "Smart Reminders & Insights",
      description: "Intelligent notification system for medications, appointments, and health tracking.",
      features: ["Medication Alerts", "Appointment Reminders", "Health Trends", "Family Notifications"],
      image: "https://images.unsplash.com/photo-1473091534298-04dcbce3278c?q=80&w=2070"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Real-time Analytics",
      description: "Comprehensive dashboards providing insights into health patterns and care effectiveness.",
      features: ["Health Metrics", "Care Analytics", "Outcome Tracking", "Predictive Insights"],
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070"
    }
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            Our Technology Stack
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Built on modern, scalable infrastructure designed for healthcare excellence.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative h-48">
                    <img 
                      src={tech.image} 
                      alt={tech.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-4 left-4 p-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                      {tech.icon}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 md:p-8 space-y-4 md:space-y-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                      {tech.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                      {tech.description}
                    </p>
                  </div>
                  
                  <div className="space-y-2 md:space-y-3">
                    {tech.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-purple-500 mr-2 md:mr-3 flex-shrink-0" />
                        <span className="text-gray-700 text-sm md:text-base">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnologyStack;
