import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, MessageCircle, Shield, Clock, Users, Stethoscope } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import ConversationalChat from './ConversationalChat';
import HealthProfileSetup from './HealthProfileSetup';
import VoiceChatButton from './VoiceChatButton';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

const SymptomChecker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'intro' | 'profile' | 'chat'>('intro');
  const [hasHealthProfile, setHasHealthProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      checkHealthProfile();
    }
  }, [user, checkHealthProfile]);

  const checkHealthProfile = React.useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('health_profiles')
        .select('*')
        .eq('profile_id', user?.id)
        .single();

      if (data) {
        setHasHealthProfile(true);
        setProfileData(data);
      }
    } catch (error) {
      console.log('No health profile found');
    }
  }, [user?.id]);

  const handleStartAssessment = () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to use the AI symptom checker for personalized recommendations.",
        variant: "destructive"
      });
      return;
    }

    if (!hasHealthProfile) {
      setCurrentStep('profile');
    } else {
      setCurrentStep('chat');
    }
  };

  const handleProfileComplete = (profile: { id: string; [key: string]: unknown }) => {
    setProfileData(profile);
    setHasHealthProfile(true);
    setCurrentStep('chat');
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced medical AI trained on clinical guidelines and cultural health practices"
    },
    {
      icon: MessageCircle,
      title: "Conversational Interface",
      description: "Natural conversation in 50+ languages with empathetic, personalized responses"
    },
    {
      icon: Shield,
      title: "Clinical Validation",
      description: "Evidence-based recommendations reviewed by medical professionals"
    },
    {
      icon: Clock,
      title: "Instant Assessment",
      description: "Get immediate health insights and urgency classifications 24/7"
    },
    {
      icon: Users,
      title: "Cultural Sensitivity",
      description: "Integrates traditional medicine wisdom with modern healthcare approaches"
    },
    {
      icon: Stethoscope,
      title: "Care Coordination",
      description: "Seamless connection to CareBow's network of verified healthcare providers"
    }
  ];

  if (currentStep === 'profile') {
    return <HealthProfileSetup onComplete={handleProfileComplete} />;
  }

  if (currentStep === 'chat') {
    return <ConversationalChat profileData={profileData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-carebow-blue to-white">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-carebow-primary to-carebow-secondary rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-carebow-primary to-carebow-secondary bg-clip-text text-transparent">
              Ask CareBow
            </h1>
          </div>
          
          <p className="text-xl text-carebow-text-medium mb-4 max-w-3xl mx-auto leading-relaxed">
            Your intelligent health companion that combines AI precision with cultural wisdom. 
            Get personalized symptom assessment, treatment guidance, and seamless care coordination.
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-carebow-text-light mb-8">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-500" />
              <span>Clinically Validated</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" />
              <span>24/7 Available</span>
            </div>
          </div>

          <Button
            onClick={handleStartAssessment}
            className="bg-gradient-to-r from-carebow-primary to-carebow-secondary hover:from-carebow-primary/90 hover:to-carebow-secondary/90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Health Assessment
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-carebow-primary/20 to-carebow-secondary/20 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-carebow-primary" />
                  </div>
                  <h3 className="font-semibold text-carebow-text-dark mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-carebow-text-medium text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Voice Chat Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-carebow-text-dark mb-4">
              Try Voice Chat
            </h2>
            <p className="text-carebow-text-medium mb-6 max-w-2xl mx-auto">
              Experience the future of healthcare with our voice-enabled AI. 
              Simply speak your symptoms and get instant, personalized health guidance.
            </p>
            <VoiceChatButton />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-carebow-text-dark mb-4">
            How Ask CareBow Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-carebow-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">1</div>
              <h3 className="font-semibold mb-2">Describe Symptoms</h3>
              <p className="text-sm text-carebow-text-medium">Tell us how you're feeling in natural language</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-carebow-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">2</div>
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p className="text-sm text-carebow-text-medium">Our AI analyzes your symptoms with clinical precision</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-carebow-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">3</div>
              <h3 className="font-semibold mb-2">Get Recommendations</h3>
              <p className="text-sm text-carebow-text-medium">Receive personalized care options and urgency assessment</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-carebow-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">4</div>
              <h3 className="font-semibold mb-2">Connect to Care</h3>
              <p className="text-sm text-carebow-text-medium">Book appointments with CareBow's trusted providers</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SymptomChecker;