import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import { 
  MessageCircle, 
  Mic, 
  MicOff, 
  ArrowRight, 
  ArrowLeft,
  Clock,
  Activity,
  AlertTriangle,
  Heart,
  Stethoscope,
  Brain,
  CheckCircle
} from 'lucide-react';

// Triage question types
interface TriageQuestion {
  id: string;
  type: 'text' | 'scale' | 'multiple_choice' | 'checkbox' | 'duration';
  question: string;
  options?: string[];
  required: boolean;
  followUp?: string[];
  riskLevel?: 'low' | 'medium' | 'high' | 'emergency';
}

// Dynamic question flow based on symptoms
const getTriageQuestions = (primarySymptom: string): TriageQuestion[] => {
  const baseQuestions: TriageQuestion[] = [
    {
      id: 'onset',
      type: 'multiple_choice',
      question: 'When did this symptom start?',
      options: [
        'Just now (within the last hour)',
        'Today (within the last 24 hours)',
        'Yesterday (1-2 days ago)',
        'This week (3-7 days ago)',
        'More than a week ago'
      ],
      required: true
    },
    {
      id: 'severity',
      type: 'scale',
      question: 'On a scale of 1-10, how severe is your discomfort?',
      required: true
    },
    {
      id: 'pattern',
      type: 'multiple_choice',
      question: 'How would you describe the pattern?',
      options: [
        'Constant and unchanging',
        'Getting worse over time',
        'Getting better over time',
        'Comes and goes (intermittent)',
        'Only happens with certain activities'
      ],
      required: true
    }
  ];

  // Symptom-specific questions
  const symptomSpecificQuestions: Record<string, TriageQuestion[]> = {
    'chest pain': [
      {
        id: 'chest_location',
        type: 'multiple_choice',
        question: 'Where exactly is the chest pain located?',
        options: [
          'Center of chest',
          'Left side of chest',
          'Right side of chest',
          'Upper chest/neck area',
          'Lower chest/upper abdomen'
        ],
        required: true,
        riskLevel: 'high'
      },
      {
        id: 'chest_associated',
        type: 'checkbox',
        question: 'Are you experiencing any of these symptoms along with chest pain?',
        options: [
          'Shortness of breath',
          'Sweating',
          'Nausea or vomiting',
          'Dizziness or lightheadedness',
          'Pain radiating to arm, jaw, or back'
        ],
        required: true,
        riskLevel: 'emergency'
      }
    ],
    'headache': [
      {
        id: 'headache_type',
        type: 'multiple_choice',
        question: 'What type of headache best describes your pain?',
        options: [
          'Throbbing or pulsating',
          'Tight band around head',
          'Sharp, stabbing pain',
          'Dull, constant ache',
          'Pressure behind eyes'
        ],
        required: true
      },
      {
        id: 'headache_triggers',
        type: 'checkbox',
        question: 'Have you noticed any triggers? (Select all that apply)',
        options: [
          'Stress or anxiety',
          'Lack of sleep',
          'Certain foods',
          'Bright lights',
          'Weather changes',
          'Screen time'
        ],
        required: false
      }
    ],
    'fever': [
      {
        id: 'temperature',
        type: 'text',
        question: 'What is your current temperature? (if measured)',
        required: false
      },
      {
        id: 'fever_symptoms',
        type: 'checkbox',
        question: 'What other symptoms are you experiencing?',
        options: [
          'Chills or shivering',
          'Body aches',
          'Fatigue or weakness',
          'Sore throat',
          'Cough',
          'Runny or stuffy nose'
        ],
        required: true
      }
    ]
  };

  // Combine base questions with symptom-specific ones
  const specificQuestions = symptomSpecificQuestions[primarySymptom.toLowerCase()] || [];
  return [...baseQuestions, ...specificQuestions];
};

interface SymptomTriageProps {
  primarySymptom: string;
  onComplete: (triageData: any) => void;
  onBack: () => void;
}

