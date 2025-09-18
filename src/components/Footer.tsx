import React from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Globe,
  Shield,
  FileText,
  AlertTriangle,
  Users,
  MessageCircle,
  Twitter,
  Linkedin,
  Instagram,
  Youtube
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold">CareBow</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              AI-powered healthcare platform combining modern medicine with traditional healing wisdom. 
              Making quality healthcare accessible to everyone, everywhere.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/ask-carebow" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Ask CareBow
                </Link>
              </li>
              <li>
                <Link href="/health-dashboard" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Health Dashboard
                </Link>
              </li>
              <li>
                <Link href="/writer-dashboard" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Writer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-300 text-sm">AI Symptom Checker</span>
              </li>
              <li>
                <span className="text-gray-300 text-sm">Telehealth Consultations</span>
              </li>
              <li>
                <span className="text-gray-300 text-sm">Caregiver Matching</span>
              </li>
              <li>
                <span className="text-gray-300 text-sm">Health Analytics</span>
              </li>
              <li>
                <span className="text-gray-300 text-sm">Wellness Programs</span>
              </li>
              <li>
                <span className="text-gray-300 text-sm">Content Management</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact & Support</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">support@carebow.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">San Francisco, CA</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">Available Globally</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust & Legal Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Trust Badges */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Trust & Compliance</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-2 bg-green-900 px-3 py-2 rounded-lg">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2 bg-blue-900 px-3 py-2 rounded-lg">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 text-sm font-medium">End-to-End Encrypted</span>
                </div>
                <div className="flex items-center space-x-2 bg-purple-900 px-3 py-2 rounded-lg">
                  <Globe className="h-4 w-4 text-purple-400" />
                  <span className="text-purple-400 text-sm font-medium">GDPR Ready</span>
                </div>
              </div>
            </div>

            {/* Legal Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Legal & Privacy</h3>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-2">
                  <FileText className="h-3 w-3" />
                  <span>Privacy Policy</span>
                </Link>
                <Link href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-2">
                  <FileText className="h-3 w-3" />
                  <span>Terms of Service</span>
                </Link>
                <Link href="/disclaimer" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-2">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Medical Disclaimer</span>
                </Link>
                <Link href="/hipaa-compliance" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-2">
                  <Shield className="h-3 w-3" />
                  <span>HIPAA Compliance</span>
                </Link>
                <Link href="/accessibility" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-2">
                  <Users className="h-3 w-3" />
                  <span>Accessibility</span>
                </Link>
                <Link href="/cookie-policy" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-2">
                  <FileText className="h-3 w-3" />
                  <span>Cookie Policy</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="border-t border-red-800 mt-8 pt-6">
          <div className="bg-red-900 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-200 mb-2">
                  Medical Emergency
                </h3>
                <p className="text-red-300 text-sm">
                  If you are experiencing a medical emergency, call 911 or go to your nearest emergency room immediately. 
                  CareBow is not designed for emergency situations and should not be used as a substitute for emergency medical care.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} CareBow Inc. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for better healthcare</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
