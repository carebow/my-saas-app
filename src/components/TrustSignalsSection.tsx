import { motion } from "framer-motion";
import { Shield, Award, Clock, Users, CheckCircle, Star, Stethoscope, UserCheck, Heart, Activity } from "lucide-react";

const TrustSignalsSection = () => {
  const credentials = [
    {
      icon: Shield,
      title: "White-Glove Service",
      description: "Dedicated care coordinators who understand your family's unique needs and provide personalized attention every step of the way."
    },
    {
      icon: Award,
      title: "Licensed Professionals",
      description: "All our caregivers are background-checked, licensed, and insured professionals with specialized training in elder care."
    },
    {
      icon: Stethoscope,
      title: "Medical Expertise",
      description: "Our team includes board-certified physicians and registered nurses who oversee every aspect of your parent's care."
    },
    {
      icon: UserCheck,
      title: "Family-Centered Care",
      description: "We keep you informed and involved in every decision, ensuring your parent's care aligns with your family's values and preferences."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-carebow-text-dark mb-6">
              Trusted by Families{" "}
              <span className="text-carebow-primary">
                Nationwide
              </span>
            </h2>
            <p className="text-xl text-carebow-text-medium max-w-3xl mx-auto">
              Healthcare-grade security and medical expertise you can count on
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {credentials.map((credential, index) => (
              <motion.div
                key={credential.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-lg border border-carebow-primary-200 text-center hover:shadow-xl transition-shadow group"
              >
                <div className="w-16 h-16 bg-carebow-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-carebow-primary-200 transition-colors">
                  <credential.icon className="w-8 h-8 text-carebow-primary" />
                </div>
                <h3 className="text-xl font-bold text-carebow-text-dark mb-4">
                  {credential.title}
                </h3>
                <p className="text-carebow-text-medium leading-relaxed">
                  {credential.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default TrustSignalsSection;