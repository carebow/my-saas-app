import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What services does CareBow offer?",
      answer: "CareBow offers comprehensive in-home healthcare services including 24/7 monitoring, personalized care plans, licensed caregiver matching, medication management, emergency response, medical consultations, and family communication tools."
    },
    {
      question: "How does the caregiver matching process work?",
      answer: "Our AI-powered system analyzes your parent's specific health needs, preferences, and care requirements to match them with verified, licensed caregivers who specialize in their conditions. We consider factors like experience, location, availability, and personality compatibility."
    },
    {
      question: "Is CareBow covered by insurance?",
      answer: "We're working with major insurance providers to make our services accessible. Currently, we accept private pay and are exploring Medicare Advantage partnerships. Our team can help you understand your coverage options and coordinate with your insurance provider."
    },
    {
      question: "What makes CareBow different from other home care services?",
      answer: "CareBow combines traditional home care with advanced technology, AI-powered health monitoring, and a medical advisory board. We provide 24/7 oversight, predictive health analytics, and comprehensive family communication tools that other services don't offer."
    },
    {
      question: "How do I get started with CareBow?",
      answer: "Getting started is simple. Contact us for a free consultation where we'll assess your parent's needs, create a personalized care plan, and match you with the right caregiver. The entire process typically takes less than a week."
    },
    {
      question: "What if I'm not satisfied with the care?",
      answer: "We offer a 100% satisfaction guarantee. If you're not completely satisfied with your caregiver or services, we'll work with you to find a better match or provide a full refund. Your family's peace of mind is our top priority."
    },
    {
      question: "How does the 24/7 monitoring work?",
      answer: "Our monitoring system uses advanced sensors, wearable devices, and AI analytics to track your parent's health status, medication adherence, and daily activities. Any concerning changes trigger immediate alerts to our medical team and family members."
    },
    {
      question: "Can family members stay involved in the care process?",
      answer: "Absolutely! We believe family involvement is crucial for quality care. Our platform includes family communication tools, regular updates, care plan reviews, and direct communication with caregivers and medical staff."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-carebow-text-dark mb-6">
            Frequently Asked Questions About CareBow's In-Home Care
          </h2>
          <p className="text-xl text-carebow-text-medium max-w-3xl mx-auto">
            Get answers to the most common questions about our comprehensive home care services
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl border border-carebow-primary-200 shadow-lg hover:shadow-xl transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-carebow-primary-50 transition-colors rounded-xl"
              >
                <h3 className="text-lg font-semibold text-carebow-text-dark pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-carebow-primary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-carebow-primary" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-6"
                >
                  <p className="text-carebow-text-medium leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-carebow-primary-50 rounded-2xl p-8 border border-carebow-primary-200">
            <h3 className="text-2xl font-bold text-carebow-text-dark mb-4">
              Still have questions?
            </h3>
            <p className="text-carebow-text-medium mb-6">
              Our care coordinators are here to help you understand how CareBow can support your family.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+1-800-CAREBOW"
                className="inline-flex items-center justify-center px-6 py-3 bg-carebow-primary text-white rounded-xl font-semibold hover:bg-carebow-primary-700 transition-colors"
              >
                Call (800) CAREBOW
              </a>
              <a
                href="mailto:info@carebow.com"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-carebow-primary text-carebow-primary rounded-xl font-semibold hover:bg-carebow-primary-50 transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;