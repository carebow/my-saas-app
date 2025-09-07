import { motion } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ComparisonTable = () => {
  const features = [
    "24/7 Monitoring",
    "Personalized Care Plans",
    "Licensed Caregivers",
    "Medical Advisory Board",
    "Family Communication",
    "Emergency Response",
    "Medication Management",
    "Home Safety Assessment",
    "AI Health Analytics",
    "Insurance Coordination"
  ];

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
            CareBow vs. Other Platforms
          </h2>
          <p className="text-xl text-carebow-text-medium max-w-3xl mx-auto">
            See how CareBow's comprehensive approach compares to traditional home care services
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-carebow-primary-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-carebow-primary-50">
                  <th className="px-6 py-4 text-left text-lg font-bold text-carebow-text-dark">
                    Features
                  </th>
                  <th className="px-6 py-4 text-center text-lg font-bold text-carebow-primary">
                    CareBow
                  </th>
                  <th className="px-6 py-4 text-center text-lg font-bold text-carebow-text-medium">
                    Other Platforms
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <motion.tr
                    key={feature}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className={`border-b border-carebow-primary-100 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-carebow-bg-light'
                    }`}
                  >
                    <td className="px-6 py-4 text-carebow-text-dark font-medium">
                      {feature}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-6 h-6 bg-carebow-primary rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        {index < 3 ? (
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-gray-600" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                            <X className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            className="bg-carebow-primary hover:bg-carebow-primary-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            See Full Comparison
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonTable;
