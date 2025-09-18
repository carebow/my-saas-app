import React from 'react';
// import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Brain, Leaf, Activity, Heart, Stethoscope, Shield } from 'lucide-react';

const AIFeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: 'Intelligent AI Diagnosis',
      description: 'Our advanced AI analyzes your symptoms with empathy, understanding context and emotional state to provide personalized health insights.',
      gradient: 'from-blue-500 to-purple-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20'
    },
    {
      icon: Leaf,
      title: 'Natural Remedies',
      description: 'AI-curated Ayurvedic solutions using ingredients from your kitchen, backed by thousands of years of healing wisdom.',
      gradient: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20'
    },
    {
      icon: Activity,
      title: 'Health Monitoring',
      description: 'Smart recovery tracking with AI-powered check-ins, voice reminders, and intelligent escalation to healthcare professionals when needed.',
      gradient: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20'
    }
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
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
              <Heart className="w-4 h-4" />
              AI-Powered Compassionate Care
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Our intelligent health assistant combines cutting-edge AI with 
              <span className="gradient-text"> traditional natural health knowledge</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Experience healthcare that understands you as a whole person, not just your symptoms
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6`}>
                      <feature.icon className={`w-8 h-8 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`} />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional Trust Signals */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 p-4 bg-card/30 rounded-lg border border-border/50">
              <Stethoscope className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Medical-Grade AI</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-card/30 rounded-lg border border-border/50">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">HIPAA Compliant</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-card/30 rounded-lg border border-border/50">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Evidence-Based</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIFeaturesSection;