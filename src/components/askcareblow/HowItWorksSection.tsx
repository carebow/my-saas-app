import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Mic, 
  Keyboard, 
  Stethoscope, 
  Clock, 
  Activity, 
  Leaf, 
  TrendingUp, 
  Heart,
  Bot,
  Headphones,
  BookOpen,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorksSection = () => {
  const steps = [
    {
      number: "1",
      title: "Choose Your Language",
      description: "Start by selecting your preferred language from our 7 supported languages including English, Spanish, French, German, Italian, Portuguese, and Chinese.",
      icon: Globe,
      features: [
        { icon: "🇺🇸", text: "English" },
        { icon: "🇪🇸", text: "Spanish" },
        { icon: "🇫🇷", text: "French" },
        { icon: "🇩🇪", text: "+ 4 more" }
      ],
      highlight: "🌍 Multilingual Support",
      subtitle: "Communicate in your native language for better understanding"
    },
    {
      number: "2", 
      title: "Describe Your Symptoms",
      description: "Tell us how you're feeling using either voice input or typing. Our AI understands natural language and can process symptoms described in everyday terms.",
      icon: Mic,
      features: [
        { icon: <Mic className="w-4 h-4" />, text: "Voice Input" },
        { icon: <Keyboard className="w-4 h-4" />, text: "Text Input" }
      ],
      highlight: "🗣️ Natural Communication",
      subtitle: "Speak or type naturally - no medical jargon required"
    },
    {
      number: "3",
      title: "AI Health Analysis", 
      description: "Our advanced AI analyzes your symptoms using a comprehensive diagnostic questionnaire, considering factors like duration, severity, and impact on daily life.",
      icon: Stethoscope,
      features: [
        { icon: <Clock className="w-4 h-4" />, text: "Duration - How long?" },
        { icon: <Activity className="w-4 h-4" />, text: "Severity - Pain level?" }
      ],
      highlight: "🧠 Smart Analysis",
      subtitle: "AI-powered diagnostic questions for accurate assessment"
    },
    {
      number: "4",
      title: "Personalized Natural Remedies",
      description: "Receive customized natural remedies based on your specific symptoms, using ingredients commonly found in American households and health stores.",
      icon: Leaf,
      features: [
        { icon: "🫖", text: "Ginger Tea for digestive issues" },
        { icon: "🥛", text: "Golden Milk for inflammation" },
        { icon: "🌼", text: "Chamomile Tea for stress relief" }
      ],
      highlight: "🌿 Natural Remedies",
      subtitle: "Time-tested natural solutions using household ingredients"
    },
    {
      number: "5",
      title: "Recovery Tracking",
      description: "Monitor your progress with our recovery tracking system. Get reminders, check-ins, and know when to seek professional medical help if needed.",
      icon: TrendingUp,
      features: [
        { icon: <TrendingUp className="w-4 h-4" />, text: "Recovery Progress" },
        { icon: "📊", text: "Day 2 of 3" }
      ],
      highlight: "📊 Progress Monitoring", 
      subtitle: "Track your healing journey with smart reminders"
    }
  ];

  const technologies = [
    {
      icon: Bot,
      title: "OpenAI GPT-4",
      description: "Advanced language model for natural conversation and symptom analysis"
    },
    {
      icon: Headphones,
      title: "ElevenLabs Voice AI", 
      description: "Emotional voice synthesis for empathetic communication"
    },
    {
      icon: BookOpen,
      title: "Natural Health Database",
      description: "Curated collection of natural remedies and wellness practices"
    }
  ];

  const disclaimers = [
    "CareBow provides educational information and natural remedies for wellness support",
    "This is not a substitute for professional medical advice, diagnosis, or treatment", 
    "Always consult healthcare professionals for serious symptoms or medical emergencies",
    "Our AI guides you on when to seek immediate medical attention",
    "Test remedies carefully and stop if you experience adverse reactions"
  ];

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm font-medium text-primary mb-6">
              🔬 How CareBow Works
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Discover how our AI-powered health assistant combines{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                natural wellness wisdom
              </span>{' '}
              with modern technology
            </h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Experience personalized health guidance in your preferred language through our intelligent AI system
            </p>
          </motion.div>

          {/* Steps */}
          <div className="space-y-12 mb-20">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`grid lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                {/* Content */}
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {step.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        <span className="text-lg">{typeof feature.icon === 'string' ? feature.icon : feature.icon}</span>
                        <span className="text-foreground">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Highlight Badge */}
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                    {step.highlight}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    {step.subtitle}
                  </p>
                </div>

                {/* Visual */}
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-muted border-primary/20">
                    <CardContent className="p-8 flex items-center justify-center h-64">
                      <step.icon className="w-24 h-24 text-primary" />
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Technology Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                Powered by Advanced Technology
              </h3>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                CareBow combines cutting-edge AI with traditional natural health knowledge to provide accurate, culturally-sensitive health guidance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {technologies.map((tech, index) => (
                <motion.div
                  key={tech.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <tech.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="text-lg font-semibold mb-2">{tech.title}</h4>
                      <p className="text-sm text-muted-foreground">{tech.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Health Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <h4 className="text-lg font-semibold text-amber-800 dark:text-amber-200">
                    Important Health Disclaimer
                  </h4>
                </div>
                <ul className="space-y-2">
                  {disclaimers.map((disclaimer, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>{disclaimer}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Ready to Start Your Health Journey?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Experience personalized natural health guidance in your preferred language. Start with 3 free consultations.
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-primary text-primary-foreground hover:opacity-90 px-8 py-3 text-lg font-semibold"
                  asChild
                >
                  <Link to="/auth?redirect=/ask-carebow/app">
                    <Heart className="w-5 h-5 mr-2" />
                    Try CareBow Now
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;