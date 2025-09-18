'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Shield,
  Brain,
  Heart,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  Users,
  Globe
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  icon: React.ReactNode;
}

const faqData: FAQItem[] = [
  {
    question: "What is CareBow and how does it work?",
    answer: "CareBow is an AI-powered healthcare platform that combines modern medicine with traditional healing wisdom. Our AI assistant analyzes your symptoms, provides personalized health insights, and connects you with appropriate care resources. Simply describe your symptoms, answer follow-up questions, and receive comprehensive health guidance tailored to your needs.",
    category: "General",
    icon: <Brain className="h-5 w-5 text-blue-600" />
  },
  {
    question: "Is CareBow a substitute for professional medical care?",
    answer: "No, CareBow is not a substitute for professional medical advice, diagnosis, or treatment. It's designed to provide general health information and guidance. Always consult with qualified healthcare providers for serious health concerns, and seek emergency medical care immediately for life-threatening situations.",
    category: "Medical",
    icon: <AlertTriangle className="h-5 w-5 text-red-600" />
  },
  {
    question: "How accurate is the AI's health analysis?",
    answer: "Our AI is trained on extensive medical databases and continuously improved through machine learning. However, it's designed to provide general guidance and should not be used for self-diagnosis. The AI is most effective when used as a tool to help you understand your symptoms and determine when to seek professional care.",
    category: "Technical",
    icon: <CheckCircle className="h-5 w-5 text-green-600" />
  },
  {
    question: "Is my health information secure and private?",
    answer: "Yes, absolutely. We are fully HIPAA-compliant and use end-to-end encryption to protect your health data. All information is stored securely in encrypted databases, and we never share your personal health information without your explicit consent. Your privacy and data security are our top priorities.",
    category: "Privacy",
    icon: <Shield className="h-5 w-5 text-purple-600" />
  },
  {
    question: "What makes CareBow different from other health apps?",
    answer: "CareBow uniquely combines AI technology with traditional healing wisdom, particularly Ayurvedic practices. We provide culturally-sensitive recommendations, consider your personal background and preferences, and offer a holistic approach to health that bridges modern medicine with traditional wisdom.",
    category: "General",
    icon: <Heart className="h-5 w-5 text-red-600" />
  },
  {
    question: "Can I use CareBow for emergency medical situations?",
    answer: "No, CareBow is not designed for emergency situations. If you are experiencing a medical emergency, call 911 or go to your nearest emergency room immediately. CareBow is meant for general health guidance and non-emergency health concerns only.",
    category: "Medical",
    icon: <Phone className="h-5 w-5 text-red-600" />
  },
  {
    question: "How much does CareBow cost?",
    answer: "CareBow offers a free tier with basic health insights and limited consultations. We also have premium plans with advanced features, unlimited consultations, and priority support. Pricing varies by region and plan type. Check our pricing page for detailed information about current plans and costs.",
    category: "General",
    icon: <Users className="h-5 w-5 text-blue-600" />
  },
  {
    question: "Can I use CareBow if I'm not in the United States?",
    answer: "Yes, CareBow is designed to be accessible globally. However, our AI recommendations are tailored to different regions and healthcare systems. We're continuously expanding our global reach and adapting our platform to meet local healthcare needs and regulations.",
    category: "General",
    icon: <Globe className="h-5 w-5 text-green-600" />
  },
  {
    question: "How do I get started with CareBow?",
    answer: "Getting started is easy! Simply create an account, complete your health profile, and start using our AI assistant. You can begin by describing any symptoms or health concerns you have, and our AI will guide you through the process with intelligent follow-up questions.",
    category: "General",
    icon: <CheckCircle className="h-5 w-5 text-green-600" />
  },
  {
    question: "Can I trust the traditional medicine recommendations?",
    answer: "Our traditional medicine recommendations are based on established practices and are integrated with modern medical knowledge. However, these should be used as complementary to, not replacements for, professional medical advice. Always consult with qualified practitioners before trying new treatments.",
    category: "Medical",
    icon: <Heart className="h-5 w-5 text-orange-600" />
  },
  {
    question: "What if I disagree with the AI's recommendations?",
    answer: "That's perfectly fine! Our AI provides suggestions based on available information, but you should always trust your instincts and consult with healthcare professionals if you have concerns. The AI is a tool to help guide your health decisions, not to make them for you.",
    category: "General",
    icon: <HelpCircle className="h-5 w-5 text-blue-600" />
  },
  {
    question: "How can I contact support if I have issues?",
    answer: "You can contact our support team through the in-app chat, email us at support@carebow.com, or use our contact form. We also have a comprehensive help center with tutorials and troubleshooting guides. For technical issues, you can reach our technical support team directly.",
    category: "Support",
    icon: <Mail className="h-5 w-5 text-blue-600" />
  }
];

const categories = ["All", "General", "Medical", "Technical", "Privacy", "Support"];

export const FAQ: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const filteredFAQs = selectedCategory === "All" 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-2">
            <HelpCircle className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about CareBow's AI-powered healthcare platform
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredFAQs.map((faq, index) => (
            <Card key={index} className="overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {faq.icon}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {faq.category}
                    </Badge>
                    {openItems.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </button>
              
              <AnimatePresence>
                {openItems.includes(index) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <CardContent className="pt-0 pb-6">
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Still have questions?
              </h2>
              <p className="text-gray-600">
                Our support team is here to help you get the most out of CareBow
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Contact Support</span>
                </button>
                <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Call Us</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Emergency Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Medical Emergency
                  </h3>
                  <p className="text-red-700">
                    If you are experiencing a medical emergency, call 911 or go to your nearest emergency room immediately. 
                    CareBow is not designed for emergency situations and should not be used as a substitute for emergency medical care.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
