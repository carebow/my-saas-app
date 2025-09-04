import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Stethoscope, 
  Leaf, 
  Activity, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Phone,
  Calendar,
  BookOpen,
  Share,
  Download,
  Bell,
  Shield,
  Info,
  ArrowRight,
  Star,
  Timer
} from 'lucide-react';

interface HealthRecommendation {
  category: 'immediate' | 'medical' | 'ayurvedic' | 'lifestyle' | 'followup';
  title: string;
  description: string;
  instructions: string[];
  timeframe: string;
  priority: 'high' | 'medium' | 'low';
  evidence?: string;
  warnings?: string[];
}

interface DiagnosticResult {
  urgencyLevel: 'emergency' | 'urgent' | 'moderate' | 'low';
  confidence: number;
  possibleConditions: Array<{
    condition: string;
    probability: number;
    description: string;
  }>;
  recommendations: HealthRecommendation[];
  nextSteps: {
    action: 'emergency' | 'urgent_care' | 'teleconsult' | 'self_care';
    timeframe: string;
    reasoning: string;
  };
  riskFactors: string[];
  redFlags: string[];
}

interface HealthRecommendationsProps {
  result: DiagnosticResult;
  symptomSummary: {
    primary: string;
    severity: number;
    duration: string;
  };
  onScheduleCare: (careType: string) => void;
  onStartNewAssessment: () => void;
}

