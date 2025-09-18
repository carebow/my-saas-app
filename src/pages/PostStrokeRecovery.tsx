'use client'

import Navbar from "../components/UnifiedNavigation";

export const dynamic = 'force-dynamic';
import Footer from "../components/UnifiedFooter";
import SEO from "../components/SEO";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { motion } from "framer-motion";
import { Brain, Activity, Home, Users, ArrowRight, CheckCircle, Clock } from "lucide-react";

const PostStrokeRecovery = () => {
  const scrollToWaitlist = () => {
    window.location.href = '/#waitlist';
  };

  const recoveryServices = [
    {
      title: "Physical Therapy",
      description: "Licensed physical therapists provide personalized rehabilitation exercises and mobility training",
      icon: Activity
    },
    {
      title: "Speech Therapy",
      description: "Certified speech-language pathologists help restore communication and swallowing abilities",
      icon: Brain
    },
    {
      title: "Occupational Therapy",
      description: "Relearn daily activities and adapt your home environment for maximum independence",
      icon: Home
    },
    {
      title: "Family Support",
      description: "Caregiver training and emotional support for the entire family throughout recovery",
      icon: Users
    }
  ];

  const recoveryPhases = [
    {
      phase: "Acute Phase (0-3 months)",
      focus: "Medical stability, basic care, preventing complications",
      services: ["24/7 monitoring", "Medication management", "Basic mobility support"]
    },
    {
      phase: "Sub-acute Phase (3-12 months)",
      focus: "Intensive rehabilitation, skill rebuilding, family training", 
      services: ["Daily therapy sessions", "Cognitive exercises", "Family education"]
    },
    {
      phase: "Chronic Phase (12+ months)",
      focus: "Long-term maintenance, community reintegration, quality of life",
      services: ["Maintenance therapy", "Social activities", "Health monitoring"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Post-Stroke Recovery at Home | Pittsburgh Stroke Care | CareBow"
        description="Comprehensive stroke recovery care at home in Pittsburgh. Physical therapy, speech therapy, and 24/7 monitoring. Better outcomes in familiar surroundings. Join our waitlist."
        keywords="stroke recovery Pittsburgh, post stroke care, stroke rehabilitation at home, speech therapy, physical therapy, stroke care Pittsburgh, home healthcare stroke"
        url="https://www.carebow.com/post-stroke-recovery"
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
                  Stroke Recovery Specialists
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-carebow-text-dark mb-6">
                  Comprehensive Stroke Recovery at{" "}
                  <span className="bg-gradient-to-r from-carebow-primary to-carebow-secondary bg-clip-text text-transparent">
                    Home
                  </span>
                </h1>
                <p className="text-xl text-carebow-text-medium mb-8 leading-relaxed">
                  Accelerate your recovery journey with expert stroke rehabilitation services 
                  delivered in the comfort and familiarity of your own home in Pittsburgh.
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
                      Schedule Assessment
                    </a>
                  </Button>
                </div>

                <div className="bg-white/80 rounded-xl p-4 border border-carebow-blue/20">
                  <div className="flex items-center gap-2 text-sm text-carebow-text-medium mb-2">
                    <Clock className="w-4 h-4 text-carebow-secondary" />
                    <span className="font-semibold text-carebow-secondary">Recovery starts faster at home</span>
                  </div>
                  <div className="text-xs text-carebow-text-light">
                    Studies show 40% better outcomes with familiar environment recovery
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
                      Why Home-Based Stroke Recovery?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-carebow-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-carebow-text-medium">Familiar environment reduces stress and anxiety</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-carebow-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-carebow-text-medium">Family involvement in recovery process</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-carebow-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-carebow-text-medium">Personalized therapy in real-world settings</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-carebow-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-carebow-text-medium">Reduced risk of hospital-acquired infections</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-carebow-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-carebow-text-medium">Flexible scheduling around your needs</span>
                      </div>
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
                Comprehensive Stroke Recovery Services
              </h2>
              <p className="text-xl text-carebow-text-medium max-w-3xl mx-auto">
                Our multidisciplinary team of licensed therapists and nurses work together 
                to create a personalized recovery plan for your unique needs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recoveryServices.map((service, index) => (
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

        {/* Recovery Timeline */}
        <section className="py-16 bg-gradient-to-r from-carebow-blue/5 to-carebow-mint/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-carebow-text-dark mb-4">
                Your Recovery Journey
              </h2>
              <p className="text-xl text-carebow-text-medium">
                We support you through every phase of stroke recovery with tailored care plans
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {recoveryPhases.map((phase, index) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card className="h-full border-carebow-blue/20">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-carebow-primary to-carebow-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <CardTitle className="text-lg text-carebow-text-dark">
                          {phase.phase}
                        </CardTitle>
                      </div>
                      <p className="text-sm text-carebow-text-medium">
                        {phase.focus}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {phase.services.map((service, serviceIndex) => (
                          <div key={serviceIndex} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-carebow-secondary flex-shrink-0" />
                            <span className="text-sm text-carebow-text-medium">{service}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Family Support Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-carebow-text-dark mb-6">
                  Supporting the Whole Family
                </h2>
                <p className="text-xl text-carebow-text-medium mb-6">
                  Stroke affects the entire family. That's why we provide comprehensive support, 
                  education, and resources for caregivers and loved ones too.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-carebow-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-carebow-text-dark">Caregiver Training</div>
                      <div className="text-sm text-carebow-text-medium">Learn essential skills for daily care and emergency response</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-carebow-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-carebow-text-dark">Emotional Support</div>
                      <div className="text-sm text-carebow-text-medium">Counseling and support groups for family members</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-carebow-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-carebow-text-dark">Progress Tracking</div>
                      <div className="text-sm text-carebow-text-medium">Regular updates and family meetings to track recovery milestones</div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Card className="border-2 border-carebow-mint/30 bg-gradient-to-br from-carebow-mint/10 to-carebow-blue/10">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-carebow-secondary mb-2">85%</div>
                      <div className="text-sm text-carebow-text-medium mb-4">of families report feeling more confident about recovery at home</div>
                      
                      <div className="text-3xl font-bold text-carebow-primary mb-2">6 months</div>
                      <div className="text-sm text-carebow-text-medium mb-4">average reduction in recovery time with home-based care</div>
                      
                      <div className="text-3xl font-bold text-carebow-accent mb-2">24/7</div>
                      <div className="text-sm text-carebow-text-medium">family support and emergency response</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-carebow-primary/5 to-carebow-secondary/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-carebow-text-dark mb-6">
              Start Your Recovery Journey at Home
            </h2>
            <p className="text-xl text-carebow-text-medium mb-8">
              Join our waitlist to be among the first to experience comprehensive stroke recovery 
              care in the comfort of your own home in Pittsburgh.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-carebow-primary to-carebow-secondary hover:from-carebow-primary/90 hover:to-carebow-secondary/90 text-white px-8 py-4 text-lg"
              onClick={scrollToWaitlist}
            >
              Join Our Waitlist <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <div className="mt-4 text-sm text-carebow-text-light">
              🏠 Coming Soon to Pittsburgh • Medicare and Insurance Accepted
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PostStrokeRecovery;