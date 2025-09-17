import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  AlertTriangle, 
  Shield, 
  Users, 
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Globe
} from 'lucide-react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Please read these terms carefully before using CareBow. By using our platform, you agree to be bound by these terms.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge className="bg-blue-100 text-blue-800">
              <CheckCircle className="h-4 w-4 mr-1" />
              Legally Binding
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              <Shield className="h-4 w-4 mr-1" />
              User Protection
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
                <span>1. Agreement to Terms</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                These Terms of Service ("Terms") govern your use of CareBow's AI-powered healthcare platform 
                ("Service") operated by CareBow Inc. ("Company," "we," "our," or "us").
              </p>
              <p className="text-gray-700">
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with 
                any part of these terms, you may not access the Service.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-green-600" />
                <span>2. Service Description</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                CareBow provides an AI-powered healthcare platform that offers:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>AI-powered symptom analysis and health insights</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Telehealth consultation services</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Caregiver matching and coordination</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Health tracking and analytics</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                  <span>Educational content and resources</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Medical Disclaimer */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>3. Medical Disclaimer</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Important Medical Notice</h3>
                <ul className="space-y-2 text-red-700">
                  <li className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <span><strong>CareBow is NOT a substitute for professional medical advice, diagnosis, or treatment.</strong></span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <span>Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <span>Never disregard professional medical advice or delay in seeking it because of something you have read on our platform.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <span>If you think you may have a medical emergency, call 911 or go to the nearest emergency room immediately.</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span>4. User Responsibilities</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Security</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Maintain the confidentiality of your account credentials</li>
                    <li>• Notify us immediately of any unauthorized use</li>
                    <li>• Provide accurate and complete information</li>
                    <li>• Update your information when it changes</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Appropriate Use</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Use the Service only for lawful purposes</li>
                    <li>• Provide truthful and accurate health information</li>
                    <li>• Respect other users and our staff</li>
                    <li>• Follow all applicable laws and regulations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Uses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span>5. Prohibited Uses</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">You may not use our Service:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                  <span>For any unlawful purpose or to solicit others to perform unlawful acts</span>
                </li>
                <li className="flex items-start space-x-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                  <span>To violate any international, federal, provincial, or state rules, laws, or local ordinances</span>
                </li>
                <li className="flex items-start space-x-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                  <span>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</span>
                </li>
                <li className="flex items-start space-x-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                  <span>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</span>
                </li>
                <li className="flex items-start space-x-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                  <span>To submit false or misleading information</span>
                </li>
                <li className="flex items-start space-x-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                  <span>To upload or transmit viruses or any other type of malicious code</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-orange-600" />
                <span>6. Limitation of Liability</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                In no event shall CareBow, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
                limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use 
                of the Service.
              </p>
              <p className="text-gray-700">
                Our total liability to you for all damages shall not exceed the amount you paid us for the Service 
                in the 12 months preceding the claim.
              </p>
            </CardContent>
          </Card>

          {/* Privacy Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>7. Privacy Policy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use 
                of the Service, to understand our practices.
              </p>
              <p className="text-gray-700">
                We are committed to protecting your health information in accordance with HIPAA and other applicable 
                privacy laws and regulations.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-gray-600" />
                <span>8. Termination</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We may terminate or suspend your account and bar access to the Service immediately, without prior 
                notice or liability, under our sole discretion, for any reason whatsoever and without limitation, 
                including but not limited to a breach of the Terms.
              </p>
              <p className="text-gray-700">
                If you wish to terminate your account, you may simply discontinue using the Service or contact us 
                to request account deletion.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                <span>9. Changes to Terms</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p className="text-gray-700">
                By continuing to access or use our Service after those revisions become effective, you agree to 
                be bound by the revised terms.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <span>10. Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Legal Department</h3>
                    <p className="text-gray-700">legal@carebow.com</p>
                    <p className="text-gray-700">+1 (555) 123-4567</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">General Support</h3>
                    <p className="text-gray-700">support@carebow.com</p>
                    <p className="text-gray-700">help@carebow.com</p>
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
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Medical Emergency</h3>
                  <p className="text-red-700">
                    <strong>Call 911 immediately</strong> if you are experiencing a medical emergency. 
                    CareBow is not designed for emergency situations and should not be used as a substitute 
                    for emergency medical care.
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