export const HealthRecommendations: React.FC<HealthRecommendationsProps> = ({
  result,
  symptomSummary,
  onScheduleCare,
  onStartNewAssessment
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedRecommendation, setExpandedRecommendation] = useState<string | null>(null);

  // Get urgency styling
  const getUrgencyStyle = (level: string) => {
    switch (level) {
      case 'emergency':
        return {
          color: 'destructive',
          bg: 'bg-red-50 border-red-200',
          icon: <AlertTriangle className="w-5 h-5 text-red-600" />
        };
      case 'urgent':
        return {
          color: 'destructive',
          bg: 'bg-orange-50 border-orange-200',
          icon: <Clock className="w-5 h-5 text-orange-600" />
        };
      case 'moderate':
        return {
          color: 'default',
          bg: 'bg-yellow-50 border-yellow-200',
          icon: <Stethoscope className="w-5 h-5 text-yellow-600" />
        };
      case 'low':
        return {
          color: 'secondary',
          bg: 'bg-green-50 border-green-200',
          icon: <Heart className="w-5 h-5 text-green-600" />
        };
      default:
        return {
          color: 'outline',
          bg: 'bg-gray-50 border-gray-200',
          icon: <Activity className="w-5 h-5 text-gray-600" />
        };
    }
  };

  const urgencyStyle = getUrgencyStyle(result.urgencyLevel);

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'immediate': return <AlertTriangle className="w-4 h-4" />;
      case 'medical': return <Stethoscope className="w-4 h-4" />;
      case 'ayurvedic': return <Leaf className="w-4 h-4" />;
      case 'lifestyle': return <Activity className="w-4 h-4" />;
      case 'followup': return <Calendar className="w-4 h-4" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  // Group recommendations by category
  const groupedRecommendations = result.recommendations.reduce((acc, rec) => {
    if (!acc[rec.category]) {
      acc[rec.category] = [];
    }
    acc[rec.category].push(rec);
    return acc;
  }, {} as Record<string, HealthRecommendation[]>);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with Urgency Level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${urgencyStyle.bg} rounded-lg p-6 border-2`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {urgencyStyle.icon}
            <div>
              <h1 className="text-2xl font-bold">Health Assessment Results</h1>
              <p className="text-muted-foreground">
                Based on your symptoms: "{symptomSummary.primary}"
              </p>
            </div>
          </div>
          <Badge variant={urgencyStyle.color as "default" | "destructive" | "outline" | "secondary"} className="text-lg px-4 py-2">
            {result.urgencyLevel.toUpperCase()} PRIORITY
          </Badge>
        </div>

        {/* Confidence and Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium mb-2">AI Confidence</p>
            <div className="flex items-center gap-2">
              <Progress value={result.confidence} className="flex-1" />
              <span className="text-sm font-medium">{result.confidence}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Severity Level</p>
            <div className="flex items-center gap-2">
              <Progress value={symptomSummary.severity * 10} className="flex-1" />
              <span className="text-sm font-medium">{symptomSummary.severity}/10</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Duration</p>
            <p className="text-sm">{symptomSummary.duration}</p>
          </div>
        </div>
      </motion.div>

      {/* Next Steps - Prominent Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="w-6 h-6 text-primary" />
              Recommended Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <h3 className="font-semibold mb-2">{result.nextSteps.action.replace('_', ' ').toUpperCase()}</h3>
                <p className="text-muted-foreground mb-3">{result.nextSteps.reasoning}</p>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    <Timer className="w-3 h-3 mr-1" />
                    {result.nextSteps.timeframe}
                  </Badge>
                  <Button 
                    onClick={() => onScheduleCare(result.nextSteps.action)}
                    className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                  >
                    {result.nextSteps.action === 'emergency' ? 'Call 911' : 
                     result.nextSteps.action === 'urgent_care' ? 'Find Urgent Care' :
                     result.nextSteps.action === 'teleconsult' ? 'Book Teleconsult' : 
                     'View Self-Care Guide'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="conditions">Possible Conditions</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Risk Factors */}
          {result.riskFactors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-600" />
                  Risk Factors Identified
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.riskFactors.map((factor, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm">{factor}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Red Flags */}
          {result.redFlags.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <strong>Warning Signs:</strong> Watch for these symptoms that may require immediate medical attention:
                <ul className="mt-2 space-y-1">
                  {result.redFlags.map((flag, index) => (
                    <li key={index} className="text-sm">• {flag}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>Emergency: 911</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Schedule Care</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <Bell className="w-5 h-5" />
              <span>Set Reminders</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {Object.entries(groupedRecommendations).map(([category, recommendations]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 capitalize">
                    {getCategoryIcon(category)}
                    {category.replace('_', ' ')} Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{rec.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getPriorityColor(rec.priority) as "default" | "destructive" | "outline" | "secondary"}>
                              {rec.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {rec.timeframe}
                            </Badge>
                          </div>
                        </div>

                        {/* Instructions */}
                        <div className="space-y-2">
                          {rec.instructions.map((instruction, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{instruction}</span>
                            </div>
                          ))}
                        </div>

                        {/* Evidence */}
                        {rec.evidence && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-start gap-2">
                              <BookOpen className="w-4 h-4 text-blue-600 mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-blue-800 mb-1">Evidence Base:</p>
                                <p className="text-xs text-blue-700">{rec.evidence}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Warnings */}
                        {rec.warnings && rec.warnings.length > 0 && (
                          <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                              <div>
                                <p className="text-xs font-medium text-yellow-800 mb-1">Important:</p>
                                <ul className="text-xs text-yellow-700 space-y-1">
                                  {rec.warnings.map((warning, wIdx) => (
                                    <li key={wIdx}>• {warning}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="conditions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" />
                Possible Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.possibleConditions.map((condition, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{condition.condition}</h4>
                      <div className="flex items-center gap-2">
                        <Progress value={condition.probability} className="w-20 h-2" />
                        <span className="text-sm font-medium">{condition.probability}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{condition.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Educational Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Learn More
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Understanding Your Symptoms
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Leaf className="w-4 h-4 mr-2" />
                  Natural Remedies Guide
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="w-4 h-4 mr-2" />
                  Prevention Tips
                </Button>
              </CardContent>
            </Card>

            {/* Share & Export */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share className="w-5 h-5 text-green-600" />
                  Share Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share className="w-4 h-4 mr-2" />
                  Share with Doctor
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Set Follow-up Reminders
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button variant="outline" onClick={onStartNewAssessment}>
          Start New Assessment
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Star className="w-4 h-4 mr-2" />
            Rate Experience
          </Button>
          <Button>
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Follow-up
          </Button>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Medical Disclaimer:</strong> This AI assessment is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns. In case of emergency, call 911 immediately.
        </AlertDescription>
      </Alert>
    </div>
  );
};