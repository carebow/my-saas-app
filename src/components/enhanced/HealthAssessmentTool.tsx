import React, { useState } from 'react';
// import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { 
  Heart, 
  Brain, 
  Activity, 
  Apple, 
  Moon, 
  Droplets,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface Question {
  id: string;
  category: 'physical' | 'mental' | 'lifestyle' | 'nutrition' | 'sleep';
  question: string;
  type: 'single' | 'multiple' | 'scale';
  options: string[];
  icon: React.ComponentType<{ className?: string }>;
}

interface AssessmentResult {
  category: string;
  score: number;
  maxScore: number;
  level: 'excellent' | 'good' | 'fair' | 'needs-attention';
  recommendations: string[];
  ayurvedicTips: string[];
}

const questions: Question[] = [
  {
    id: 'energy',
    category: 'physical',
    question: 'How would you rate your energy levels throughout the day?',
    type: 'scale',
    options: ['Very Low', 'Low', 'Moderate', 'High', 'Very High'],
    icon: Activity
  },
  {
    id: 'exercise',
    category: 'physical',
    question: 'How often do you engage in physical exercise?',
    type: 'single',
    options: ['Never', 'Rarely (1-2 times/month)', 'Sometimes (1-2 times/week)', 'Often (3-4 times/week)', 'Daily'],
    icon: Heart
  },
  {
    id: 'stress',
    category: 'mental',
    question: 'How often do you feel stressed or overwhelmed?',
    type: 'scale',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
    icon: Brain
  },
  {
    id: 'sleep_quality',
    category: 'sleep',
    question: 'How would you rate your sleep quality?',
    type: 'scale',
    options: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'],
    icon: Moon
  },
  {
    id: 'sleep_duration',
    category: 'sleep',
    question: 'How many hours of sleep do you typically get per night?',
    type: 'single',
    options: ['Less than 5', '5-6 hours', '6-7 hours', '7-8 hours', '8+ hours'],
    icon: Moon
  },
  {
    id: 'diet_quality',
    category: 'nutrition',
    question: 'How would you describe your overall diet?',
    type: 'single',
    options: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'],
    icon: Apple
  },
  {
    id: 'water_intake',
    category: 'nutrition',
    question: 'How much water do you drink daily?',
    type: 'single',
    options: ['Less than 4 glasses', '4-6 glasses', '6-8 glasses', '8-10 glasses', '10+ glasses'],
    icon: Droplets
  },
  {
    id: 'meditation',
    category: 'mental',
    question: 'Do you practice meditation or mindfulness?',
    type: 'single',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Daily'],
    icon: Brain
  }
];