export const SymptomTriage: React.FC<SymptomTriageProps> = ({
  primarySymptom,
  onComplete,
  onBack
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isListening, setIsListening] = useState(false);
  
  const questions = getTriageQuestions(primarySymptom);
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = useCallback((questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Complete triage
      const triageData = {
        primarySymptom,
        answers,
        completedAt: new Date().toISOString(),
        riskLevel: calculateRiskLevel(answers, questions)
      };
      onComplete(triageData);
    }
  }, [currentQuestionIndex, questions, primarySymptom, answers, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      onBack();
    }
  }, [currentQuestionIndex, onBack]);

  const calculateRiskLevel = (answers: Record<string, any>, questions: TriageQuestion[]) => {
    // Simple risk calculation based on answers
    let riskScore = 0;
    
    // High severity increases risk
    if (answers.severity && answers.severity[0] >= 8) riskScore += 3;
    else if (answers.severity && answers.severity[0] >= 6) riskScore += 2;
    else if (answers.severity && answers.severity[0] >= 4) riskScore += 1;

    // Recent onset increases risk for certain symptoms
    if (answers.onset === 'Just now (within the last hour)') riskScore += 2;
    else if (answers.onset === 'Today (within the last 24 hours)') riskScore += 1;

    // Emergency symptoms
    const emergencySymptoms = answers.chest_associated || [];
    if (emergencySymptoms.includes('Shortness of breath') || 
        emergencySymptoms.includes('Pain radiating to arm, jaw, or back')) {
      riskScore += 5;
    }

    if (riskScore >= 5) return 'emergency';
    if (riskScore >= 3) return 'high';
    if (riskScore >= 2) return 'medium';
    return 'low';
  };

  const renderQuestionInput = () => {
    const answer = answers[currentQuestion.id];

    switch (currentQuestion.type) {
      case 'text':
        return (
          <div className="space-y-2">
            <Input
              value={answer || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              placeholder="Type your answer..."
              className="text-lg p-4"
            />
          </div>
        );

      case 'scale':
        return (
          <div className="space-y-6">
            <div className="px-4">
              <Slider
                value={answer || [5]}
                onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground px-4">
              <span>1 - Mild</span>
              <span className="font-medium text-lg text-foreground">
                {answer ? answer[0] : 5}
              </span>
              <span>10 - Severe</span>
            </div>
          </div>
        );

      case 'multiple_choice':
        return (
          <RadioGroup
            value={answer || ''}
            onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
            className="space-y-3"
          >
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={`checkbox-${index}`}
                  checked={(answer || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentAnswers = answer || [];
                    if (checked) {
                      handleAnswer(currentQuestion.id, [...currentAnswers, option]);
                    } else {
                      handleAnswer(currentQuestion.id, currentAnswers.filter((a: string) => a !== option));
                    }
                  }}
                />
                <Label htmlFor={`checkbox-${index}`} className="flex-1 cursor-pointer text-base">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    if (!currentQuestion.required) return true;
    const answer = answers[currentQuestion.id];
    
    if (currentQuestion.type === 'checkbox') {
      return answer && answer.length > 0;
    }
    
    return answer !== undefined && answer !== '' && answer !== null;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-blue-50/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              Health Assessment
            </CardTitle>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {currentQuestionIndex + 1} of {questions.length}
            </Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Current Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 border-primary/10">
            <CardHeader>
              <CardTitle className="text-xl leading-relaxed">
                {currentQuestion.question}
              </CardTitle>
              {currentQuestion.required && (
                <Badge variant="outline" className="w-fit text-xs">
                  Required
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {renderQuestionInput()}
              
              {/* Voice Input Option */}
              {(currentQuestion.type === 'text') && (
                <div className="flex items-center gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsListening(!isListening)}
                    className="flex items-center gap-2"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isListening ? 'Stop Listening' : 'Voice Input'}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Speak your answer naturally
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {currentQuestionIndex === 0 ? 'Back to Symptoms' : 'Previous'}
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
        >
          {currentQuestionIndex === questions.length - 1 ? (
            <>
              Complete Assessment
              <CheckCircle className="w-4 h-4" />
            </>
          ) : (
            <>
              Next Question
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      {/* Emergency Notice */}
      {currentQuestion.riskLevel === 'emergency' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">
                    If you're experiencing severe symptoms, consider seeking immediate medical attention.
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    Call 911 for emergencies or visit your nearest emergency room.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};