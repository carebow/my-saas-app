import React, { useState } from 'react';
// import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, Calendar, Phone, MapPin, Clock, Star, ChevronRight, Heart, Brain, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from './ui/use-toast';

interface AssessmentResultsProps {
  assessmentData: {
    urgencyLevel: string;
    recommendedAction: string;
    redFlags?: string[];
    possibleConditions?: Array<{
      condition: string;
      confidence: number;
      reasoning: string;
    }>;
    [key: string]: unknown;
  };
  onBack: () => void;
  showConnectProviderButton?: boolean;
}

const AssessmentResults: React.FC<AssessmentResultsProps> = ({ assessmentData, onBack, showConnectProviderButton }) => {
  const { toast } = useToast();
  const [isLoadingCare, setIsLoadingCare] = useState(false);
  const [careRecommendations, setCareRecommendations] = useState(null);

  const getUrgencyInfo = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return {
          color: 'bg-red-500',
          textColor: 'text-red-600',
          bgColor: 'bg-red-50',
          label: 'Emergency',
          description: 'Seek immediate medical attention'
        };
      case 'urgent':
        return {
          color: 'bg-purple-500',
          textColor: 'text-purple-600',
          bgColor: 'bg-purple-50',
          label: 'Urgent',
          description: 'Medical attention needed within 24 hours'
        };
      case 'routine':
        return {
          color: 'bg-blue-500',
          textColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          label: 'Routine',
          description: 'Schedule appointment in next few days'
        };
      default:
        return {
          color: 'bg-green-500',
          textColor: 'text-green-600',
          bgColor: 'bg-green-50',
          label: 'Self-Care',
          description: 'Home care with monitoring recommended'
        };
    }
  };

  const urgencyInfo = getUrgencyInfo(assessmentData.urgencyLevel);

  const handleGetCareOptions = async () => {
    setIsLoadingCare(true);
    try {
      // This would typically call the care-coordinator function
      // For now, we'll simulate the response
      setTimeout(() => {
        setCareRecommendations({
          urgencyLevel: assessmentData.urgencyLevel,
          recommendations: [
            {
              pathway_type: 'teleconsult',
              provider_type: 'doctor',
              priority_level: 'urgent',
              notes: 'Same-day medical consultation recommended.',
              estimated_wait_time: '15-30 minutes',
              cost_estimate: '$75-125'
            }
          ]
        });
        setIsLoadingCare(false);
      }, 2000);
    } catch (error) {
      console.error('Error getting care options:', error);
      toast({
        title: "Error",
        description: "Failed to load care options. Please try again.",
        variant: "destructive"
      });
      setIsLoadingCare(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-carebow-blue to-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Chat
            </Button>
            <h1 className="text-2xl font-bold text-carebow-text-dark">Assessment Results</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Urgency Level Card */}
            <Card className="lg:col-span-2 bg-white/90 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${urgencyInfo.color}`} />
                  Urgency Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`${urgencyInfo.bgColor} rounded-lg p-4 mb-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-lg font-semibold ${urgencyInfo.textColor}`}>
                        {urgencyInfo.label}
                      </h3>
                      <p className="text-sm text-gray-600">{urgencyInfo.description}</p>
                    </div>
                    <AlertTriangle className={`w-6 h-6 ${urgencyInfo.textColor}`} />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-carebow-text-dark">Recommended Action:</h4>
                  <p className="text-carebow-text-medium">{assessmentData.recommendedAction}</p>
                  
                  {assessmentData.redFlags?.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <h5 className="font-medium text-red-800 mb-2">⚠️ Important Warning Signs:</h5>
                      <ul className="text-sm text-red-700 space-y-1">
                        {assessmentData.redFlags.map((flag: string, index: number) => (
                          <li key={index}>• {flag}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-carebow-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {assessmentData.urgencyLevel === 'emergency' ? (
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    <Phone className="w-4 h-4 mr-2" />
                    Call 911
                  </Button>
                ) : (
                  <Button
                    onClick={handleGetCareOptions}
                    disabled={isLoadingCare}
                    className="w-full bg-gradient-to-r from-carebow-primary to-carebow-secondary hover:from-carebow-primary/90 hover:to-carebow-secondary/90 text-white"
                  >
                    {isLoadingCare ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Finding Care Options...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Get Care Options
                      </>
                    )}
                  </Button>
                )}
                {showConnectProviderButton && (assessmentData.urgencyLevel === 'urgent' || assessmentData.urgencyLevel === 'emergency') && (
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => window.open('https://cal.com/carebow/30min', '_blank')}> {/* Replace with real provider link */}
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Connect to Provider
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  <MapPin className="w-4 h-4 mr-2" />
                  Find Nearby Clinics
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Call CareBow Support
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Possible Conditions */}
          {assessmentData.possibleConditions?.length > 0 && (
            <Card className="mt-6 bg-white/90 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-carebow-primary" />
                  Possible Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assessmentData.possibleConditions.map((condition, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-carebow-text-dark">{condition.condition}</h4>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(condition.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      
                      <Progress value={condition.confidence * 100} className="mb-2 h-2" />
                      
                      <p className="text-sm text-carebow-text-medium">{condition.reasoning}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Care Recommendations */}
          {careRecommendations && (
            <Card className="mt-6 bg-white/90 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle>Care Options Available</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {careRecommendations.recommendations.map((rec: { pathway_type: string; notes: string; estimated_wait_time: string; cost_estimate: string }, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-carebow-text-dark capitalize mb-1">
                            {rec.pathway_type.replace('_', ' ')}
                          </h4>
                          <p className="text-sm text-carebow-text-medium mb-2">{rec.notes}</p>
                          <div className="flex items-center gap-4 text-xs text-carebow-text-light">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{rec.estimated_wait_time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>💰</span>
                              <span>{rec.cost_estimate}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-carebow-text-light group-hover:text-carebow-primary transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Disclaimer */}
          <Card className="mt-6 bg-blue-50 border-blue-200 shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> This AI assessment is for informational purposes only and does not replace professional medical advice. 
                Always consult with a qualified healthcare provider for proper diagnosis and treatment.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AssessmentResults;