export const HealthAssessmentTool: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<AssessmentResult[]>([]);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    const categoryScores: Record<string, { total: number; count: number }> = {};
    
    // Calculate scores by category
    Object.entries(answers).forEach(([questionId, score]) => {
      const question = questions.find(q => q.id === questionId);
      if (question) {
        if (!categoryScores[question.category]) {
          categoryScores[question.category] = { total: 0, count: 0 };
        }
        categoryScores[question.category].total += score;
        categoryScores[question.category].count += 1;
      }
    });

    // Generate results for each category
    const assessmentResults: AssessmentResult[] = Object.entries(categoryScores).map(([category, data]) => {
      const averageScore = data.total / data.count;
      const percentage = (averageScore / 4) * 100; // Convert to percentage (0-4 scale to 0-100)
      
      let level: AssessmentResult['level'];
      if (percentage >= 80) level = 'excellent';
      else if (percentage >= 65) level = 'good';
      else if (percentage >= 50) level = 'fair';
      else level = 'needs-attention';

      return {
        category: category.charAt(0).toUpperCase() + category.slice(1),
        score: Math.round(percentage),
        maxScore: 100,
        level,
        recommendations: getRecommendations(category, level),
        ayurvedicTips: getAyurvedicTips(category, level)
      };
    });

    setResults(assessmentResults);
    setShowResults(true);
  };

  const getRecommendations = (category: string, level: AssessmentResult['level']): string[] => {
    const recommendations: Record<string, Record<string, string[]>> = {
      physical: {
        'needs-attention': [
          'Start with 10-15 minutes of daily walking',
          'Incorporate stretching into your routine',
          'Consider consulting a fitness professional'
        ],
        fair: [
          'Increase exercise frequency to 3-4 times per week',
          'Try different types of physical activities',
          'Focus on both cardio and strength training'
        ],
        good: [
          'Maintain current activity levels',
          'Add variety to prevent boredom',
          'Consider setting new fitness goals'
        ],
        excellent: [
          'Continue your excellent routine',
          'Consider mentoring others',
          'Explore advanced fitness challenges'
        ]
      },
      mental: {
        'needs-attention': [
          'Practice 5 minutes of daily meditation',
          'Consider speaking with a counselor',
          'Try stress-reduction techniques like deep breathing'
        ],
        fair: [
          'Increase mindfulness practice',
          'Explore different meditation styles',
          'Consider joining a support group'
        ],
        good: [
          'Maintain current mental health practices',
          'Share techniques with others',
          'Continue regular self-care'
        ],
        excellent: [
          'You\'re doing great! Keep it up',
          'Consider teaching mindfulness to others',
          'Explore advanced meditation practices'
        ]
      },
      nutrition: {
        'needs-attention': [
          'Focus on eating more whole foods',
          'Increase water intake gradually',
          'Consider consulting a nutritionist'
        ],
        fair: [
          'Add more fruits and vegetables to meals',
          'Reduce processed food intake',
          'Plan meals in advance'
        ],
        good: [
          'Continue healthy eating habits',
          'Experiment with new healthy recipes',
          'Focus on nutrient timing'
        ],
        excellent: [
          'Maintain your excellent nutrition habits',
          'Share healthy recipes with others',
          'Consider advanced nutrition education'
        ]
      },
      sleep: {
        'needs-attention': [
          'Establish a consistent bedtime routine',
          'Limit screen time before bed',
          'Create a comfortable sleep environment'
        ],
        fair: [
          'Optimize your sleep schedule',
          'Consider relaxation techniques before bed',
          'Evaluate your mattress and pillows'
        ],
        good: [
          'Maintain good sleep hygiene',
          'Fine-tune your bedtime routine',
          'Monitor sleep quality patterns'
        ],
        excellent: [
          'Your sleep habits are excellent',
          'Help others improve their sleep',
          'Continue prioritizing rest'
        ]
      }
    };

    return recommendations[category]?.[level] || ['Continue focusing on this area of health'];
  };

  const getAyurvedicTips = (category: string, level: AssessmentResult['level']): string[] => {
    const ayurvedicTips: Record<string, string[]> = {
      physical: [
        'Practice Surya Namaskara (Sun Salutations) daily',
        'Try Abhyanga (self-massage) with warm sesame oil',
        'Include warming spices like ginger in your diet'
      ],
      mental: [
        'Practice Pranayama (breathing exercises) daily',
        'Try Brahmi tea for mental clarity',
        'Use Ashwagandha for stress management'
      ],
      nutrition: [
        'Eat according to your dosha constitution',
        'Drink warm water with lemon in the morning',
        'Include all six tastes in your meals'
      ],
      sleep: [
        'Drink warm milk with nutmeg before bed',
        'Practice Yoga Nidra for deep relaxation',
        'Massage your feet with ghee before sleep'
      ]
    };

    return ayurvedicTips[category] || ['Follow Ayurvedic principles for balanced living'];
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResults([]);
  };

  const getLevelColor = (level: AssessmentResult['level']) => {
    switch (level) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'needs-attention': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getLevelIcon = (level: AssessmentResult['level']) => {
    switch (level) {
      case 'excellent': return CheckCircle2;
      case 'good': return CheckCircle2;
      case 'fair': return Info;
      case 'needs-attention': return AlertTriangle;
      default: return Info;
    }
  };

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Health Assessment Results</h2>
          <p className="text-gray-600 mb-8">
            Based on your responses, here's your personalized health overview with recommendations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((result, index) => {
            const LevelIcon = getLevelIcon(result.level);
            return (
              <motion.div
                key={result.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="capitalize">{result.category}</span>
                      <Badge className={getLevelColor(result.level)}>
                        <LevelIcon className="h-3 w-3 mr-1" />
                        {result.level.replace('-', ' ')}
                      </Badge>
                    </CardTitle>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Score</span>
                        <span className="font-semibold">{result.score}/100</span>
                      </div>
                      <Progress value={result.score} className="h-2" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-blue-600">Recommendations:</h4>
                      <ul className="space-y-1 text-sm">
                        {result.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-green-600">Ayurvedic Tips:</h4>
                      <ul className="space-y-1 text-sm">
                        {result.ayurvedicTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center space-y-4"
        >
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              <strong>Remember:</strong> This assessment provides general guidance. For personalized health advice, 
              consult with qualified healthcare professionals.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={resetAssessment} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Take Assessment Again
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              Get Personalized Plan
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const Icon = currentQ.icon;
  const hasAnswer = answers[currentQ.id] !== undefined;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Health Assessment</h2>
        <p className="text-gray-600 mb-8">
          Answer a few questions to get personalized health insights and recommendations.
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </motion.div>

      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <span className="capitalize">{currentQ.category}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {currentQ.question}
            </h3>
            
            <RadioGroup
              value={answers[currentQ.id]?.toString() || ''}
              onValueChange={(value) => handleAnswer(parseInt(value))}
            >
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={nextQuestion}
          disabled={!hasAnswer}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          {currentQuestion === questions.length - 1 ? 'Get Results' : 'Next'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};