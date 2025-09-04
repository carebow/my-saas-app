import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, MessageSquare, Heart, Stethoscope, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Health profile interface
interface HealthProfile {
  age?: number;
  conditions?: string[];
  preferences?: 'traditional' | 'ayurveda' | 'modern' | 'holistic';
  previousSymptoms?: string[];
}

// Conversation message interface
interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
  urgencyLevel?: 'low' | 'medium' | 'high' | 'urgent';
  recommendations?: {
    medical?: string[];
    ayurveda?: string[];
    mentalHealth?: string[];
    lifestyle?: string[];
  };
}

// AI Personality types
type AIPersonality = 'friendly_nurse' | 'wise_monk' | 'traditional_doctor';

// Conversation tone
type ConversationTone = 'gentle' | 'direct' | 'detailed' | 'short';

const ConversationalVoiceChat = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [healthProfile, setHealthProfile] = useState<HealthProfile>({});
  const [personality, setPersonality] = useState<AIPersonality>('friendly_nurse');
  const [tone, setTone] = useState<ConversationTone>('gentle');
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [interviewMode, setInterviewMode] = useState(false);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  
  const { toast } = useToast();

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.remove();
      }
    };
  }, [currentAudio]);

  // Stop current audio
  const stopCurrentAudio = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
    }
  }, [currentAudio]);

  // Enhanced voice chat with health interview capabilities
  const startVoiceChat = useCallback(async () => {
    try {
      setIsListening(true);
      stopCurrentAudio();

      // Check for speech recognition support
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        throw new Error('Speech recognition not supported in this browser');
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('User said:', transcript);

        // Add user message to conversation
        const userMessage: ConversationMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: transcript,
          timestamp: new Date()
        };
        
        setConversation(prev => [...prev, userMessage]);
        setIsListening(false);
        setIsProcessing(true);

        try {
          // Enhanced prompt with health interview capabilities
          const enhancedPrompt = `
You are Ask CareBow, a compassionate AI health assistant with personality: ${personality} and tone: ${tone}.

User's health profile: ${JSON.stringify(healthProfile)}
Conversation history: ${conversation.map(m => `${m.role}: ${m.content}`).join('\n')}
Current user input: "${transcript}"

Instructions:
1. If this is a health concern, conduct a gentle but thorough interview with follow-up questions
2. Consider holistic approaches: medical advice, Ayurveda, mental health, and lifestyle
3. Assess urgency level (low/medium/high/urgent)
4. Update health profile based on new information
5. Provide personalized recommendations based on user preferences
6. Be empathetic and human-like in your response

${interviewMode ? 'Continue the health interview with relevant follow-up questions.' : 'Begin a health assessment if symptoms are mentioned.'}

Respond in JSON format:
{
  "response": "Your conversational response",
  "urgencyLevel": "low|medium|high|urgent",
  "followUpQuestions": ["question1", "question2"],
  "recommendations": {
    "medical": ["advice1", "advice2"],
    "ayurveda": ["remedy1", "remedy2"],
    "mentalHealth": ["support1", "support2"],
    "lifestyle": ["change1", "change2"]
  },
  "profileUpdates": {
    "symptoms": ["new_symptom"],
    "conditions": ["condition"]
  },
  "nextAction": "continue_interview|provide_summary|urgent_care"
}`;

          // Call the enhanced voice chat function
          const { data, error } = await supabase.functions.invoke('voice-chat', {
            body: { 
              message: enhancedPrompt,
              personality,
              tone,
              healthProfile 
            }
          });

          if (error) throw error;

          let aiResponse;
          try {
            aiResponse = JSON.parse(data.text);
          } catch {
            // Fallback if JSON parsing fails
            aiResponse = {
              response: data.text,
              urgencyLevel: 'low',
              followUpQuestions: [],
              recommendations: {},
              profileUpdates: {},
              nextAction: 'continue_interview'
            };
          }

          // Update health profile with new information
          if (aiResponse.profileUpdates) {
            setHealthProfile(prev => ({
              ...prev,
              ...aiResponse.profileUpdates,
              previousSymptoms: [
                ...(prev.previousSymptoms || []),
                ...(aiResponse.profileUpdates.symptoms || [])
              ]
            }));
          }

          // Set follow-up questions and interview mode
          setFollowUpQuestions(aiResponse.followUpQuestions || []);
          setInterviewMode(aiResponse.nextAction === 'continue_interview');

          // Add AI response to conversation
          const assistantMessage: ConversationMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: aiResponse.response,
            timestamp: new Date(),
            urgencyLevel: aiResponse.urgencyLevel,
            recommendations: aiResponse.recommendations
          };

          setConversation(prev => [...prev, assistantMessage]);

          // Play audio response
          if (data.audioContent) {
            const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
            setCurrentAudio(audio);
            setIsPlaying(true);
            
            audio.onended = () => {
              setIsPlaying(false);
              setCurrentAudio(null);
            };
            
            audio.onerror = () => {
              console.error('Audio playback failed');
              setIsPlaying(false);
              setCurrentAudio(null);
            };
            
            await audio.play();
          }

          // Show urgent care notification if needed
          if (aiResponse.urgencyLevel === 'urgent') {
            toast({
              title: "Urgent Care Needed",
              description: "Based on your symptoms, please consider seeking immediate medical attention.",
              variant: "destructive",
            });
          }

        } catch (error: unknown) {
          console.error('Voice chat error:', error);
          toast({
            title: "Processing Error",
            description: error instanceof Error ? error.message : "Failed to process your message. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Please check your microphone and try again.",
          variant: "destructive",
        });
      };

      recognition.start();

    } catch (error: unknown) {
      console.error('Speech recognition setup error:', error);
      setIsListening(false);
      toast({
        title: "Setup Error",
        description: error instanceof Error ? error.message : "Failed to setup voice recognition",
        variant: "destructive",
      });
    }
  }, [conversation, healthProfile, personality, tone, interviewMode, currentAudio, stopCurrentAudio, toast]);

  // Quick reply function for follow-up questions
  const handleQuickReply = useCallback((question: string) => {
    setConversation(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date()
    }]);
    
    // Process the quick reply
    setTimeout(() => {
      startVoiceChat();
    }, 100);
  }, [startVoiceChat]);

  // Get personality icon and description
  const getPersonalityInfo = (type: AIPersonality) => {
    switch (type) {
      case 'friendly_nurse':
        return { icon: Heart, name: 'Friendly Nurse', desc: 'Caring and supportive' };
      case 'wise_monk':
        return { icon: Stethoscope, name: 'Wise Monk', desc: 'Mindful and holistic' };
      case 'traditional_doctor':
        return { icon: Leaf, name: 'Traditional Doctor', desc: 'Clinical and thorough' };
    }
  };

  // Get urgency color
  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'urgent': return 'destructive';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      default: return 'green';
    }
  };

  // Get button content based on state
  const getButtonContent = () => {
    if (isListening) {
      return {
        icon: <MicOff className="w-8 h-8" />,
        text: "Listening...",
        description: "Speak now, I'm listening to your health concerns"
      };
    } else if (isProcessing) {
      return {
        icon: <Stethoscope className="w-8 h-8 animate-pulse" />,
        text: "Analyzing...",
        description: "Processing your symptoms and preparing recommendations"
      };
    } else if (isPlaying) {
      return {
        icon: <Volume2 className="w-8 h-8 animate-pulse" />,
        text: "Speaking...",
        description: "Listen to my response and recommendations"
      };
    } else {
      return {
        icon: <Mic className="w-8 h-8" />,
        text: "Talk to CareBow",
        description: "Tap and tell me about your health concerns"
      };
    }
  };

  const buttonContent = getButtonContent();
  const currentPersonality = getPersonalityInfo(personality);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Personality and Tone Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex gap-2">
          {(['friendly_nurse', 'wise_monk', 'traditional_doctor'] as AIPersonality[]).map((p) => {
            const info = getPersonalityInfo(p);
            const Icon = info.icon;
            return (
              <Button
                key={p}
                variant={personality === p ? "default" : "outline"}
                size="sm"
                onClick={() => setPersonality(p)}
                className="gap-1"
              >
                <Icon className="w-3 h-3" />
                {info.name}
              </Button>
            );
          })}
        </div>
        <div className="flex gap-2">
          {(['gentle', 'direct', 'detailed', 'short'] as ConversationTone[]).map((t) => (
            <Button
              key={t}
              variant={tone === t ? "default" : "outline"}
              size="sm"
              onClick={() => setTone(t)}
              className="capitalize"
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Voice Interface */}
      <div className="text-center space-y-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            onClick={startVoiceChat}
            disabled={isListening || isProcessing}
            className="w-32 h-32 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex flex-col items-center gap-2">
              {buttonContent.icon}
              <span className="text-sm">{buttonContent.text}</span>
            </div>
          </Button>
        </motion.div>
        
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-2">
            {buttonContent.description}
          </p>
          <p className="text-sm text-muted-foreground">
            Speaking as: <span className="font-medium">{currentPersonality.name}</span> • 
            Tone: <span className="font-medium capitalize">{tone}</span>
          </p>
        </div>
      </div>

      {/* Follow-up Questions */}
      {followUpQuestions.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Quick Replies:</h3>
            <div className="flex flex-wrap gap-2">
              {followUpQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply(question)}
                  className="text-left whitespace-normal h-auto p-2"
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversation History */}
      <AnimatePresence>
        {conversation.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Conversation</h3>
            {conversation.slice(-6).map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <Card className={`max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        {message.urgencyLevel && message.role === 'assistant' && (
                          <Badge 
                            variant={getUrgencyColor(message.urgencyLevel) as "default" | "destructive" | "outline" | "secondary"}
                            className="mt-2"
                          >
                            {message.urgencyLevel} priority
                          </Badge>
                        )}
                        {message.recommendations && (
                          <div className="mt-3 space-y-2">
                            {Object.entries(message.recommendations).map(([type, items]) => (
                              items && items.length > 0 && (
                                <div key={type}>
                                  <p className="text-xs font-medium opacity-70 capitalize">{type}:</p>
                                  <ul className="text-xs opacity-80 ml-2">
                                    {items.map((item, idx) => (
                                      <li key={idx}>• {item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs opacity-60 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Health Disclaimer */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground text-center">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Ask CareBow provides general health guidance and should not replace professional medical advice. 
            For urgent concerns, please contact emergency services or your healthcare provider.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationalVoiceChat;