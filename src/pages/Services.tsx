
'use client'

import React from "react";
import { Heart, Hospital, Baby, Shield, Clock, Phone, MapPin, Star, CheckCircle, ArrowRight, Stethoscope, Activity, UserCheck, Pill, Thermometer, Brain } from "lucide-react";

export const dynamic = 'force-dynamic';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import SEO from "../components/SEO";
import Navbar from "../components/UnifiedNavigation";
import Footer from "../components/UnifiedFooter";

const Services = () => {
  const services = [
    {
      icon: <Heart className="h-12 w-12 text-white" />,
      title: "Elder Care at Home",
      description: "Compassionate caregivers for companionship, hygiene, medication, and mobility support with 24/7 monitoring.",
      gradient: "from-red-500 to-pink-600",
      features: ["Medication Management", "Mobility Assistance", "Companionship", "Health Monitoring", "Personal Care", "Emergency Response"],
      price: "Starting from $30/day",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=2069"
    },
    {
      icon: <Hospital className="h-12 w-12 text-white" />,
      title: "Post-Surgery Recovery",
      description: "Skilled nursing, wound care, and therapy services delivered safely in your home environment.",
      gradient: "from-blue-500 to-cyan-600",
      features: ["Wound Care", "Physical Therapy", "Medication Administration", "Recovery Monitoring", "Equipment Setup", "Family Training"],
      price: "Starting from $36/day",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=2070"
    },
    {
      icon: <Baby className="h-12 w-12 text-white" />,
      title: "Pediatric Home Care",
      description: "Specialized child-friendly health services with trained pediatric healthcare professionals.",
      gradient: "from-green-500 to-emerald-600",
      features: ["Child-Safe Protocols", "Pediatric Specialists", "Family Education", "Growth Monitoring", "Vaccination Tracking", "Development Assessment"],
      price: "Starting from $22/visit",
      image: "https://images.unsplash.com/photo-1631947430066-48c30d57b943?q=80&w=2132"
    },
    {
      icon: <Stethoscope className="h-12 w-12 text-white" />,
      title: "AI Teleconsult",
      description: "Instant AI-backed health assessments plus immediate access to certified medical professionals.",
      gradient: "from-purple-500 to-violet-600",
      features: ["AI Symptom Analysis", "Doctor Consultations", "Prescription Management", "Health Records", "Follow-up Care", "Lab Test Coordination"],
      price: "Starting from $4/consultation",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2069"
    },
    {
      icon: <Activity className="h-12 w-12 text-white" />,
      title: "Urgent Care",
      description: "Rapid-response home visits and online consultations for acute health concerns and emergencies.",
      gradient: "from-purple-500 to-blue-600",
      features: ["24/7 Availability", "Emergency Response", "Rapid Diagnosis", "Immediate Treatment", "Ambulance Coordination", "Hospital Referrals"],
      price: "Starting from $18/visit",
      image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=2070"
    },
    {
      icon: <Shield className="h-12 w-12 text-white" />,
      title: "Wellness & Prevention",
      description: "Proactive health guidance, natural treatments, and lifestyle coaching for optimal wellbeing.",
      gradient: "from-teal-500 to-green-600",
      features: ["Health Coaching", "Nutrition Guidance", "Fitness Planning", "Preventive Care", "Mental Health Support", "Lifestyle Counseling"],
      price: "Starting from $12/month",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2099"
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "CareBow Healthcare Services",
    "description": "Comprehensive in-home healthcare services including elder care, pediatric care, post-surgery recovery, teleconsults, urgent care, and wellness programs.",
    "provider": {
      "@type": "Organization",
      "name": "CareBow"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Healthcare Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Elder Care at Home",
            "description": "Comprehensive elder care services at home"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Pediatric Home Care",
            "description": "Specialized healthcare for children at home"
          }
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Healthcare Services | CareBow In-Home Care USA"
        description="Discover CareBow's comprehensive healthcare services: elder care, pediatric care, post-surgery recovery, AI teleconsults, urgent care, and wellness programs. Professional in-home medical care across the USA."
        keywords="healthcare services, elder care services, pediatric home care, post-surgery recovery care, teleconsult services, urgent care at home, wellness programs, in-home nursing, medication management, health monitoring services, Pittsburgh healthcare, USA home healthcare"
        url="https://www.carebow.com/services"
        structuredData={structuredData}
      />
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-8"
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900">
                Our 
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Healthcare Services
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive healthcare solutions delivered with compassion and cutting-edge technology, 
                right to your doorstep across the United States.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <CardHeader className="p-0">
                      <div className="relative h-48">
                        <img 
                          src={service.image} 
                          alt={`${service.title} - Professional healthcare service at home`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className={`absolute top-4 left-4 p-3 rounded-xl bg-gradient-to-r ${service.gradient}`}>
                          {service.icon}
                        </div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <span className="text-lg font-bold">{service.price}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                          {service.title}
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        className={`w-full bg-gradient-to-r ${service.gradient} hover:opacity-90 text-white`}
                        asChild
                      >
                        <a href="#waitlist">Book Now</a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8 text-white"
            >
              <h2 className="text-4xl lg:text-5xl font-bold">
                Ready to Experience CareBow?
              </h2>
              <p className="text-xl opacity-90">
                Join thousands of families who trust CareBow for their healthcare needs. 
                Get started today with a free consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 h-14 px-8"
                  asChild
                >
                  <a href="#waitlist">Join Waitlist</a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/20 hover:text-white h-14 px-8"
                  asChild
                >
                  <a href="https://cal.com/carebow/30min" target="_blank" rel="noopener noreferrer">
                    Book Demo Walkthrough
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;
