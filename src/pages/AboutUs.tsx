'use client'

import React from 'react';

export const dynamic = 'force-dynamic';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Heart, 
  Users, 
  Target, 
  Award,
  Globe,
  Shield,
  Brain,
  Stethoscope,
  CheckCircle,
  Star,
  Quote
} from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto p-6 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center space-x-3">
            <Heart className="h-10 w-10 text-red-500" />
            <h1 className="text-5xl font-bold text-gray-900">About CareBow</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            We're revolutionizing healthcare by combining the wisdom of traditional medicine with cutting-edge AI technology, 
            making quality healthcare accessible to everyone, everywhere.
          </p>
          <div className="flex items-center justify-center space-x-4 flex-wrap">
            <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
              <Brain className="h-5 w-5 mr-2" />
              AI-Powered
            </Badge>
            <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
              <Shield className="h-5 w-5 mr-2" />
              HIPAA Compliant
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 text-lg px-4 py-2">
              <Globe className="h-5 w-5 mr-2" />
              Global Reach
            </Badge>
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-8"
        >
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-800">
                <Target className="h-6 w-6" />
                <span>Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 text-lg leading-relaxed">
                To democratize healthcare by providing AI-powered, culturally-sensitive health solutions that combine 
                the best of modern medicine with traditional healing wisdom, making quality healthcare accessible, 
                affordable, and personalized for everyone.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <Award className="h-6 w-6" />
                <span>Our Vision</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 text-lg leading-relaxed">
                A world where every person has access to intelligent, compassionate healthcare that understands their 
                unique needs, cultural background, and personal health journey, empowering them to live healthier, 
                more fulfilling lives.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <Heart className="h-6 w-6 text-red-500" />
                <span>Our Story</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  CareBow was born from a simple yet profound realization: healthcare should be as personal and 
                  accessible as a conversation with a trusted friend. Our founders, a team of healthcare professionals, 
                  AI researchers, and technology experts, witnessed firsthand the barriers that prevent people from 
                  accessing quality healthcare.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We saw how traditional healthcare systems often fail to consider cultural nuances, personal preferences, 
                  and the holistic nature of health. We recognized that while modern medicine has made incredible advances, 
                  it often overlooks the wisdom of traditional healing practices that have been refined over centuries.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  This led us to create CareBow – a platform that bridges the gap between ancient wisdom and modern 
                  technology, between personal care and global accessibility, between individual needs and universal 
                  health solutions.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* What Makes Us Different */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">What Makes CareBow Different</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Brain className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">AI + Traditional Wisdom</h3>
                  <p className="text-gray-600">
                    We combine cutting-edge AI with Ayurvedic and traditional healing practices, 
                    offering a holistic approach to health.
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Privacy First</h3>
                  <p className="text-gray-600">
                    HIPAA-compliant and end-to-end encrypted, your health data is protected with 
                    industry-leading security measures.
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Globe className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Culturally Sensitive</h3>
                  <p className="text-gray-600">
                    Our AI understands cultural contexts and personal preferences, providing 
                    recommendations that respect your background.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Our Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Our Core Values</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Compassion</h3>
                  <p className="text-sm text-gray-600">Every interaction is guided by empathy and understanding</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Integrity</h3>
                  <p className="text-sm text-gray-600">Transparent, honest, and ethical in everything we do</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Excellence</h3>
                  <p className="text-sm text-gray-600">Committed to delivering the highest quality healthcare solutions</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Accessibility</h3>
                  <p className="text-sm text-gray-600">Making quality healthcare available to everyone, everywhere</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Our Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Meet Our Team</CardTitle>
              <p className="text-center text-gray-600">
                A diverse group of healthcare professionals, AI researchers, and technology experts
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto flex items-center justify-center">
                    <Stethoscope className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Dr. Sarah Chen</h3>
                  <p className="text-blue-600 font-medium">Chief Medical Officer</p>
                  <p className="text-gray-600 text-sm">
                    Board-certified physician with 15+ years of experience in internal medicine and 
                    preventive care. Specializes in AI-assisted diagnostics.
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto flex items-center justify-center">
                    <Brain className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Dr. Raj Patel</h3>
                  <p className="text-green-600 font-medium">Chief Technology Officer</p>
                  <p className="text-gray-600 text-sm">
                    AI researcher and machine learning expert with a PhD in Computer Science. 
                    Former Google AI researcher specializing in healthcare applications.
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                    <Heart className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Dr. Priya Sharma</h3>
                  <p className="text-purple-600 font-medium">Head of Traditional Medicine</p>
                  <p className="text-gray-600 text-sm">
                    Licensed Ayurvedic practitioner with 20+ years of experience. Expert in 
                    integrating traditional healing practices with modern healthcare.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">What People Say About CareBow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-blue-500" />
                  <p className="text-gray-700 italic">
                    "CareBow has been a game-changer for my family. The AI understands our cultural background 
                    and provides recommendations that actually make sense for our lifestyle. It's like having 
                    a knowledgeable family doctor available 24/7."
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">AM</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Aisha Mohammed</p>
                      <p className="text-sm text-gray-600">Mother of 3, Dubai</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-green-500" />
                  <p className="text-gray-700 italic">
                    "As a healthcare professional, I'm impressed by CareBow's accuracy and the way it combines 
                    modern medicine with traditional wisdom. It's helping my patients make better health decisions 
                    and take more control of their wellness journey."
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold">DR</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Dr. Robert Kim</p>
                      <p className="text-sm text-gray-600">Family Physician, San Francisco</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center space-y-6"
        >
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Experience the Future of Healthcare?
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Join thousands of people who are already using CareBow to take control of their health journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Try CareBow Now
                </button>
                <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Learn More
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
