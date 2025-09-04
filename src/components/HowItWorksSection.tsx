import { motion } from "framer-motion";
import { FileText, Users, Activity, Smartphone } from "lucide-react";
import caregiverImage from "@/assets/caregiver-elderly-care.jpg";
import appDashboardImage from "@/assets/app-family-dashboard.jpg";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      icon: FileText,
      title: "Tell Us About Your Parents",
      description: "Quick 5-minute family assessment covering health needs, preferences, and care requirements.",
      details: "Medical history, daily routines, emergency contacts"
    },
    {
      number: "02", 
      icon: Users,
      title: "We Match You with Local Caregivers",
      description: "AI-powered matching with verified professionals in your area who specialize in your parents' specific needs.",
      details: "Background checked, licensed, insured"
    },
    {
      number: "03",
      icon: Activity,
      title: "24/7 AI-Powered Monitoring",
      description: "Intelligent health analytics with predictive insights, medication reminders, and automated family alerts for any concerns.",
      details: "AI health pattern analysis, wearable devices, smart sensors"
    },
    {
      number: "04",
      icon: Smartphone,
      title: "Stay Connected & Informed",
      description: "Mobile app with family dashboard showing daily updates, photos, and direct communication with caregivers.",
      details: "Daily reports, video calls, care plan updates"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-carebow-neutral/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-carebow-text-dark mb-6">
            How CareBow Works for{" "}
            <span className="bg-gradient-to-r from-carebow-primary to-carebow-secondary bg-clip-text text-transparent">
              Your Family
            </span>
          </h2>
          <p className="text-xl text-carebow-text-medium max-w-3xl mx-auto">
            Simple steps to give your parents the care they deserve while giving you peace of mind
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-carebow-primary to-carebow-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {step.number}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <step.icon className="w-6 h-6 text-carebow-primary" />
                      <h3 className="text-2xl font-bold text-carebow-text-dark">
                        {step.title}
                      </h3>
                    </div>
                    
                    <p className="text-lg text-carebow-text-medium mb-4 leading-relaxed">
                      {step.description}
                    </p>
                    
                    <div className="inline-flex items-center gap-2 bg-carebow-blue/20 text-carebow-primary px-4 py-2 rounded-full text-sm font-medium">
                      <span>Includes:</span>
                      <span>{step.details}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual */}
              <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                <div className="relative">
                  {index === 1 && (
                    <div className="rounded-2xl overflow-hidden shadow-2xl">
                      <img
                        src={caregiverImage}
                        alt="Professional caregiver helping elderly patient"
                        className="w-full h-80 object-cover"
                      />
                    </div>
                  )}
                  
                  {index === 3 && (
                    <div className="flex justify-center">
                      <img
                        src={appDashboardImage}
                        alt="CareBow family dashboard app"
                        className="max-w-xs h-80 object-cover rounded-2xl shadow-2xl"
                      />
                    </div>
                  )}
                  
                  {(index === 0 || index === 2) && (
                    <div className="bg-gradient-to-br from-carebow-blue to-carebow-mint rounded-2xl p-8 h-80 flex items-center justify-center">
                      <step.icon className="w-24 h-24 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-carebow-blue/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-carebow-text-dark mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-carebow-text-medium mb-6">
              Join thousands of families who trust CareBow to keep their parents safe and independent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <span className="text-sm text-carebow-secondary font-medium">
                ⏰ Setup takes less than 10 minutes
              </span>
              <span className="text-sm text-carebow-secondary font-medium">
                📞 24/7 family support included
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;