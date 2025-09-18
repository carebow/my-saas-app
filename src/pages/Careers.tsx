
'use client'

import React from "react";

export const dynamic = 'force-dynamic';
import { Heart, TrendingUp, Users, Briefcase, MapPin, Clock, DollarSign, Shield, Zap, CheckCircle, ArrowRight, Star, Award, Globe, Code, Stethoscope, Brain, Phone, Mail, Calendar } from "lucide-react";
import SEO from "../components/SEO";
import Navbar from "../components/UnifiedNavigation";
import Footer from "../components/UnifiedFooter";

const Careers = () => {
  const benefits = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Healthcare Impact",
      description: "Make a real difference in people's lives by improving healthcare accessibility."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Growth Opportunities",
      description: "Fast-growing startup with unlimited potential for career advancement."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Amazing Team",
      description: "Work with passionate healthcare professionals and tech experts."
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Flexible Work",
      description: "Remote-first culture with flexible working arrangements."
    }
  ];

  const openPositions = [
    {
      title: "Senior Full-Stack Developer",
      department: "Engineering",
      location: "Bangalore / Remote",
      type: "Full-time",
      experience: "4+ years",
      description: "Build scalable healthcare platforms using React, Node.js, and cloud technologies.",
      skills: ["React", "Node.js", "TypeScript", "AWS", "Healthcare APIs"]
    },
    {
      title: "AI/ML Engineer",
      department: "AI & Data",
      location: "Bangalore / Remote",
      type: "Full-time",
      experience: "3+ years",
      description: "Develop AI models for symptom analysis and care recommendations.",
      skills: ["Python", "TensorFlow", "NLP", "Healthcare AI", "MLOps"]
    },
    {
      title: "Clinical Operations Manager",
      department: "Healthcare",
      location: "Mumbai",
      type: "Full-time",
      experience: "5+ years",
      description: "Lead clinical operations and ensure quality standards across all care services.",
      skills: ["Clinical Management", "Quality Assurance", "Healthcare Compliance", "Team Leadership"]
    },
    {
      title: "Product Manager - Healthcare",
      department: "Product",
      location: "Bangalore",
      type: "Full-time",
      experience: "4+ years",
      description: "Drive product strategy for healthcare services and patient experience.",
      skills: ["Product Strategy", "Healthcare Domain", "User Research", "Data Analysis"]
    },
    {
      title: "Registered Nurse - Home Care",
      department: "Clinical",
      location: "Multiple Cities",
      type: "Full-time / Part-time",
      experience: "2+ years",
      description: "Provide high-quality nursing care in patients' homes across various specialties.",
      skills: ["Clinical Nursing", "Home Healthcare", "Patient Care", "Medical Documentation"]
    },
    {
      title: "Customer Success Manager",
      department: "Operations",
      location: "Delhi / Remote",
      type: "Full-time",
      experience: "3+ years",
      description: "Ensure excellent patient and family experiences throughout their healthcare journey.",
      skills: ["Customer Success", "Healthcare Operations", "Communication", "Problem Solving"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-8"
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900">
                Join Our 
                <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Healthcare Mission
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Be part of a revolutionary team that's transforming healthcare delivery in India. 
                Make an impact while building your career with us.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white h-14 px-8"
                asChild
              >
                <a href="#open-positions">View Open Positions</a>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Why Choose CareBow?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join a company that values innovation, compassion, and making a real difference 
                in people's lives through technology and healthcare excellence.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full text-center hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-8 space-y-4">
                      <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 text-white">
                        {benefit.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Culture */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-white"
              >
                <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                  Our Culture
                </h2>
                <p className="text-xl mb-8 leading-relaxed opacity-90">
                  At CareBow, we believe in fostering an environment where innovation thrives, 
                  diversity is celebrated, and every team member can make meaningful contributions 
                  to revolutionizing healthcare.
                </p>
                <div className="space-y-4">
                  {[
                    "Remote-first with flexible working hours",
                    "Comprehensive health insurance for you and family",
                    "Learning & development budget",
                    "Stock options and competitive salary",
                    "Mental health and wellness support",
                    "Opportunity to directly impact healthcare"
                  ].map((perk, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-4"></div>
                      <span className="opacity-90">{perk}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071"
                  alt="Team Culture" 
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-green-900/20 via-transparent to-transparent"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="open-positions" className="py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Open Positions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore exciting career opportunities across engineering, healthcare, 
                product, and operations teams.
              </p>
            </motion.div>

            <div className="space-y-6">
              {openPositions.map((position, index) => (
                <motion.div
                  key={position.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-4">
                            <h3 className="text-2xl font-bold text-gray-900">
                              {position.title}
                            </h3>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              {position.department}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-6 text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {position.location}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {position.type}
                            </div>
                            <div className="flex items-center">
                              <Briefcase className="w-4 h-4 mr-2" />
                              {position.experience}
                            </div>
                          </div>
                          
                          <p className="text-gray-600 leading-relaxed">
                            {position.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            {position.skills.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="outline" className="text-green-600 border-green-200">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="lg:ml-8">
                          <Button 
                            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white w-full lg:w-auto"
                            asChild
                          >
                            <a href="mailto:careers@carebow.com?subject=Application for {position.title}">
                              Apply Now
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                Don't See Your Role?
              </h2>
              <p className="text-xl text-gray-600">
                We're always looking for exceptional talent. Send us your resume 
                and tell us how you'd like to contribute to our mission.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white h-14 px-8"
                asChild
              >
                <a href="mailto:careers@carebow.com">Send Us Your Resume</a>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Careers;
