'use client'

import React from 'react';

export const dynamic = 'force-dynamic';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Users, 
  FileText,
  CheckCircle,
  AlertTriangle,
  Globe,
  Mail
} from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
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
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your privacy and data security are our top priorities. Learn how we protect and handle your health information.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-4 w-4 mr-1" />
              HIPAA Compliant
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <Lock className="h-4 w-4 mr-1" />
              End-to-End Encrypted
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              <Globe className="h-4 w-4 mr-1" />
              GDPR Ready
            </Badge>
          </div>
        </motion.div>

        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Introduction</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                CareBow ("we," "our," or "us") is committed to protecting your privacy and personal health information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use 
                our AI-powered healthcare platform.
              </p>
              <p className="text-gray-700">
                As a healthcare technology company, we understand the sensitive nature of health information and have 
                implemented industry-leading security measures to protect your data.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-green-600" />
                <span>Information We Collect</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Health Information</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Symptoms and health concerns you share with our AI assistant</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Health metrics and vital signs you choose to track</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Medical history and medication information</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Consultation notes and AI-generated health insights</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Information</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Name, email address, and contact information</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Account preferences and settings</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Payment information (processed securely through Stripe)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage Information</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>How you interact with our platform and features</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>Device information and browser type</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>IP address and general location (for security purposes)</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-purple-600" />
                <span>How We Use Your Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Healthcare Services</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Provide AI-powered health insights and recommendations</li>
                    <li>• Connect you with healthcare providers when needed</li>
                    <li>• Track your health progress and trends</li>
                    <li>• Generate personalized health reports</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Platform Improvement</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Improve our AI algorithms and accuracy</li>
                    <li>• Enhance user experience and features</li>
                    <li>• Conduct research and analytics (anonymized)</li>
                    <li>• Provide customer support</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-red-600" />
                <span>Data Security & Protection</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-3">HIPAA Compliance</h3>
                <p className="text-green-700">
                  We are fully compliant with the Health Insurance Portability and Accountability Act (HIPAA) 
                  and implement all required administrative, physical, and technical safeguards to protect your health information.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Encryption</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• End-to-end encryption for all data transmission</li>
                    <li>• AES-256 encryption for data at rest</li>
                    <li>• Secure key management and rotation</li>
                    <li>• Encrypted database storage</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Access Controls</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Multi-factor authentication for all staff</li>
                    <li>• Role-based access controls</li>
                    <li>• Regular security audits and monitoring</li>
                    <li>• Secure data centers with 24/7 monitoring</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-indigo-600" />
                <span>Your Rights & Choices</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Access & Control</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• View and download your health data</li>
                    <li>• Update or correct your information</li>
                    <li>• Delete your account and data</li>
                    <li>• Opt-out of certain data uses</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Communication</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Control email and notification preferences</li>
                    <li>• Request data portability</li>
                    <li>• File complaints or concerns</li>
                    <li>• Contact our privacy team</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <span>Contact Us</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Privacy Officer</h3>
                    <p className="text-gray-700">privacy@carebow.com</p>
                    <p className="text-gray-700">+1 (555) 123-4567</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Data Protection Officer</h3>
                    <p className="text-gray-700">dpo@carebow.com</p>
                    <p className="text-gray-700">support@carebow.com</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Notice */}
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Medical Emergency Notice</h3>
                  <p className="text-red-700">
                    <strong>Important:</strong> CareBow is not a substitute for emergency medical care. 
                    If you are experiencing a medical emergency, please call 911 or go to your nearest emergency room immediately.
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

export default PrivacyPolicy;