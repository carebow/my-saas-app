'use client'

import React from 'react';

export const dynamic = 'force-dynamic';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Brain,
  Shield,
  ArrowRight,
  Phone,
  Stethoscope,
  Leaf,
  Zap,
  Heart
} from 'lucide-react';

export const MigrainePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-2">
            <Stethoscope className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">Migraine - Expert Guidance</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Migraines are severe, recurring headaches that can significantly impact daily life. Get comprehensive guidance on migraine management, prevention, and treatment options.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge className="bg-red-100 text-red-800 border-red-200">
              <AlertTriangle className="h-4 w-4 mr-1" />
              High Priority
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              <Brain className="h-4 w-4 mr-1" />
              AI-Powered Analysis
            </Badge>
          </div>
        </motion.div>

        {/* Emergency Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-red-300 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Seek Immediate Medical Attention If:
                  </h3>
                  <ul className="text-red-700 space-y-1">
                    <li>• Sudden, severe headache unlike any you've had before</li>
                    <li>• Headache with fever, stiff neck, or rash</li>
                    <li>• Headache after head injury</li>
                    <li>• Headache with vision changes, difficulty speaking, or weakness</li>
                    <li>• Headache that worsens over time</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Left Column */}
          <div className="space-y-6">
            {/* Common Causes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  <span>Common Migraine Triggers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Stress and anxiety</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Hormonal changes (menstrual cycle)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Sleep disturbances</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Certain foods (chocolate, cheese, wine)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Bright lights and loud noises</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Weather changes</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Caffeine withdrawal</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Symptoms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <span>Migraine Symptoms</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Aura (before headache):</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Visual disturbances (flashing lights, blind spots)</li>
                      <li>• Tingling or numbness in face or hands</li>
                      <li>• Difficulty speaking</li>
                      <li>• Dizziness or vertigo</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">During migraine:</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Throbbing or pulsing pain (usually one side)</li>
                      <li>• Sensitivity to light, sound, or smells</li>
                      <li>• Nausea and vomiting</li>
                      <li>• Blurred vision</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Self-Care Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span>Self-Care & Prevention</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Maintain regular sleep schedule</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Stay hydrated and eat regular meals</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Practice stress management techniques</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Keep a migraine diary to identify triggers</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Exercise regularly (moderate intensity)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Limit caffeine and alcohol</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Ayurvedic Remedies */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <Leaf className="h-5 w-5 text-green-600" />
                  <span>Ayurvedic Remedies for Migraine</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <Leaf className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-green-700">Apply sandalwood paste on forehead</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Leaf className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-green-700">Drink ginger tea with honey</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Leaf className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-green-700">Practice pranayama (breathing exercises)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Leaf className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-green-700">Apply cold milk compress to head</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Leaf className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-green-700">Use brahmi (gotu kola) for nervous system</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Leaf className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-green-700">Consume cooling foods (cucumber, watermelon)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Leaf className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-green-700">Massage temples with coconut oil</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* When to See a Doctor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-orange-600" />
                  <span>When to See a Doctor</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Frequent migraines (more than 4 per month)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Migraines that don't respond to treatment</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">New or different migraine symptoms</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Migraines after age 50</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Migraines with fever or stiff neck</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-6 text-center space-y-4">
                <h3 className="text-xl font-semibold text-purple-800">
                  Get Personalized Migraine Analysis
                </h3>
                <p className="text-purple-700">
                  Use our AI-powered symptom checker to get personalized migraine insights and treatment recommendations
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Brain className="h-4 w-4 mr-2" />
                    Try AI Migraine Checker
                  </Button>
                  <Button variant="outline" className="border-purple-600 text-purple-600">
                    <Phone className="h-4 w-4 mr-2" />
                    Consult Specialist
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Related Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Related Health Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900 mb-2">Headache Relief</h4>
                  <p className="text-gray-600 text-sm mb-3">Learn about different types of headaches and effective relief methods</p>
                  <Button size="sm" variant="outline">Read More</Button>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900 mb-2">Stress Management</h4>
                  <p className="text-gray-600 text-sm mb-3">Discover techniques to manage stress and prevent migraine triggers</p>
                  <Button size="sm" variant="outline">Read More</Button>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900 mb-2">Ayurvedic Wellness</h4>
                  <p className="text-gray-600 text-sm mb-3">Explore traditional healing approaches for modern health challenges</p>
                  <Button size="sm" variant="outline">Read More</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-gray-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Medical Disclaimer
                  </h3>
                  <p className="text-gray-600 text-sm">
                    This information is for educational purposes only and is not a substitute for professional medical advice, 
                    diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider 
                    with any questions you may have regarding a medical condition. If you think you may have a medical 
                    emergency, call 911 immediately.
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

export default MigrainePage;
