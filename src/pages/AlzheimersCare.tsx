import Navbar from "../components/UnifiedNavigation";
import Footer from "../components/UnifiedFooter";
import SEO from "../components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Brain, Shield, Heart, Users, ArrowRight, CheckCircle, Clock, Home } from "lucide-react";

const AlzheimersCare = () => {
  const scrollToWaitlist = () => {
    window.location.href = '/#waitlist';
  };

  const careServices = [
    {
      title: "Memory Care",
      description: "Specialized activities and therapies designed to stimulate cognitive function and preserve memories",
      icon: Brain
    },
    {
      title: "Safety Monitoring",
      description: "24/7 AI-powered monitoring with wandering prevention and emergency response systems",
      icon: Shield
    },
    {
      title: "Personal Care",
      description: "Assistance with daily activities while maintaining dignity and independence",
      icon: Heart
    },
    {
      title: "Family Support",
      description: "Education, respite care, and emotional support for family caregivers",
      icon: Users
    }
  ];

  const careStages = [
    {
      stage: "Early Stage",
      description: "Mild cognitive changes, maintaining independence",
      services: ["Medication reminders", "Social engagement", "Safety checks", "Cognitive exercises"]
    },
    {
      stage: "Moderate Stage", 
      description: "Increased confusion, need for more assistance",
      services: ["Personal care assistance", "Behavioral support", "24/7 monitoring", "Family training"]
    },
    {
      stage: "Late Stage",
      description: "Severe cognitive decline, comprehensive care needs",
      services: ["Full personal care", "Comfort measures", "Medical monitoring", "End-of-life support"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Alzheimer's & Dementia Care at Home | Pittsburgh Memory Care | CareBow"
        description="Compassionate Alzheimer's and dementia care at home in Pittsburgh. Specialized memory care, 24/7 monitoring, and family support. Preserve dignity and comfort at home."
        keywords="Alzheimer's care Pittsburgh, dementia care at home, memory care services, home care dementia, Pittsburgh Alzheimer's support, elder care memory loss"
        url="https://www.carebow.com/alzheimers-care"
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
                  Memory Care Specialists
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-carebow-text-dark mb-6">
                  Compassionate{" "}
                  <span className="bg-gradient-to-r from-carebow-primary to-carebow-secondary bg-clip-text text-transparent">
                    Alzheimer's Care
                  </span>{" "}
                  at Home
                </h1>
                <p className="text-xl text-carebow-text-medium mb-8 leading-relaxed">
                  Specialized memory care services that honor your loved one's dignity while providing 
                  the safety, comfort, and support they need in familiar surroundings.
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
                      Family Consultation
                    </a>
                  </Button>
                </div>

                <div className="bg-white/80 rounded-xl p-4 border border-carebow-blue/20">
                  <div className="flex items-center gap-2 text-sm text-carebow-text-medium mb-2">
                    <Home className="w-4 h-4 text-carebow-secondary" />
                    <span className="font-semibold text-carebow-secondary">Home is where memories matter most</span>
                  </div>
                  <div className="text-xs text-carebow-text-light">
                    Studies show familiar environments can slow cognitive decline
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
                      Why Choose Home-Based Memory Care?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-carebow-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-carebow-text-medium">Familiar environment reduces confusion and anxiety</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-carebow-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-carebow-text-medium">One-on-one personalized attention</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-carebow-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-carebow-text-medium">Family can remain actively involved in care</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-carebow-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-carebow-text-medium">Maintains established routines and comfort</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-carebow-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-carebow-text-medium">AI-powered safety monitoring 24/7</span>
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
                Specialized Alzheimer's & Dementia Services
              </h2>
              <p className="text-xl text-carebow-text-medium max-w-3xl mx-auto">
                Our certified dementia care specialists provide compassionate, person-centered care 
                tailored to each stage of the disease progression.
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

        {/* Care Stages Section */}
        <section className="py-16 bg-gradient-to-r from-carebow-blue/5 to-carebow-mint/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-carebow-text-dark mb-4">
                Care That Adapts to Every Stage
              </h2>
              <p className="text-xl text-carebow-text-medium">
                From early memory changes to advanced care needs, we provide appropriate support at every stage
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {careStages.map((stage, index) => (
                <motion.div
                  key={stage.stage}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card className="h-full border-carebow-blue/20">
                    <CardHeader>
                      <CardTitle className="text-lg text-carebow-text-dark flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-carebow-primary to-carebow-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        {stage.stage}
                      </CardTitle>
                      <p className="text-sm text-carebow-text-medium">
                        {stage.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {stage.services.map((service, serviceIndex) => (
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
                  Supporting Family Caregivers
                </h2>
                <p className="text-xl text-carebow-text-medium mb-6">
                  Caring for someone with Alzheimer's affects the whole family. We provide the education, 
                  resources, and respite support you need throughout the journey.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-carebow-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-carebow-text-dark">Dementia Education</div>
                      <div className="text-sm text-carebow-text-medium">Understanding the disease and what to expect at each stage</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-carebow-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-carebow-text-dark">Respite Care</div>
                      <div className="text-sm text-carebow-text-medium">Scheduled breaks for family caregivers to rest and recharge</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-carebow-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-carebow-text-dark">Communication Strategies</div>
                      <div className="text-sm text-carebow-text-medium">Techniques for better communication and reducing behavioral challenges</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-carebow-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-carebow-text-dark">Support Groups</div>
                      <div className="text-sm text-carebow-text-medium">Connect with other families facing similar challenges</div>
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
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-carebow-secondary mb-2">70%</div>
                        <div className="text-sm text-carebow-text-medium">of families report reduced stress with professional home care</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold text-carebow-primary mb-2">2-3 years</div>
                        <div className="text-sm text-carebow-text-medium">longer time at home compared to facility care</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold text-carebow-accent mb-2">24/7</div>
                        <div className="text-sm text-carebow-text-medium">AI monitoring for safety and peace of mind</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Safety Technology Section */}
        <section className="py-16 bg-gradient-to-r from-carebow-primary/5 to-carebow-secondary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-carebow-text-dark mb-4">
                Advanced Safety Technology
              </h2>
              <p className="text-xl text-carebow-text-medium max-w-3xl mx-auto">
                Our AI-powered monitoring system provides comprehensive safety features designed 
                specifically for individuals with Alzheimer's and dementia.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-carebow-blue/20">
                <CardContent className="p-6 text-center">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-carebow-primary" />
                  <h3 className="font-bold text-carebow-text-dark mb-2">Wandering Prevention</h3>
                  <p className="text-sm text-carebow-text-medium">
                    Smart sensors detect unusual movement patterns and alert caregivers immediately
                  </p>
                </CardContent>
              </Card>

              <Card className="border-carebow-blue/20">
                <CardContent className="p-6 text-center">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-carebow-secondary" />
                  <h3 className="font-bold text-carebow-text-dark mb-2">Medication Reminders</h3>
                  <p className="text-sm text-carebow-text-medium">
                    Automated reminders and monitoring to ensure medications are taken safely
                  </p>
                </CardContent>
              </Card>

              <Card className="border-carebow-blue/20">
                <CardContent className="p-6 text-center">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-carebow-accent" />
                  <h3 className="font-bold text-carebow-text-dark mb-2">Cognitive Monitoring</h3>
                  <p className="text-sm text-carebow-text-medium">
                    Track cognitive changes and adjust care plans accordingly
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-carebow-text-dark mb-6">
              Honor Their Dignity, Preserve Their Comfort
            </h2>
            <p className="text-xl text-carebow-text-medium mb-8">
              Join our waitlist to be among the first families to access compassionate, 
              professional Alzheimer's care in the comfort of home.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-carebow-primary to-carebow-secondary hover:from-carebow-primary/90 hover:to-carebow-secondary/90 text-white px-8 py-4 text-lg"
              onClick={scrollToWaitlist}
            >
              Join Our Waitlist <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <div className="mt-4 text-sm text-carebow-text-light">
              ❤️ Specialized memory care • Coming Soon to Pittsburgh • Insurance Coverage Available
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AlzheimersCare;