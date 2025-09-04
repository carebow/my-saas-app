import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { 
  Sparkles, 
  Shield, 
  Heart, 
  Leaf, 
  MessageCircle, 
  Mic, 
  BookOpen, 
  AlertTriangle,
  Activity,
  UserCheck,
  Settings2,
  Award,
  CheckCircle2,
  Info,
  Phone,
  Stethoscope,
  Brain,
  Pill
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EnhancedVoiceInterface } from './EnhancedVoiceInterface';
import { AyurvedicDashboard } from './AyurvedicDashboard';
import { HealthEducationHub } from './HealthEducationHub';
import { AskCareBowApp } from '../askcareblow/AskCareBowApp';

export const BetaCareBow: React.FC = () => {
  const [activeTab, setActiveTab] = useState('askcareblow');
  const [showBetaNotice, setShowBetaNotice] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Beta Notice */}
        {showBetaNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert className="border-primary/20 bg-gradient-to-r from-primary/5 to-blue-50/50">
              <Sparkles className="h-4 w-4 text-primary" />
              <AlertDescription className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">BETA</Badge>
                  <span className="text-sm">
                    You're experiencing the future of AI-powered health guidance. 
                    Powered by GPT-4 & Evidence-Based Ayurvedic Principles.
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowBetaNotice(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/70 rounded-full shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-blue-600 to-green-600 bg-clip-text text-transparent">
                Ask CareBow
              </h1>
              <div className="flex items-center justify-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">BETA</Badge>
                <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
                  <Shield className="h-3 w-3 mr-1" />
                  Trusted AI
                </Badge>
              </div>
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Your Professional AI Health Companion
          </p>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            Combining evidence-based medical knowledge, time-tested Ayurvedic wisdom, 
            and cutting-edge AI to provide personalized, holistic health guidance
          </p>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4 text-primary" />
              <span>Powered by GPT-4</span>
            </div>
            <div className="flex items-center gap-1">
              <Leaf className="h-4 w-4 text-green-600" />
              <span>5000+ Ayurvedic Remedies</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Evidence-Based</span>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 h-12">
              <TabsTrigger value="askcareblow" className="flex items-center gap-2 text-sm">
                <Stethoscope className="h-4 w-4" />
                Ask CareBow
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-2 text-sm">
                <Mic className="h-4 w-4" />
                Voice AI
              </TabsTrigger>
              <TabsTrigger value="ayurveda" className="flex items-center gap-2 text-sm">
                <Leaf className="h-4 w-4" />
                Ayurveda
              </TabsTrigger>
              <TabsTrigger value="learn" className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4" />
                Learn
              </TabsTrigger>
            </TabsList>

            <TabsContent value="askcareblow">
              <AskCareBowApp />
            </TabsContent>

            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Health Interface */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="lg:col-span-2"
                >
                  <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Heart className="h-6 w-6 text-primary" />
                        How can I help you today?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          onClick={() => setActiveTab('voice')}
                          size="lg"
                          className="h-24 flex flex-col items-center gap-3 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                        >
                          <Mic className="h-8 w-8" />
                          <div className="text-center">
                            <p className="font-semibold">Voice Chat</p>
                            <p className="text-xs opacity-90">
                              Start conversation
                            </p>
                          </div>
                        </Button>
                        <Button
                          onClick={() => setActiveTab('ayurveda')}
                          variant="outline"
                          size="lg"
                          className="h-24 flex flex-col items-center gap-3 hover:bg-green-50 border-green-200"
                        >
                          <Leaf className="h-8 w-8 text-green-600" />
                          <div className="text-center">
                            <p className="font-semibold">Ayurvedic Guidance</p>
                            <p className="text-xs text-muted-foreground">
                              Natural remedies
                            </p>
                          </div>
                        </Button>
                      </div>

                      {/* Quick Health Check */}
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                          <Activity className="h-4 w-4 text-primary" />
                          Quick Health Check
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="ghost" size="sm" className="justify-start">
                            "I have a headache"
                          </Button>
                          <Button variant="ghost" size="sm" className="justify-start">
                            "Feeling tired lately"
                          </Button>
                          <Button variant="ghost" size="sm" className="justify-start">
                            "Stress management"
                          </Button>
                          <Button variant="ghost" size="sm" className="justify-start">
                            "Better sleep tips"
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Health Status & Trust */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  {/* Health Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-green-500" />
                        Health Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="font-medium text-green-700">Profile Complete</p>
                        <p className="text-sm text-green-600">Ready for personalized guidance</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>AI Personality:</span>
                          <Badge variant="outline">
                            Caring Nurse
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Medical Approach:</span>
                          <Badge variant="outline">
                            Integrated
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trust & Credentials */}
                  <Card className="border-blue-200 bg-blue-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-700">
                        <Shield className="h-5 w-5" />
                        Trust & Safety
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>GPT-4 Powered AI</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Evidence-Based Guidelines</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>5000+ Ayurvedic References</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>HIPAA Compliant</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Emergency & Professional Care */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-700">
                      <AlertTriangle className="h-5 w-5" />
                      Need Professional Care?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Button variant="destructive" size="lg" className="h-16">
                        <div className="text-center">
                          <Phone className="h-5 w-5 mx-auto mb-1" />
                          <p className="font-semibold text-sm">Emergency</p>
                          <p className="text-xs">Call 911</p>
                        </div>
                      </Button>
                      <Button variant="outline" size="lg" className="h-16 border-orange-200">
                        <div className="text-center">
                          <Stethoscope className="h-5 w-5 mx-auto mb-1" />
                          <p className="font-semibold text-sm">Urgent Care</p>
                          <p className="text-xs">Find nearby</p>
                        </div>
                      </Button>
                      <Button variant="outline" size="lg" className="h-16 border-green-200">
                        <div className="text-center">
                          <Pill className="h-5 w-5 mx-auto mb-1" />
                          <p className="font-semibold text-sm">Ayurvedic Dr.</p>
                          <p className="text-xs">Consultation</p>
                        </div>
                      </Button>
                      <Button variant="outline" size="lg" className="h-16 border-blue-200">
                        <div className="text-center">
                          <Heart className="h-5 w-5 mx-auto mb-1" />
                          <p className="font-semibold text-sm">CareBow Care</p>
                          <p className="text-xs">Book visit</p>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Medical Disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Medical Disclaimer:</strong> CareBow provides general health information and should not replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical concerns. In emergencies, call 911 immediately. Our AI combines evidence-based medicine with traditional Ayurvedic principles for educational purposes only.
                  </AlertDescription>
                </Alert>
              </motion.div>
            </TabsContent>

            <TabsContent value="voice">
              <EnhancedVoiceInterface />
            </TabsContent>

            <TabsContent value="ayurveda">
              <AyurvedicDashboard />
            </TabsContent>

            <TabsContent value="learn">
              <HealthEducationHub />
            </TabsContent>


          </Tabs>
      </div>
    </div>
  );
};