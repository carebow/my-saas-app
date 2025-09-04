import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Mic, Stethoscope, BarChart3, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const PremiumFeaturesSection = () => {
  const premiumFeatures = [
    {
      icon: Mic,
      title: 'Multilingual Voice',
      description: 'Communicate in 7 languages with natural voice interaction',
      gradient: 'from-blue-500 to-purple-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20'
    },
    {
      icon: Stethoscope,
      title: 'AI Health Analysis',
      description: 'Deep insights into your symptoms with personalized care plans',
      gradient: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20'
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Monitor your healing journey with smart reminders and check-ins',
      gradient: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20'
    },
    {
      icon: UserCheck,
      title: 'Doctor Connect',
      description: 'Seamless referrals to healthcare professionals when needed',
      gradient: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20'
    }
  ];

  const basicFeatures = [
    'Basic AI health consultations',
    'Voice interactions in 7 languages',
    'Basic Ayurvedic remedies',
    'Limited recovery tracking',
    'Email support'
  ];

  const premiumBenefits = [
    'Unlimited AI health consultations',
    'Voice interactions in 7 languages',
    'Personalized Ayurvedic remedies',
    'Advanced recovery tracking',
    'Smart doctor recommendations',
    'Family health profiles (up to 5)',
    'Priority customer support',
    'AI health reminders'
  ];

  return (
    <section id="premium" className="py-20 bg-muted/30">
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
              <Crown className="w-4 h-4" />
              Premium AI Health Features
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Upgrade to unlock the full potential of your 
              <span className="gradient-text"> AI health assistant</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Experience personalized healthcare that grows with you and your family's needs
            </p>
          </motion.div>

          {/* Premium Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 mx-auto`}>
                      <feature.icon className={`w-7 h-7 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`} />
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pricing Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            {/* Basic Plan */}
            <Card className="relative border border-border bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Basic</h3>
                  <div className="text-3xl font-bold text-primary mb-2">$9.99<span className="text-lg text-muted-foreground">/month</span></div>
                  <p className="text-muted-foreground">Start your health journey</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {basicFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                 <Button 
                   variant="outline" 
                   className="w-full border-primary text-primary hover:bg-primary/10"
                   asChild
                 >
                   <Link to="/auth?redirect=/ask-carebow/app">Subscribe to Basic</Link>
                 </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="relative border-2 border-primary bg-card/50 backdrop-blur-sm">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-primary text-primary-foreground px-4 py-1">
                  <Crown className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
              
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Premium</h3>
                   <div className="text-3xl font-bold text-primary mb-2">
                     $19.99
                     <span className="text-lg text-muted-foreground">/month</span>
                   </div>
                  <p className="text-muted-foreground">Complete health companion</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {premiumBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full bg-gradient-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                  asChild
                >
                  <Link to="/auth?redirect=/ask-carebow/app">Upgrade to Premium</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Special Offer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
             <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-6 py-3 text-sm font-medium text-accent">
               💰 Premium Annual: $199.99/year - Save 17% vs Monthly
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PremiumFeaturesSection;