'use client'

import Navbar from "../components/UnifiedNavigation";

export const dynamic = 'force-dynamic';
import Footer from "../components/UnifiedFooter";
import SEO from "../components/SEO";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { motion } from "framer-motion";
import { Heart, Clock, Shield, Users, ArrowRight, CheckCircle } from "lucide-react";

const DiabetesHomeCare = () => {
  const scrollToWaitlist = () => {
    window.location.href = '/#waitlist';
  };

  const careServices = [
    {
      title: "Blood Sugar Monitoring",
      description: "AI-powered continuous glucose monitoring with real-time alerts to family members",
      icon: Heart
    },
    {
      title: "Medication Management", 
      description: "Smart medication reminders and insulin administration support",
      icon: Clock
    },
    {
      title: "Nutritional Guidance",
      description: "Personalized meal planning and dietary counseling from certified nutritionists",
      icon: Shield
    },
    {
      title: "Lifestyle Coaching",
      description: "Exercise planning, stress management, and daily routine optimization",
      icon: Users
    }
  ];

  const benefits = [
    "Reduce hospital visits by up to 60%",
    "24/7 monitoring and family alerts",
    "Personalized care plans by certified professionals",
    "Medicare and insurance billing support",
    "Emergency response within 3 minutes"
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Diabetes Home Care Services in Pittsburgh, PA | CareBow"
        description="Expert diabetes management at home in Pittsburgh. AI-powered monitoring, certified caregivers, and 24/7 support for Type 1 & Type 2 diabetes. Coming soon - join our waitlist."
        keywords="diabetes home care Pittsburgh, blood sugar monitoring, diabetes management, home healthcare Pittsburgh, Type 1 diabetes care, Type 2 diabetes support"
        url="https://www.carebow.com/diabetes-home-care"
      />
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-carebow-blue/10 to-carebow-mint/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Badge className="mb-4 bg-carebow-secondary/20 text-carebow-secondary">
                  Diabetes Care Specialists
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-carebow-text-dark mb-6">
                  Expert Diabetes Care at Home in{" "}
                  <span className="bg-gradient-to-r from-carebow-primary to-carebow-secondary bg-clip-text text-transparent">
                    Pittsburgh
                  </span>
                </h1>
                <p className="text-xl text-carebow-text-medium mb-8 leading-relaxed">
                  Comprehensive diabetes management with AI-powered monitoring, certified caregivers, 
                  and 24/7 family support. Better outcomes, lower costs, comfort of home.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-carebow-primary to-carebow-secondary hover:from-carebow-primary/90 hover:to-carebow-secondary/90 text-white"
                    onClick={scrollToWaitlist}
                  >
                    Get Early Access <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg" 
                    className="border-carebow-primary text-carebow-primary hover:bg-carebow-blue/20"
                    asChild
                  >
                    <a href="https://cal.com/carebow/30min" target="_blank" rel="noopener noreferrer">
                      Book Consultation
                    </a>
                  </Button>
                </div>

                <div className="bg-white/80 rounded-xl p-4 border border-carebow-blue/20">
                  <div className="text-sm text-carebow-text-medium mb-2">
                    <span className="font-semibold text-carebow-secondary">Coming Soon</span> - Join 3,000+ families on our waitlist
                  </div>
                  <div className="text-xs text-carebow-text-light">
                    📍 Initially serving Pittsburgh, PA metro area
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:pl-8"
              >
                <Card className="border-2 border-carebow-blue/20 shadow-2xl">
                  <CardHeader className="bg-gradient-to-r from-carebow-blue/5 to-carebow-mint/5">
                    <CardTitle className="text-xl text-carebow-text-dark">
                      Why Choose Home Diabetes Care?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-carebow-secondary mt-0.5 flex-shrink-0" />
                          <span className="text-carebow-text-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-carebow-text-dark mb-4">
                Comprehensive Diabetes Management Services
              </h2>
              <p className="text-xl text-carebow-text-medium max-w-3xl mx-auto">
                Our certified diabetes educators and nurses provide personalized care plans 
                tailored to your unique needs and lifestyle.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {careServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full border-carebow-blue/20 hover:border-carebow-primary/30 transition-colors">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-carebow-blue/20 to-carebow-mint/20 rounded-xl flex items-center justify-center">
                        <service.icon className="w-6 h-6 text-carebow-primary" />
                      </div>
                      <h3 className="font-bold text-carebow-text-dark mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm text-carebow-text-medium">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Cost Comparison */}
        <section className="py-16 bg-gradient-to-r from-carebow-blue/5 to-carebow-mint/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-carebow-text-dark mb-4">
                Affordable Diabetes Care
              </h2>
              <p className="text-xl text-carebow-text-medium">
                Compare the costs: Home care vs. traditional hospital-based management
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-2 border-red-200">
                <CardHeader className="bg-red-50">
                  <CardTitle className="text-xl text-red-800">Traditional Care</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Monthly clinic visits</span>
                      <span className="font-semibold">$300-500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Emergency room visits</span>
                      <span className="font-semibold">$1,500-3,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transportation costs</span>
                      <span className="font-semibold">$100-200</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-3">
                      <span>Average monthly cost</span>
                      <span className="text-red-600">$1,900-3,700</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-carebow-primary">
                <CardHeader className="bg-carebow-blue/10">
                  <CardTitle className="text-xl text-carebow-primary">CareBow Home Care</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>24/7 monitoring</span>
                      <span className="font-semibold">$200-300</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekly nurse visits</span>
                      <span className="font-semibold">$400-600</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Family coordination</span>
                      <span className="font-semibold">Included</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-3">
                      <span>Average monthly cost</span>
                      <span className="text-carebow-primary">$600-900</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-carebow-mint/20 rounded-lg">
                    <div className="text-sm font-semibold text-carebow-secondary">
                      Save up to 70% with better outcomes
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Badge className="bg-carebow-secondary/20 text-carebow-secondary">
                Insurance Coverage Available • Medicare Accepted
              </Badge>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-carebow-text-dark mb-6">
              Ready to Transform Your Diabetes Management?
            </h2>
            <p className="text-xl text-carebow-text-medium mb-8">
              Join thousands of families who are waiting for CareBow's launch. 
              Be among the first to experience the future of diabetes care at home.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-carebow-primary to-carebow-secondary hover:from-carebow-primary/90 hover:to-carebow-secondary/90 text-white px-8 py-4 text-lg"
              onClick={scrollToWaitlist}
            >
              Join Our Waitlist <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <div className="mt-4 text-sm text-carebow-text-light">
              🔥 Limited early access spots • 50% off first month for waitlist members
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DiabetesHomeCare;