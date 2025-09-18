'use client'
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Heart, 
  Stethoscope, 
  MessageCircle, 
  Mic, 
  Phone, 
  Calendar,
  Shield,
  Brain,
  Activity,
  AlertTriangle,
  CheckCircle,
  Globe,
  Leaf,
  User,
  Settings
} from 'lucide-react';

import { ConversationalInterface } from './ConversationalInterface';
import { SymptomTriage } from './SymptomTriage';
import { DiagnosticEngine } from './DiagnosticEngine';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/use-toast';

// Application states
type AppState = 'welcome' | 'symptom_input' | 'conversation' | 'triage' | 'diagnosis' | 'recommendations' | 'care_connection';

// User profile interface
interface UserHealthProfile {
  age: number;
  gender: string;
  medicalHistory: string[];
  allergies: string[];
  medications: string[];
  emergencyContact?: string;
  preferredLanguage: string;
}

// Care connection options
interface CareOption {
  type: 'emergency' | 'urgent_care' | 'teleconsult' | 'home_visit' | 'ayurvedic_consult';
  title: string;
  description: string;
  timeframe: string;
  icon: React.ReactNode;
  action: () => void;
}

export const AskCareBowApp: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [primarySymptom, setPrimarySymptom] = useState('');
  const [triageData, setTriageData] = useState<any>(null);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [conversationData, setConversationData] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserHealthProfile>({
    age: 35,
    gender: 'prefer not to say',
    medicalHistory: [],
    allergies: [],
    medications: [],
    preferredLanguage: 'English'
  });

  const { user } = useAuth();
  const { toast } = useToast();

  // Handle symptom input from various sources
  const handleSymptomInput = useCallback((symptom: string, source: 'text' | 'voice' | 'quick_select') => {
    setPrimarySymptom(symptom);
    
    // Check for emergency keywords
    const emergencyKeywords = [
      'chest pain', 'can\'t breathe', 'difficulty breathing', 'severe pain',
      'unconscious', 'stroke', 'heart attack', 'severe bleeding', 'overdose'
    ];
    
    const isEmergency = emergencyKeywords.some(keyword => 
      symptom.toLowerCase().includes(keyword.toLowerCase())
    );

    if (isEmergency) {
      setAppState('care_connection');
      toast({
        title: "Emergency Detected",
        description: "Your symptoms may require immediate medical attention.",
        variant: "destructive",
      });
    } else {
      setAppState('conversation');
    }
  }, [toast]);

  // Handle urgent care escalation
  const handleUrgentCare = useCallback((urgencyLevel: string) => {
    if (urgencyLevel === 'emergency' || urgencyLevel === 'high') {
      setAppState('care_connection');
    }
  }, []);

  // Handle triage completion
  const handleTriageComplete = useCallback((data: any) => {
    setTriageData(data);
    setAppState('diagnosis');
  }, []);

  // Handle diagnostic completion
  const handleDiagnosticComplete = useCallback((result: any) => {
    setDiagnosticResult(result);
    setAppState('recommendations');
  }, []);

  // Care connection options
  const getCareOptions = (): CareOption[] => {
    const urgencyLevel = diagnosticResult?.urgencyLevel || conversationData?.urgencyLevel || 'low';
    
    const baseOptions: CareOption[] = [
      {
        type: 'emergency',
        title: 'Emergency Services',
        description: 'Call 911 for immediate medical attention',
        timeframe: 'Immediate',
        icon: <Phone className="w-5 h-5" />,
        action: () => {
          window.open('tel:911', '_self');
        }
      },
      {
        type: 'urgent_care',
        title: 'Urgent Care Center',
        description: 'Visit nearby urgent care for same-day treatment',
        timeframe: 'Within 24 hours',
        icon: <Activity className="w-5 h-5" />,
        action: () => {
          // Integrate with location services to find nearby urgent care
          toast({
            title: "Finding Urgent Care",
            description: "Searching for nearby urgent care centers...",
          });
        }
      },
      {
        type: 'teleconsult',
        title: 'CareBow Teleconsult',
        description: 'Video call with licensed healthcare provider',
        timeframe: 'Within 2 hours',
        icon: <Stethoscope className="w-5 h-5" />,
        action: () => {
          toast({
            title: "Booking Teleconsult",
            description: "Connecting you with available healthcare providers...",
          });
        }
      },
      {
        type: 'home_visit',
        title: 'Home Health Visit',
        description: 'Licensed nurse or healthcare provider visits your home',
        timeframe: 'Same day',
        icon: <Heart className="w-5 h-5" />,
        action: () => {
          toast({
            title: "Scheduling Home Visit",
            description: "Arranging a home healthcare visit...",
          });
        }
      },
      {
        type: 'ayurvedic_consult',
        title: 'Ayurvedic Consultation',
        description: 'Natural healing consultation with certified practitioner',
        timeframe: 'Within 24 hours',
        icon: <Leaf className="w-5 h-5" />,
        action: () => {
          toast({
            title: "Ayurvedic Consultation",
            description: "Connecting with certified Ayurvedic practitioners...",
          });
        }
      }
    ];

    // Filter options based on urgency
    if (urgencyLevel === 'emergency') {
      return baseOptions.filter(option => option.type === 'emergency');
    } else if (urgencyLevel === 'high') {
      return baseOptions.filter(option => ['emergency', 'urgent_care', 'teleconsult'].includes(option.type));
    } else {
      return baseOptions;
    }
  };

  // Quick symptom options
  const quickSymptoms = [
    'I have a headache',
    'Feeling tired and weak',
    'Stomach pain or nausea',
    'Cough or cold symptoms',
    'Back or joint pain',
    'Stress or anxiety',
    'Sleep problems',
    'Skin rash or irritation'
  ];

  // Render welcome screen
  const renderWelcome = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-4 bg-gradient-to-br from-primary to-blue-600 rounded-full shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-blue-600 to-green-600 bg-clip-text text-transparent">
              🏥 Ask CareBow
            </h1>
            <p className="text-lg text-muted-foreground">Your AI-Powered Health Companion</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <p className="text-xl text-muted-foreground mb-4">
            I'm here to listen to your health concerns, ask the right questions, and guide you to the care you need.
          </p>
          <p className="text-lg text-muted-foreground">
            Think of me as your first step in healthcare - available 24/7, compassionate, and powered by advanced AI.
          </p>
        </div>

        {/* Trust Signals */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            <Brain className="w-3 h-3 mr-1" />
            GPT-4 Powered
          </Badge>
          <Badge variant="outline" className="bg-green-100 text-green-700">
            <Shield className="w-3 h-3 mr-1" />
            HIPAA Compliant
          </Badge>
          <Badge variant="outline" className="bg-blue-100 text-blue-700">
            <Globe className="w-3 h-3 mr-1" />
            7 Languages
          </Badge>
          <Badge variant="outline" className="bg-purple-100 text-purple-700">
            <Stethoscope className="w-3 h-3 mr-1" />
            Medical Grade
          </Badge>
        </div>
      </motion.div>

      {/* Input Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Voice Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-6 h-6 text-primary" />
                Voice Conversation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Speak naturally about your symptoms. I'll listen and ask follow-up questions just like a caring healthcare provider.
              </p>
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                onClick={() => setAppState('conversation')}
              >
                <Mic className="w-5 h-5 mr-2" />
                Start Voice Chat
              </Button>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Natural language processing</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Text Input */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full border-2 border-green-200 hover:border-green-300 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-green-600" />
                Text Conversation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Type your symptoms and concerns. I'll guide you through a structured health assessment.
              </p>
              <Button 
                size="lg" 
                variant="outline"
                className="w-full border-green-200 hover:bg-green-50"
                onClick={() => setAppState('conversation')}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Text Chat
              </Button>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Structured questionnaire</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Symptom Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-600" />
              Quick Health Check
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Select a common concern to get started quickly:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickSymptoms.map((symptom, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSymptomInput(symptom, 'quick_select')}
                  className="text-left h-auto p-3 justify-start"
                >
                  {symptom}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Emergency Notice */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription>
          <strong>Medical Emergency?</strong> If you're experiencing a life-threatening emergency, 
          call 911 immediately. Don't wait for AI assessment.
        </AlertDescription>
      </Alert>
    </div>
  );

  // Render care connection options
  const renderCareConnection = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Connect to Care</h2>
        <p className="text-lg text-muted-foreground">
          Based on your symptoms, here are your care options:
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getCareOptions().map((option, index) => (
          <motion.div
            key={option.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`h-full cursor-pointer transition-all hover:shadow-lg ${
              option.type === 'emergency' ? 'border-red-200 bg-red-50' : 'hover:border-primary/40'
            }`}>
              <CardContent className="p-6" onClick={option.action}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${
                    option.type === 'emergency' 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{option.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {option.description}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {option.timeframe}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => setAppState('welcome')}
          className="mt-4"
        >
          Start New Assessment
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Ask CareBow</h1>
              <p className="text-sm text-muted-foreground">AI Health Assistant</p>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-700">
                <User className="w-3 h-3 mr-1" />
                {user.email?.split('@')[0]}
              </Badge>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {appState === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderWelcome()}
            </motion.div>
          )}

          {appState === 'conversation' && (
            <motion.div
              key="conversation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ConversationalInterface
                initialSymptom={primarySymptom}
                userProfile={userProfile}
                onUrgentCare={handleUrgentCare}
                onTriageComplete={handleTriageComplete}
              />
            </motion.div>
          )}

          {appState === 'triage' && (
            <motion.div
              key="triage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SymptomTriage
                primarySymptom={primarySymptom}
                onComplete={handleTriageComplete}
                onBack={() => setAppState('conversation')}
              />
            </motion.div>
          )}

          {appState === 'diagnosis' && triageData && (
            <motion.div
              key="diagnosis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DiagnosticEngine
                symptomData={{
                  primary: primarySymptom,
                  severity: triageData.answers?.severity?.[0] || 5,
                  duration: triageData.answers?.onset || 'unknown',
                  onset: triageData.answers?.pattern || 'unknown',
                  associatedSymptoms: triageData.answers?.associated_symptoms || [],
                  riskFactors: []
                }}
                userProfile={userProfile}
                onResult={handleDiagnosticComplete}
              />
            </motion.div>
          )}

          {appState === 'care_connection' && (
            <motion.div
              key="care_connection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderCareConnection()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Alert className="max-w-4xl mx-auto">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Medical Disclaimer:</strong> Ask CareBow provides general health information and should not replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical concerns. In emergencies, call 911 immediately.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};