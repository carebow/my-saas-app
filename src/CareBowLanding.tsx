import React, { useState } from 'react';
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
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const CareBowLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call - replace with actual form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add your form submission logic here (Supabase, Make.com, etc.)
      console.log('Email submitted:', email);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      
      // Reset form
      setEmail('');
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add scroll listener for scroll-to-top button
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-indigo-600">CareBow</h1>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button 
                  onClick={() => scrollToSection('how')}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Services
                </button>
                <button 
                  onClick={() => scrollToSection('compare')}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Compare
                </button>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  FAQ
                </button>
                <button 
                  onClick={() => scrollToSection('waitlist')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Join Waitlist
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-indigo-600 p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => scrollToSection('how')}
                className="block w-full text-left text-gray-700 hover:text-indigo-600 px-3 py-2 text-base font-medium"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="block w-full text-left text-gray-700 hover:text-indigo-600 px-3 py-2 text-base font-medium"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('compare')}
                className="block w-full text-left text-gray-700 hover:text-indigo-600 px-3 py-2 text-base font-medium"
              >
                Compare
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="block w-full text-left text-gray-700 hover:text-indigo-600 px-3 py-2 text-base font-medium"
              >
                FAQ
              </button>
              <button 
                onClick={() => scrollToSection('waitlist')}
                className="block w-full text-left bg-indigo-600 text-white px-3 py-2 rounded-lg text-base font-medium hover:bg-indigo-700 mx-3"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Your Family's
              <span className="text-indigo-600"> Healthcare Journey</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Comprehensive, personalized healthcare services designed for modern families. 
              Get expert medical guidance, 24/7 support, and peace of mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => scrollToSection('waitlist')}
                className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                Join the Waitlist
                <ArrowRight className="ml-2" size={20} />
              </button>
              <button 
                onClick={() => scrollToSection('how')}
                className="border border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-6">Trusted by thousands of families</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="flex items-center space-x-2">
                <Star className="text-yellow-400" size={20} />
                <span className="text-gray-700 font-semibold">4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="text-indigo-600" size={20} />
                <span className="text-gray-700 font-semibold">10,000+ Families</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="text-green-600" size={20} />
                <span className="text-gray-700 font-semibold">HIPAA Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Families Are Saying
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from families who trust CareBow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400" size={20} />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "CareBow has transformed how we manage our family's health. The 24/7 support 
                gives us peace of mind, and the AI insights help us stay proactive about our health."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-semibold">SM</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sarah Martinez</p>
                  <p className="text-sm text-gray-600">Mother of 3</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400" size={20} />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The personalized care plans and family health tracking have been game-changers. 
                We finally feel in control of our health journey."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-semibold">DJ</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">David Johnson</p>
                  <p className="text-sm text-gray-600">Father of 2</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400" size={20} />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "As a senior, having round-the-clock access to healthcare professionals 
                and medication management has improved my quality of life significantly."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-semibold">EW</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Evelyn Williams</p>
                  <p className="text-sm text-gray-600">Senior Care</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How CareBow Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, effective healthcare management in three easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Connect</h3>
              <p className="text-gray-600">
                Sign up and connect with our healthcare team. Share your family's medical history and current needs.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Get Care</h3>
              <p className="text-gray-600">
                Receive personalized healthcare plans, 24/7 support, and access to our network of medical professionals.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Thrive</h3>
              <p className="text-gray-600">
                Watch your family's health improve with ongoing monitoring, preventive care, and expert guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Healthcare Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything your family needs for optimal health and wellness
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Family Health Plans</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive health management for every family member, from children to seniors.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Preventive care scheduling</li>
                <li>• Health risk assessments</li>
                <li>• Family health tracking</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600 mb-4">
                Round-the-clock access to healthcare professionals and emergency support.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Emergency consultations</li>
                <li>• Health question hotline</li>
                <li>• Medication guidance</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Brain className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600 mb-4">
                Advanced analytics and personalized recommendations for better health outcomes.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Health trend analysis</li>
                <li>• Personalized recommendations</li>
                <li>• Early warning systems</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="compare" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CareBow?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how we compare to traditional healthcare options
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-indigo-600">CareBow</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-600">Traditional Healthcare</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6 text-gray-900">24/7 Access</td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="text-green-600 mx-auto" size={20} />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <X className="text-red-500 mx-auto" size={20} />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-900">Family Plans</td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="text-green-600 mx-auto" size={20} />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <X className="text-red-500 mx-auto" size={20} />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-900">AI Insights</td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="text-green-600 mx-auto" size={20} />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <X className="text-red-500 mx-auto" size={20} />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-900">Preventive Care</td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="text-green-600 mx-auto" size={20} />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="text-green-600 mx-auto" size={20} />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-900">Cost Transparency</td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="text-green-600 mx-auto" size={20} />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <X className="text-red-500 mx-auto" size={20} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about CareBow
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How does CareBow differ from traditional healthcare?
              </h3>
              <p className="text-gray-600">
                CareBow provides 24/7 access to healthcare professionals, AI-powered health insights, 
                and comprehensive family health management that goes beyond traditional doctor visits.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is my health information secure?
              </h3>
              <p className="text-gray-600">
                Yes, we are fully HIPAA compliant and use enterprise-grade security to protect your 
                family's health information. Your privacy is our top priority.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What services are included in the family plan?
              </h3>
              <p className="text-gray-600">
                Our family plan includes 24/7 healthcare support, preventive care scheduling, 
                health risk assessments, AI-powered insights, and access to our network of medical professionals.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                When will CareBow be available?
              </h3>
              <p className="text-gray-600">
                We're currently in development and will be launching soon. Join our waitlist to be 
                among the first to experience the future of family healthcare.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section id="waitlist" className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Family's Health?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of families already on the waitlist for early access to CareBow.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-300"
                required
              />
              <button
                type="submit"
                disabled={isLoading || isSubmitted}
                className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent mr-2"></div>
                    Joining...
                  </>
                ) : isSubmitted ? (
                  'Thank You!'
                ) : (
                  'Join Waitlist'
                )}
              </button>
            </div>
          </form>
          
          <p className="text-indigo-200 text-sm mt-4">
            No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-indigo-400 mb-4">CareBow</h3>
              <p className="text-gray-400">
                Transforming family healthcare with technology, compassion, and innovation.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Family Health Plans</li>
                <li>24/7 Support</li>
                <li>AI-Powered Insights</li>
                <li>Preventive Care</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Mail className="mr-2" size={16} />
                  hello@carebow.com
                </li>
                <li className="flex items-center">
                  <Phone className="mr-2" size={16} />
                  (555) 123-4567
                </li>
                <li className="flex items-center">
                  <MapPin className="mr-2" size={16} />
                  San Francisco, CA
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CareBow. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  );
};

export default CareBowLanding;
