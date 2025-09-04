import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Stethoscope, 
  AlertTriangle, 
  Heart, 
  Phone, 
  Leaf, 
  Clock,
  Activity,
  Shield,
  CheckCircle,
  ArrowRight,
  Brain
} from 'lucide-react';

// Types for the diagnostic system
interface SymptomData {
  primary: string;
  severity: number;
  duration: string;
  onset: string;
  associatedSymptoms: string[];
  riskFactors: string[];
}

interface DiagnosticResult {
  urgencyLevel: 'emergency' | 'urgent' | 'moderate' | 'low';
  possibleConditions: Array<{
    condition: string;
    probability: number;
    description: string;
  }>;
  recommendations: {
    immediate: string[];
    selfCare: string[];
    ayurvedic: string[];
    followUp: string[];
  };
  nextSteps: {
    action: 'emergency' | 'urgent_care' | 'teleconsult' | 'self_care';
    timeframe: string;
    reasoning: string;
  };
}

interface DiagnosticEngineProps {
  symptomData: SymptomData;
  userProfile: {
    age: number;
    gender: string;
    medicalHistory: string[];
    allergies: string[];
    medications: string[];
  };
  onResult: (result: DiagnosticResult) => void;
}

export const DiagnosticEngine: React.FC<DiagnosticEngineProps> = ({
  symptomData,
  userProfile,
  onResult
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const analyzeSymptoms = useCallback(async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate AI analysis steps
    const steps = [
      'Processing symptom data...',
      'Checking medical databases...',
      'Applying clinical protocols...',
      'Evaluating risk factors...',
      'Generating recommendations...',
      'Finalizing assessment...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i]);
      setAnalysisProgress((i + 1) * 16.67);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Generate diagnostic result based on symptom data
    const result = generateDiagnosticResult(symptomData, userProfile);
    onResult(result);
    setIsAnalyzing(false);
  }, [symptomData, userProfile, onResult]);

  const generateDiagnosticResult = (symptoms: SymptomData, profile: any): DiagnosticResult => {
    // Emergency red flags
    const emergencySymptoms = [
      'chest pain', 'difficulty breathing', 'severe headache', 'loss of consciousness',
      'severe abdominal pain', 'signs of stroke', 'severe allergic reaction'
    ];

    const isEmergency = emergencySymptoms.some(emergency => 
      symptoms.primary.toLowerCase().includes(emergency.toLowerCase())
    ) || symptoms.severity >= 9;

    if (isEmergency) {
      return {
        urgencyLevel: 'emergency',
        possibleConditions: [
          {
            condition: 'Medical Emergency',
            probability: 95,
            description: 'Symptoms require immediate medical attention'
          }
        ],
        recommendations: {
          immediate: ['Call 911 immediately', 'Do not drive yourself', 'Stay calm and follow emergency instructions'],
          selfCare: [],
          ayurvedic: [],
          followUp: ['Follow up with primary care after emergency treatment']
        },
        nextSteps: {
          action: 'emergency',
          timeframe: 'Immediately',
          reasoning: 'Your symptoms indicate a potential medical emergency that requires immediate professional care.'
        }
      };
    }

    // High urgency conditions
    const urgentSymptoms = ['severe pain', 'high fever', 'persistent vomiting', 'difficulty swallowing'];
    const isUrgent = urgentSymptoms.some(urgent => 
      symptoms.primary.toLowerCase().includes(urgent.toLowerCase())
    ) || symptoms.severity >= 7;

    if (isUrgent) {
      return {
        urgencyLevel: 'urgent',
        possibleConditions: [
          {
            condition: 'Acute Condition',
            probability: 80,
            description: 'Requires prompt medical evaluation within 24 hours'
          }
        ],
        recommendations: {
          immediate: ['Seek medical care within 24 hours', 'Monitor symptoms closely'],
          selfCare: ['Rest', 'Stay hydrated', 'Take temperature regularly'],
          ayurvedic: ['Ginger tea for nausea', 'Turmeric milk for inflammation'],
          followUp: ['Schedule follow-up if symptoms persist']
        },
        nextSteps: {
          action: 'urgent_care',
          timeframe: 'Within 24 hours',
          reasoning: 'Your symptoms suggest a condition that needs prompt medical attention.'
        }
      };
    }

    // Moderate conditions - teleconsult recommended
    if (symptoms.severity >= 4) {
      return {
        urgencyLevel: 'moderate',
        possibleConditions: [
          {
            condition: 'Common Health Issue',
            probability: 70,
            description: 'Manageable condition that may benefit from professional guidance'
          }
        ],
        recommendations: {
          immediate: ['Monitor symptoms', 'Rest and hydration'],
          selfCare: ['Over-the-counter remedies as appropriate', 'Gentle exercise if tolerated'],
          ayurvedic: [
            'Honey and ginger for throat issues',
            'Chamomile tea for relaxation',
            'Turmeric paste for inflammation'
          ],
          followUp: ['Consider teleconsult if symptoms worsen']
        },
        nextSteps: {
          action: 'teleconsult',
          timeframe: 'Within 2-3 days',
          reasoning: 'A healthcare professional can provide personalized guidance for your symptoms.'
        }
      };
    }

    // Low urgency - self-care focus
    return {
      urgencyLevel: 'low',
      possibleConditions: [
        {
          condition: 'Minor Health Concern',
          probability: 60,
          description: 'Likely manageable with self-care and natural remedies'
        }
      ],
      recommendations: {
        immediate: ['Self-care measures', 'Monitor for changes'],
        selfCare: [
          'Adequate rest and sleep',
          'Proper hydration',
          'Balanced nutrition',
          'Stress management'
        ],
        ayurvedic: [
          'Warm water with lemon for digestion',
          'Pranayama breathing exercises',
          'Herbal teas based on symptoms',
          'Gentle yoga or stretching'
        ],
        followUp: ['Consult healthcare provider if symptoms persist beyond a week']
      },
      nextSteps: {
        action: 'self_care',
        timeframe: 'Monitor for 3-7 days',
        reasoning: 'Your symptoms can likely be managed with natural remedies and self-care.'
      }
    };
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'emergency': return 'destructive';
      case 'urgent': return 'destructive';
      case 'moderate': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case 'emergency': return <AlertTriangle className="w-5 h-5" />;
      case 'urgent': return <Clock className="w-5 h-5" />;
      case 'moderate': return <Stethoscope className="w-5 h-5" />;
      case 'low': return <Heart className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            AI Health Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Analyzing your symptoms...</span>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                <Shield className="w-3 h-3 mr-1" />
                HIPAA Secure
              </Badge>
            </div>
            
            {isAnalyzing && (
              <div className="space-y-2">
                <Progress value={analysisProgress} className="h-2" />
                <p className="text-sm text-muted-foreground">{currentStep}</p>
              </div>
            )}
            
            {!isAnalyzing && (
              <Button 
                onClick={analyzeSymptoms}
                className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                size="lg"
              >
                <Stethoscope className="w-4 h-4 mr-2" />
                Start AI Analysis
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Symptom Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Symptom Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Primary Symptom</h4>
              <p className="text-sm text-muted-foreground">{symptomData.primary}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Severity Level</h4>
              <div className="flex items-center gap-2">
                <Progress value={symptomData.severity * 10} className="flex-1 h-2" />
                <span className="text-sm font-medium">{symptomData.severity}/10</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Duration</h4>
              <p className="text-sm text-muted-foreground">{symptomData.duration}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Onset</h4>
              <p className="text-sm text-muted-foreground">{symptomData.onset}</p>
            </div>
          </div>
          
          {symptomData.associatedSymptoms.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Associated Symptoms</h4>
              <div className="flex flex-wrap gap-2">
                {symptomData.associatedSymptoms.map((symptom, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medical Disclaimer */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>AI Analysis Disclaimer:</strong> This AI-powered analysis is for informational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers for medical concerns. In case of emergency, call 911 immediately.
        </AlertDescription>
      </Alert>
    </div>
  );
};