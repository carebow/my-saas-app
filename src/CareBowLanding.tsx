'use client'

import React, { useState, useEffect, lazy, Suspense, useMemo, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Lazy load Footer component for better performance
const Footer = lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));
import { 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Shield, 
  Users, 
  Clock, 
  Heart, 
  Brain,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  ChevronUp,
  Play,
  Award,
  Zap,
  Globe,
  Lock,
  UserCheck,
  TrendingUp
} from 'lucide-react';

const CareBowLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Email submitted:', email);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      setEmail('');
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalOrganization",
            "name": "CareBow",
            "description": "AI-powered healthcare platform providing personalized care solutions for families and caregivers",
            "url": "https://carebow.com",
            "logo": "https://carebow.com/logo.png",
            "image": "https://carebow.com/og-image.jpg",
            "telephone": "+1-555-123-4567",
            "email": "support@carebow.com",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "San Francisco",
              "addressRegion": "CA",
              "addressCountry": "US"
            },
            "sameAs": [
              "https://twitter.com/CareBow",
              "https://linkedin.com/company/carebow",
              "https://instagram.com/carebow",
              "https://youtube.com/carebow"
            ],
            "serviceType": "Healthcare Technology",
            "areaServed": "United States",
            "hasCredential": {
              "@type": "EducationalOccupationalCredential",
              "credentialCategory": "HIPAA Compliant"
            },
            "offers": [
              {
                "@type": "Offer",
                "name": "Individual Plan",
                "description": "AI-powered health monitoring for single users",
                "price": "29",
                "priceCurrency": "USD",
                "priceSpecification": {
                  "@type": "UnitPriceSpecification",
                  "price": "29",
                  "priceCurrency": "USD",
                  "unitText": "MONTH"
                }
              },
              {
                "@type": "Offer",
                "name": "Family Plan",
                "description": "Comprehensive healthcare for families up to 4 members",
                "price": "79",
                "priceCurrency": "USD",
                "priceSpecification": {
                  "@type": "UnitPriceSpecification",
                  "price": "79",
                  "priceCurrency": "USD",
                  "unitText": "MONTH"
                }
              }
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "50000",
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": [
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Sarah Martinez"
                },
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5"
                },
                "reviewBody": "CareBow's AI caught my daughter's early symptoms that I missed. The 24/7 support and personalized care plans have been life-changing."
              }
            ]
          })
        }}
      />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50 shadow-sm" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center" aria-hidden="true">
                    <Heart className="text-white" size={20} />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    CareBow
                  </h1>
                </div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8" role="menubar">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                  role="menuitem"
                  aria-label="Navigate to Features section"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                  role="menuitem"
                  aria-label="Navigate to How It Works section"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                  role="menuitem"
                  aria-label="Navigate to Pricing section"
                >
                  Pricing
                </button>
                <button 
                  onClick={() => scrollToSection('testimonials')}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                  role="menuitem"
                  aria-label="Navigate to Reviews section"
                >
                  Reviews
                </button>
                <button 
                  onClick={() => scrollToSection('waitlist')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  role="menuitem"
                  aria-label="Get early access to CareBow"
                >
                  Get Early Access
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 p-2"
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-in slide-in-from-top-2 duration-300"
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              <button 
                onClick={() => scrollToSection('features')}
                className="block w-full text-left text-gray-700 hover:text-blue-600 px-4 py-3 text-base font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200"
                role="menuitem"
                aria-label="Navigate to Features section"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="block w-full text-left text-gray-700 hover:text-blue-600 px-4 py-3 text-base font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200"
                role="menuitem"
                aria-label="Navigate to How It Works section"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="block w-full text-left text-gray-700 hover:text-blue-600 px-4 py-3 text-base font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200"
                role="menuitem"
                aria-label="Navigate to Pricing section"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="block w-full text-left text-gray-700 hover:text-blue-600 px-4 py-3 text-base font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200"
                role="menuitem"
                aria-label="Navigate to Reviews section"
              >
                Reviews
              </button>
              <div className="pt-4 border-t border-gray-200">
                <button 
                  onClick={() => scrollToSection('waitlist')}
                  className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-full text-base font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg active:scale-95 transform"
                  role="menuitem"
                  aria-label="Get early access to CareBow"
                >
                  Get Early Access
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden" aria-labelledby="hero-heading">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
              <Zap className="mr-2" size={16} />
              AI-Powered Healthcare Platform
            </div>
            
            <h1 id="hero-heading" className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              The Future of Healthcare is
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                Here Today
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Join <span className="font-bold text-blue-600">50,000+ families</span> who trust CareBow for 
              <span className="font-semibold text-gray-900"> AI-powered health insights</span>, 
              <span className="font-semibold text-gray-900"> 24/7 expert care</span>, and 
              <span className="font-semibold text-gray-900"> personalized wellness plans</span> that actually work.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={() => scrollToSection('waitlist')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:scale-95 flex items-center justify-center relative overflow-hidden group touch-manipulation"
              >
                <span className="relative z-10 flex items-center">
                  Get Free Access Now
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300 flex items-center justify-center group active:scale-95 touch-manipulation"
              >
                <Play className="mr-2 group-hover:scale-110 transition-transform" size={20} />
                See How It Works
              </button>
            </div>
            
            {/* Urgency Banner */}
            <div className="bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center text-orange-800">
                <Clock className="mr-2" size={20} />
                <span className="font-semibold">Limited Time: Free access for first 1,000 families</span>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={16} />
                  ))}
                </div>
                <span className="font-semibold">4.9/5 from 50,000+ families</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="text-blue-600" size={16} />
                <span className="font-semibold">Trusted by 50K+ families</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="text-green-600" size={16} />
                <span className="font-semibold">HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="text-purple-600" size={16} />
                <span className="font-semibold">Healthcare Innovation Award 2024</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="text-blue-600" size={16} />
                <span className="font-semibold">Available Nationwide</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose CareBow?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge AI technology with compassionate care to deliver 
              the most comprehensive healthcare experience for your family.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Brain className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Insights</h3>
                <p className="text-gray-600 mb-6">
                  Advanced machine learning algorithms analyze your health data to provide 
                  personalized recommendations and early warning systems.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center group-hover:translate-x-1 transition-transform duration-200">
                    <CheckCircle className="text-green-500 mr-2" size={16} />
                    Predictive health analytics
                  </li>
                  <li className="flex items-center group-hover:translate-x-1 transition-transform duration-200 delay-100">
                    <CheckCircle className="text-green-500 mr-2" size={16} />
                    Personalized care plans
                  </li>
                  <li className="flex items-center group-hover:translate-x-1 transition-transform duration-200 delay-200">
                    <CheckCircle className="text-green-500 mr-2" size={16} />
                    Risk assessment tools
                  </li>
                </ul>
              </div>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Clock className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">24/7 Support</h3>
                <p className="text-gray-600 mb-6">
                  Round-the-clock access to healthcare professionals, emergency support, 
                  and instant medical guidance whenever you need it.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center group-hover:translate-x-1 transition-transform duration-200">
                    <CheckCircle className="text-green-500 mr-2" size={16} />
                    Instant video consultations
                  </li>
                  <li className="flex items-center group-hover:translate-x-1 transition-transform duration-200 delay-100">
                    <CheckCircle className="text-green-500 mr-2" size={16} />
                    Emergency response team
                  </li>
                  <li className="flex items-center group-hover:translate-x-1 transition-transform duration-200 delay-200">
                    <CheckCircle className="text-green-500 mr-2" size={16} />
                    Medication management
                  </li>
                </ul>
              </div>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Family-Focused Care</h3>
                <p className="text-gray-600 mb-6">
                  Comprehensive healthcare management for every family member, from 
                  children to seniors, with coordinated care plans.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center group-hover:translate-x-1 transition-transform duration-200">
                    <CheckCircle className="text-green-500 mr-2" size={16} />
                    Multi-generational care
                  </li>
                  <li className="flex items-center group-hover:translate-x-1 transition-transform duration-200 delay-100">
                    <CheckCircle className="text-green-500 mr-2" size={16} />
                    Coordinated treatment plans
                  </li>
                  <li className="flex items-center group-hover:translate-x-1 transition-transform duration-200 delay-200">
                    <CheckCircle className="text-green-500 mr-2" size={16} />
                    Family health dashboard
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How CareBow Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes and experience the future of healthcare
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sign Up & Connect</h3>
              <p className="text-gray-600 text-lg">
                Create your family profile and connect with our healthcare team. 
                Share your medical history and current health needs.
              </p>
              <div className="absolute top-10 right-0 hidden md:block">
                <ArrowRight className="text-gray-300" size={32} />
              </div>
            </div>

            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Personalized Care</h3>
              <p className="text-gray-600 text-lg">
                Receive AI-powered health insights, personalized care plans, 
                and 24/7 access to our network of medical professionals.
              </p>
              <div className="absolute top-10 right-0 hidden md:block">
                <ArrowRight className="text-gray-300" size={32} />
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Thrive & Monitor</h3>
              <p className="text-gray-600 text-lg">
                Watch your family's health improve with continuous monitoring, 
                preventive care, and expert guidance every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Choose the plan that's right for your family. No hidden fees, no surprises.
            </p>
            
            {/* Limited Time Offer Banner */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-full inline-flex items-center mb-8 shadow-lg">
              <Zap className="mr-2" size={20} />
              <span className="font-bold">Limited Time: 50% OFF for first 3 months!</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 relative group">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Individual</h3>
              <p className="text-gray-600 mb-6">Perfect for single users</p>
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-600 ml-2">/month</span>
                  <span className="bg-green-100 text-green-800 text-sm font-semibold px-2 py-1 rounded-full ml-2">
                    Save $15
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-through">$44/month</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span>24/7 AI health monitoring</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span>Unlimited consultations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span>Personalized care plans</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span>Medication management</span>
                </li>
              </ul>
              <button className="w-full bg-gray-900 text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors group-hover:scale-105 transform duration-200">
                Get Started
              </button>
            </div>

            <div className="p-8 rounded-2xl border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 relative group">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Family</h3>
              <p className="text-gray-600 mb-6">Best for families up to 4 members</p>
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">$79</span>
                  <span className="text-gray-600 ml-2">/month</span>
                  <span className="bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded-full ml-2">
                    Save $40
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-through">$119/month</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span>Everything in Individual</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span>Up to 4 family members</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span>Family health dashboard</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span>Emergency response</span>
                </li>
              </ul>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg group-hover:scale-105 transform duration-200">
                Get Started
              </button>
            </div>

            <div className="p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 relative group">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Extended Family</h3>
              <p className="text-gray-600 mb-6">For larger families and seniors</p>
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">$149</span>
                  <span className="text-gray-600 ml-2">/month</span>
                  <span className="bg-green-100 text-green-800 text-sm font-semibold px-2 py-1 rounded-full ml-2">
                    Save $75
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-through">$224/month</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span>Everything in Family</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span>Up to 8 family members</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span>Senior care specialists</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span>Home health visits</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span>Dedicated care manager</span>
                </li>
              </ul>
              <button className="w-full bg-gray-900 text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors group-hover:scale-105 transform duration-200">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by 50,000+ Families Nationwide
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              See what our customers are saying about their CareBow experience
            </p>
            
            {/* Social Proof Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
                <div className="text-gray-600">Happy Families</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">4.9/5</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-gray-600">Expert Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={20} />
                ))}
              </div>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                "CareBow's AI caught my daughter's early symptoms that I missed. 
                The 24/7 support and personalized care plans have been life-changing. 
                We feel so much more confident about our family's health."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">SM</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Sarah Martinez</p>
                  <p className="text-gray-600">Mother of 3, Austin TX</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={20} />
                ))}
              </div>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                "The AI insights are incredibly accurate. It helped us identify 
                my son's allergies before they became serious. The family dashboard 
                keeps everyone's health organized and accessible."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">DJ</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">David Johnson</p>
                  <p className="text-gray-600">Father of 2, Seattle WA</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={20} />
                ))}
              </div>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                "As a senior, having round-the-clock access to healthcare professionals 
                and medication management has improved my quality of life significantly. 
                The care team is incredibly compassionate and knowledgeable."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">EW</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Evelyn Williams</p>
                  <p className="text-gray-600">Senior Care, Miami FL</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={20} />
                ))}
              </div>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                "The emergency response feature saved my husband's life. The AI 
                immediately recognized the signs of a heart attack and connected 
                us with emergency services. We're forever grateful to CareBow."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">MR</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Maria Rodriguez</p>
                  <p className="text-gray-600">Caregiver, Phoenix AZ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section id="waitlist" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Family's Health?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of families already experiencing the future of healthcare. 
            Get early access and exclusive launch pricing.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto" aria-label="Join CareBow waitlist">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-full border-0 text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-white/30 text-lg"
                required
                aria-label="Email address"
                aria-describedby="email-help"
              />
              <button
                type="submit"
                disabled={isLoading || isSubmitted}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-xl"
                aria-label={isLoading ? "Submitting email" : isSubmitted ? "Email submitted successfully" : "Submit email for early access"}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent mr-2" aria-hidden="true"></div>
                    Joining...
                  </>
                ) : isSubmitted ? (
                  'Welcome to CareBow!'
                ) : (
                  'Get Early Access'
                )}
              </button>
            </div>
            <div id="email-help" className="sr-only">
              Enter your email address to join the CareBow waitlist and get early access to our AI-powered healthcare platform.
            </div>
          </form>
          
          <p className="text-blue-200 text-sm mt-6">
            No spam, ever. Unsubscribe at any time. Early access pricing available for limited time.
          </p>
        </div>
      </section>

      {/* Footer */}
      <Suspense fallback={
        <div className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-32 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-64 mx-auto"></div>
            </div>
          </div>
        </div>
      }>
        <Footer />
      </Suspense>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-50 transform hover:scale-110"
          aria-label="Scroll to top of page"
          title="Scroll to top"
        >
          <ChevronUp size={20} aria-hidden="true" />
        </button>
      )}

      {/* Vercel Analytics */}
      <Analytics />
      
      {/* Vercel Speed Insights */}
      <SpeedInsights />
    </div>
  );
};

export default CareBowLanding;