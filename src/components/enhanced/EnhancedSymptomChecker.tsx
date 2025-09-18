import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { safeLocalStorage } from '../../lib/safeStorage';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { 
  Heart, 
  MessageCircle, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Activity,
  Brain,
  Shield
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';

interface SymptomAnalysis {
  possible_causes: string[];
  urgency_level: string;
  urgency_emoji: string;
  urgency_reason: string;
  immediate_actions: string[];
  ayurvedic_insights: {
    dosha_imbalance: string;
    natural_remedies: string[];
    lifestyle_advice: string[];
  };
  modern_medicine_advice: string[];
  when_to_seek_help: string;
  confidence_score: number;
  disclaimer: string;
}

interface FollowUpQuestion {
  question: string;
  type: string;
  options: string[];
  required: boolean;
}

interface SymptomContext {
  primary_symptom: string;
  duration?: string;
  severity?: number;
  associated_symptoms: string[];
  medical_history: string[];
  medications: string[];
  allergies: string[];
}

export const EnhancedSymptomChecker: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState<'input' | 'questions' | 'analysis' | 'recommendations'>('input');
  const [symptomInput, setSymptomInput] = useState('');
  const [symptomContext, setSymptomContext] = useState<SymptomContext>({
    primary_symptom: '',
    associated_symptoms: [],
    medical_history: [],
    medications: [],
    allergies: []
  });
  const [followUpQuestions, setFollowUpQuestions] = useState<FollowUpQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSymptomSubmit = async () => {
    if (!symptomInput.trim()) return;
    
    setLoading(true);
    setSymptomContext(prev => ({ ...prev, primary_symptom: symptomInput }));
    
    try {
      // Get follow-up questions
      const response = await fetch('/api/v1/enhanced-ai/follow-up-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${safeLocalStorage.get('token')}`
        },
        body: JSON.stringify({
          symptom: symptomInput,
          current_context: {}
        })
      });
      
      const data = await response.json();
      setFollowUpQuestions(data.questions);
      setCurrentStep('questions');
      setProgress(25);
    } catch (error) {
      console.error('Error getting follow-up questions:', error);
      toast({
        title: "Error",
        description: "Failed to get follow-up questions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionAnswer = (answer: string) => {
    const currentQuestion = followUpQuestions[currentQuestionIndex];
    
    // Update context based on question type
    if (currentQuestion.type === 'severity') {
      const severity = answer.includes('1-3') ? 3 : answer.includes('4-6') ? 6 : 9;
      setSymptomContext(prev => ({ ...prev, severity }));
    } else if (currentQuestion.type === 'duration') {
      setSymptomContext(prev => ({ ...prev, duration: answer }));
    } else if (currentQuestion.type === 'associated') {
      setSymptomContext(prev => ({ 
        ...prev, 
        associated_symptoms: [...prev.associated_symptoms, answer]
      }));
    }
    
    // Move to next question or analysis
    if (currentQuestionIndex < followUpQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setProgress(25 + ((currentQuestionIndex + 1) / followUpQuestions.length) * 50);
    } else {
      performAnalysis();
    }
  };

  const performAnalysis = async () => {
    setLoading(true);
    setProgress(75);
    
    try {
      const response = await fetch('/api/v1/enhanced-ai/analyze-symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${safeLocalStorage.get('token')}`
        },
        body: JSON.stringify(symptomContext)
      });
      
      const data = await response.json();
      setAnalysis(data);
      setCurrentStep('analysis');
      setProgress(100);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      toast({
        title: "Error",
        description: "Failed to analyze symptoms. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'red': return 'text-red-600 bg-red-50 border-red-200';
      case 'yellow': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'green': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const resetChecker = () => {
    setCurrentStep('input');
    setSymptomInput('');
    setSymptomContext({
      primary_symptom: '',
      associated_symptoms: [],
      medical_history: [],
      medications: [],
      allergies: []
    });
    setFollowUpQuestions([]);
    setCurrentQuestionIndex(0);
    setAnalysis(null);
    setProgress(0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Heart className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Symptom Checker</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get personalized health insights with our AI-powered symptom analysis. 
          We'll ask intelligent follow-up questions to provide the most accurate assessment.
        </p>
      </div>

      {/* Progress Bar */}
      {currentStep !== 'input' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentStep === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-6 w-6 text-purple-600" />
                  <span>Describe Your Symptoms</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    What symptoms are you experiencing?
                  </label>
                  <textarea
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    placeholder="e.g., I have a headache and feel dizzy when I stand up"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={4}
                  />
                </div>
                
                <div className="flex space-x-4">
                  <Button 
                    onClick={handleSymptomSubmit}
                    disabled={!symptomInput.trim() || loading}
                    className="flex-1"
                  >
                    {loading ? 'Analyzing...' : 'Start Analysis'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentStep === 'questions' && (
          <motion.div
            key="questions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-purple-600" />
                  <span>Follow-up Questions</span>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {followUpQuestions.length}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {followUpQuestions[currentQuestionIndex] && (
                  <>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {followUpQuestions[currentQuestionIndex].question}
                      </h3>
                    </div>
                    
                    <div className="grid gap-2">
                      {followUpQuestions[currentQuestionIndex].options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => handleQuestionAnswer(option)}
                          className="justify-start text-left h-auto p-4"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {currentStep === 'analysis' && analysis && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Urgency Alert */}
            <Alert className={getUrgencyColor(analysis.urgency_level)}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{analysis.urgency_emoji}</span>
                  <div>
                    <div className="font-semibold">
                      {analysis.urgency_level === 'red' ? 'Emergency - Seek Help Now' :
                       analysis.urgency_level === 'yellow' ? 'See a Doctor in 2-3 Days' :
                       'Self-Care at Home'}
                    </div>
                    <div className="text-sm">{analysis.urgency_reason}</div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            {/* Analysis Results */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Possible Causes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    <span>Possible Causes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.possible_causes.map((cause, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        <span className="text-sm">{cause}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Immediate Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Immediate Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.immediate_actions.map((action, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-sm">{action}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Ayurvedic Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-orange-600" />
                    <span>Ayurvedic Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Dosha Imbalance</h4>
                    <p className="text-sm text-gray-600">{analysis.ayurvedic_insights.dosha_imbalance}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Natural Remedies</h4>
                    <div className="space-y-1">
                      {analysis.ayurvedic_insights.natural_remedies.map((remedy, index) => (
                        <div key={index} className="text-sm text-gray-600">• {remedy}</div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Modern Medicine Advice */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span>Modern Medicine Advice</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.modern_medicine_advice.map((advice, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm">{advice}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* When to Seek Help */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-red-600" />
                  <span>When to Seek Help</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{analysis.when_to_seek_help}</p>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> {analysis.disclaimer}
              </AlertDescription>
            </Alert>

            {/* Actions */}
            <div className="flex space-x-4">
              <Button onClick={resetChecker} variant="outline">
                Check Another Symptom
              </Button>
              <Button onClick={() => setCurrentStep('recommendations')}>
                View Recommendations
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
