
import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import SEO from "../components/SEO";
import Navbar from "../components/UnifiedNavigation";
import Footer from "../components/UnifiedFooter";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

const Contact = () => {
  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Support",
      details: "(412) 735-1957",
      subtitle: "24/7 Emergency Hotline"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      details: "info@carebow.com",
      subtitle: "We reply within 2 hours"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Head Office",
      details: "Pittsburgh, PA, USA",
      subtitle: "Remote Team Worldwide"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Operating Hours",
      details: "24/7 Care Available",
      subtitle: "Support: 9 AM - 9 PM EST"
    }
  ];

  const locations = [
    { city: "Pittsburgh", address: "Downtown Pittsburgh, PA", services: "All Services Available" },
    { city: "Philadelphia", address: "Center City, Philadelphia, PA", services: "All Services Available" },
    { city: "New York", address: "Manhattan, New York, NY", services: "All Services Available" },
    { city: "Boston", address: "Back Bay, Boston, MA", services: "All Services Available" },
    { city: "Washington DC", address: "Capitol Hill, Washington, DC", services: "All Services Available" },
    { city: "Chicago", address: "Downtown Chicago, IL", services: "All Services Available" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Contact CareBow | Get In-Home Healthcare Services | Pittsburgh PA"
        description="Contact CareBow for AI-powered in-home healthcare services in Pittsburgh, PA and nationwide. Call (412) 735-1957 for personalized medical care at home."
        keywords="contact CareBow, Pittsburgh healthcare, in-home care contact, healthcare services Pittsburgh, medical care contact, healthcare consultation, join waitlist, healthcare inquiry"
        url="https://www.carebow.com/contact"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "CareBow",
          "description": "AI-powered in-home healthcare services providing personalized medical care, elder care, pediatric care, and 24/7 health monitoring",
          "url": "https://www.carebow.com",
          "telephone": "+14127351957",
          "email": "info@carebow.com",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Pittsburgh",
            "addressRegion": "PA",
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "40.4406",
            "longitude": "-79.9959"
          },
          "openingHours": "Mo-Su 00:00-23:59",
          "areaServed": [
            {
              "@type": "City",
              "name": "Pittsburgh",
              "addressRegion": "PA"
            },
            {
              "@type": "Country",
              "name": "United States"
            }
          ],
          "serviceType": "Healthcare Services",
          "medicalSpecialty": ["Home Healthcare", "Elder Care", "Pediatric Care", "Telemedicine"],
          "priceRange": "$$",
          "sameAs": [
            "https://twitter.com/carebow",
            "https://linkedin.com/company/carebow",
            "https://instagram.com/care.bow"
          ]
        }}
      />
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-8"
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900">
                Contact 
                <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  CareBow
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're here to help 24/7. Reach out to us for healthcare support, 
                questions about our services, or emergency assistance across the USA. 
                Our AI-powered in-home healthcare network provides personalized medical care, 
                elder care, pediatric services, and comprehensive health monitoring delivered 
                directly to your home in Pittsburgh, PA and nationwide.
              </p>
              <div className="mt-8 bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose CareBow for Your Healthcare Needs?</h2>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h3 className="font-semibold text-purple-600 mb-2">🏥 Comprehensive Healthcare Services</h3>
                    <p className="text-gray-600">Our in-home healthcare services include elder care, pediatric care, post-surgery recovery, chronic disease management, medication management, and 24/7 health monitoring.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-600 mb-2">🤖 AI-Powered Technology</h3>
                    <p className="text-gray-600">Advanced AI healthcare technology provides instant health assessments, medication reminders, symptom analysis, and connects you with certified medical professionals when needed.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-600 mb-2">👩‍⚕️ Licensed Healthcare Professionals</h3>
                    <p className="text-gray-600">Our team includes registered nurses, certified nursing assistants, physical therapists, occupational therapists, and board-certified physicians - all thoroughly vetted and licensed.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-600 mb-2">🔒 HIPAA Compliant & Secure</h3>
                    <p className="text-gray-600">Full HIPAA compliance with enterprise-grade security measures, industry-standard encryption, secure data transmission, and strict access controls protect your health information.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full text-center hover:shadow-xl transition-all duration-300 bg-white border border-slate-200">
                    <CardContent className="p-8 space-y-4">
                      <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        {info.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {info.title}
                      </h3>
                      <p className="text-lg font-semibold text-purple-600">
                        {info.details}
                      </p>
                      <p className="text-gray-600">
                        {info.subtitle}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Contact Form and Info */}
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Card className="shadow-xl bg-white border border-slate-200">
                  <CardHeader>
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                      <MessageCircle className="w-8 h-8 mr-3 text-purple-600" />
                      Send Us a Message
                    </h2>
                    <p className="text-gray-600">
                      Fill out the form below and we'll get back to you within 2 hours.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-black font-medium">First Name</Label>
                        <Input id="firstName" placeholder="Enter your first name" className="form-field" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-black font-medium">Last Name</Label>
                        <Input id="lastName" placeholder="Enter your last name" className="form-field" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-black font-medium">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" className="form-field" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-black font-medium">Phone Number</Label>
                      <Input id="phone" placeholder="Enter your phone number" className="form-field" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-black font-medium">Subject</Label>
                      <Input id="subject" placeholder="How can we help you?" className="form-field" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-black font-medium">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Tell us more about your healthcare needs..."
                        rows={6}
                        className="form-field"
                      />
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Emergency Care
                  </h3>
                  <p className="text-gray-600 mb-4">
                    For medical emergencies, call our 24/7 hotline immediately. 
                    Our rapid response team can reach you within 30 minutes in major US cities.
                  </p>
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white"
                    asChild
                  >
                    <a href="tel:+14127351957">Call Emergency Line</a>
                  </Button>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Business Inquiries
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Interested in partnering with CareBow or joining our network of healthcare providers? 
                    We'd love to hear from you.
                  </p>
                  <Button 
                    variant="outline"
                    className="border-purple-600 text-purple-600 hover:bg-purple-50"
                    asChild
                  >
                    <a href="mailto:info@carebow.com">Contact Partnerships</a>
                  </Button>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Remote Careers
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Join our mission to revolutionize healthcare worldwide. 
                    We hire remotely from all around the globe - passionate healthcare professionals and technologists welcome!
                  </p>
                  <Button 
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                    asChild
                  >
                    <a href="/careers">View Remote Positions</a>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Locations Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                We're Across the USA
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                CareBow services are available in major cities across the United States, 
                with plans to expand to more locations soon.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {locations.map((location, index) => (
                <motion.div
                  key={location.city}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 bg-white border border-slate-200">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {location.city}
                      </h3>
                      <p className="text-gray-600">
                        {location.address}
                      </p>
                      <p className="text-purple-600 font-medium">
                        {location.services}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get answers to common questions about CareBow's in-home healthcare services, 
                AI technology, and how we can help with your family's medical care needs.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">How quickly can I get CareBow healthcare services?</h3>
                  <p className="text-gray-600">AI consultations are available instantly 24/7. For in-home visits, we typically schedule within 24-48 hours for routine care and provide same-day service for urgent healthcare needs in Pittsburgh, PA and other major cities.</p>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">What types of in-home healthcare services does CareBow provide?</h3>
                  <p className="text-gray-600">CareBow offers comprehensive in-home healthcare including elder care, pediatric care, post-surgery recovery, chronic disease management, medication management, urgent care, wellness services, and 24/7 health monitoring with family updates.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Is CareBow available in my area?</h3>
                  <p className="text-gray-600">CareBow currently serves Pittsburgh, PA and is rapidly expanding nationwide across the United States including Philadelphia, New York, Boston, Washington DC, and Chicago. Join our waitlist to be notified when we launch in your area.</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">How does CareBow's AI-powered healthcare technology work?</h3>
                  <p className="text-gray-600">Our AI healthcare technology provides instant health assessments, medication reminders, symptom analysis, and health monitoring. It connects you with certified medical professionals when needed while maintaining continuous health tracking and the human touch in healthcare delivery.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">What healthcare professionals work with CareBow?</h3>
                  <p className="text-gray-600">CareBow works with licensed registered nurses, certified nursing assistants, physical therapists, occupational therapists, speech therapists, and board-certified physicians. All our healthcare professionals are thoroughly vetted, licensed, and experienced in home healthcare delivery.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Is CareBow HIPAA compliant and secure?</h3>
                  <p className="text-gray-600">Yes, CareBow is fully HIPAA compliant with enterprise-grade security measures. We prioritize your privacy and ensure all health information is protected with industry-standard encryption, secure data transmission, and strict access controls for your medical data.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
