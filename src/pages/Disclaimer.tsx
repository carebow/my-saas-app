import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Shield, 
  Phone, 
  FileText,
  CheckCircle,
  XCircle,
  Heart,
  Stethoscope,
  Users
} from 'lucide-react';

export const Disclaimer: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-2">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <h1 className="text-4xl font-bold text-gray-900">Medical Disclaimer</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Important information about the limitations and proper use of CareBow's AI-powered healthcare platform.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge className="bg-red-100 text-red-800">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Important Notice
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <Shield className="h-4 w-4 mr-1" />
              User Safety
            </Badge>
          </div>
        </motion.div>

        {/* Emergency Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-red-300 bg-red-100">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <Phone className="h-8 w-8 text-red-600" />
                  <h2 className="text-2xl font-bold text-red-800">MEDICAL EMERGENCY</h2>
                </div>
                <p className="text-lg text-red-700 font-semibold">
                  If you are experiencing a medical emergency, call 911 or go to your nearest emergency room immediately.
                </p>
                <p className="text-red-600">
                  CareBow is NOT designed for emergency situations and should not be used as a substitute for emergency medical care.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* Primary Disclaimer */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-800">
                <FileText className="h-5 w-5 text-orange-600" />
                <span>Primary Medical Disclaimer</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-6 rounded-lg border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-800 mb-4">Important Notice</h3>
                <ul className="space-y-3 text-orange-700">
                  <li className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                    <span>
                      <strong>CareBow is NOT a substitute for professional medical advice, diagnosis, or treatment.</strong>
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                    <span>
                      Always seek the advice of your physician or other qualified health provider with any questions 
                      you may have regarding a medical condition.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                    <span>
                      Never disregard professional medical advice or delay in seeking it because of something 
                      you have read or received from our AI assistant.
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                    <span>
                      Our AI provides general health information and should not be used for self-diagnosis or 
                      self-treatment of serious health conditions.
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* AI Limitations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                <span>AI Assistant Limitations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What Our AI Can Do</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>Provide general health information and education</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>Suggest when to seek professional medical care</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>Offer general wellness and lifestyle advice</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>Help track symptoms and health metrics</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What Our AI Cannot Do</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span>Provide medical diagnoses or specific treatment plans</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span>Replace in-person medical examinations</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span>Handle medical emergencies or urgent situations</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span>Prescribe medications or medical devices</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* When to Seek Professional Care */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-600" />
                <span>When to Seek Professional Medical Care</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                You should always consult with a qualified healthcare provider if you experience:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Emergency Symptoms</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Chest pain or pressure</li>
                    <li>• Difficulty breathing or shortness of breath</li>
                    <li>• Severe abdominal pain</li>
                    <li>• Sudden severe headache</li>
                    <li>• Loss of consciousness or fainting</li>
                    <li>• Severe bleeding</li>
                    <li>• Signs of stroke (facial drooping, arm weakness, speech difficulty)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Concerning Symptoms</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Persistent fever (over 101°F for more than 3 days)</li>
                    <li>• Unexplained weight loss</li>
                    <li>• Persistent pain that doesn't improve</li>
                    <li>• Changes in vision or hearing</li>
                    <li>• Persistent nausea or vomiting</li>
                    <li>• Severe fatigue or weakness</li>
                    <li>• Any symptom that concerns you</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span>Your Responsibilities</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Information Accuracy</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Provide accurate and complete health information</li>
                    <li>• Update your information when it changes</li>
                    <li>• Be honest about your symptoms and concerns</li>
                    <li>• Include relevant medical history and medications</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Appropriate Use</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Use CareBow as an informational tool only</li>
                    <li>• Follow up with healthcare providers when recommended</li>
                    <li>• Don't ignore or delay seeking professional care</li>
                    <li>• Report any concerning symptoms immediately</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liability Limitations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-gray-600" />
                <span>Liability and Limitations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                By using CareBow, you acknowledge and agree that:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                  <span>CareBow is not responsible for any medical decisions you make based on our AI's suggestions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                  <span>We cannot guarantee the accuracy, completeness, or timeliness of health information provided</span>
                </li>
                <li className="flex items-start space-x-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                  <span>You are solely responsible for your health decisions and actions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                  <span>Our AI may not be suitable for all health conditions or situations</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-blue-600" />
                <span>Emergency and Support Contacts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Medical Emergency</h3>
                  <p className="text-red-700 font-bold text-xl">Call 911</p>
                  <p className="text-red-600 text-sm">For life-threatening emergencies</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">CareBow Support</h3>
                  <p className="text-blue-700 font-bold">support@carebow.com</p>
                  <p className="text-blue-600 text-sm">For platform-related questions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Final Notice */}
          <Card className="border-red-300 bg-red-50">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-red-600 mx-auto" />
                <h3 className="text-xl font-bold text-red-800">Final Notice</h3>
                <p className="text-red-700 text-lg">
                  By using CareBow, you acknowledge that you have read, understood, and agree to this medical disclaimer. 
                  You understand that CareBow is an informational tool and not a substitute for professional medical care.
                </p>
                <p className="text-red-600 font-semibold">
                  If you do not agree with any part of this disclaimer, please do not use our platform.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
