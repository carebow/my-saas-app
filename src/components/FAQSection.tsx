import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How does CareBow's AI-powered care coordination work?",
      answer: "CareBow uses advanced AI to match your family's specific care needs with verified caregivers, monitor health patterns 24/7, and coordinate care plans. Our AI learns from your preferences and medical history to provide increasingly personalized care recommendations while keeping your family informed with regular updates."
    },
    {
      question: "What services does CareBow provide for elder care at home?",
      answer: "We provide comprehensive elder care services including medication management, mobility assistance, personal care, companionship, meal preparation, light housekeeping, and health monitoring. Our caregivers are trained in age-specific care and work with our AI system to ensure consistent, high-quality care that helps seniors maintain independence at home."
    },
    {
      question: "Is CareBow available for pediatric home care needs?",
      answer: "Yes! CareBow specializes in pediatric home care including post-illness recovery, chronic condition management, specialized therapy support, and respite care for families. Our pediatric caregivers are specially trained and background-checked to provide safe, nurturing care for children of all ages."
    },
    {
      question: "How do you ensure the quality and safety of caregivers?",
      answer: "All CareBow caregivers undergo rigorous background checks, professional licensing verification, skills assessments, and ongoing training. Our AI system continuously monitors care quality through family feedback, health outcomes, and caregiver performance metrics to ensure the highest standards of care."
    },
    {
      question: "What areas does CareBow serve, and when will it be available?",
      answer: "CareBow is launching first in Pittsburgh, PA, with plans to expand nationwide. We're currently building our network of caregivers and technology platform. Join our waitlist to be notified when we launch in your area and to secure early access to our services."
    },
    {
      question: "How does CareBow keep families informed about their loved one's care?",
      answer: "Our AI-powered platform provides real-time updates through our family app, including daily care summaries, health monitoring reports, medication tracking, and emergency notifications. Family members receive personalized updates based on their preferences and can communicate directly with caregivers through our secure platform."
    },
    {
      question: "What makes CareBow different from traditional home care agencies?",
      answer: "CareBow combines AI-powered care coordination with human compassion to provide more personalized, efficient, and transparent care. Unlike traditional agencies, we use technology to optimize caregiver matching, predict health needs, provide 24/7 monitoring, and ensure consistent care quality while reducing costs."
    },
    {
      question: "Does CareBow work with insurance or Medicare?",
      answer: "We're working with insurance providers and Medicare to maximize coverage for our services. Many of our care services may be covered under existing home health benefits. Our team will help you understand your coverage options and work with your insurance to minimize out-of-pocket costs."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-carebow-light via-white to-carebow-blue/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-carebow-text-dark mb-6">
            Frequently Asked Questions About{" "}
            <span className="bg-gradient-to-r from-carebow-primary to-carebow-secondary bg-clip-text text-transparent">
              CareBow's In-Home Care
            </span>
          </h2>
          <p className="text-lg text-carebow-text-medium max-w-2xl mx-auto">
            Get answers to common questions about our AI-powered home healthcare services, 
            caregiver qualifications, coverage areas, and how we're transforming family care.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-xl border border-carebow-blue/10 shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="px-6 py-4 text-left font-semibold text-carebow-text-dark hover:text-carebow-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-carebow-text-medium leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-carebow-text-medium mb-4">
            Have more questions about CareBow's home healthcare services?
          </p>
          <a
            href="mailto:info@carebow.com"
            className="inline-flex items-center text-carebow-primary hover:text-carebow-secondary font-medium transition-colors"
          >
            Contact our team at info@carebow.com
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;