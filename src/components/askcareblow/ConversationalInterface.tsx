import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX,
  Heart,
  Stethoscope,
  MessageCircle,
  Bot,
  User,
  Loader2,
  AlertTriangle,
  Phone,
  Calendar,
  Leaf
} from 'lucide-react';
import { FeedbackWidget } from '@/components/ui/feedback-widget';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Message types for the conversation
interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  audioUrl?: string;
  metadata?: {
    urgencyLevel?: 'low' | 'medium' | 'high' | 'emergency';
    suggestedActions?: string[];
    followUpQuestions?: string[];
    riskFactors?: string[];
  };
}

// AI Personality types
type AIPersonality = 'caring_nurse' | 'family_doctor' | 'ayurvedic_practitioner' | 'emergency_triage';

interface ConversationalInterfaceProps {
  initialSymptom?: string;
  userProfile?: {
    age: number;
    gender: string;
    medicalHistory: string[];
    allergies: string[];
    medications: string[];
  };
  onUrgentCare?: (urgencyLevel: string) => void;
  onTriageComplete?: (data: any) => void;
}

export const ConversationalInterface: React.FC<ConversationalInterfaceProps> = ({
  initialSymptom,
  userProfile,
  onUrgentCare,
  onTriageComplete
}) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aiPersonality, setAiPersonality] = useState<AIPersonality>('caring_nurse');
  const [conversationStage, setConversationStage] = useState<'greeting' | 'symptom_gathering' | 'triage' | 'recommendations'>('greeting');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize conversation
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ConversationMessage = {
        id: 'welcome',
        role: 'assistant',
        content: initialSymptom 
          ? `Hello! I understand you're experiencing ${initialSymptom}. I'm here to help you understand what might be going on and guide you to the right care. Let me ask you a few questions to better understand your situation.`
          : `Hello! I'm Ask CareBow, your AI health companion. I'm here to listen to your health concerns and help guide you to the right care. What's bringing you here today?`,
        timestamp: new Date(),
        metadata: {
          urgencyLevel: 'low',
          followUpQuestions: initialSymptom ? [
            'When did this start?',
            'How severe is it on a scale of 1-10?',
            'Have you tried anything for it?'
          ] : [
            'Tell me about your symptoms',
            'How are you feeling today?',
            'What health concerns do you have?'
          ]
        }
      };
      setMessages([welcomeMessage]);
    }
  }, [initialSymptom]);

  // Send message to AI
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      // Prepare conversation context
      const conversationHistory = [...messages, userMessage]
        .map(m => `${m.role}: ${m.content}`)
        .join('\n');

      // Enhanced prompt for medical triage
      const systemPrompt = `You are Ask CareBow, a compassionate AI health assistant with the personality of a ${aiPersonality.replace('_', ' ')}. 

Your role is to:
1. Listen empathetically to health concerns
2. Ask relevant follow-up questions like a skilled triage nurse
3. Assess urgency levels (low/medium/high/emergency)
4. Provide appropriate guidance and next steps
5. Know when to recommend immediate medical care

User Profile: ${JSON.stringify(userProfile)}
Conversation Stage: ${conversationStage}
Conversation History: ${conversationHistory}

Guidelines:
- Be warm, empathetic, and professional
- Ask one focused question at a time
- For emergency symptoms (chest pain, difficulty breathing, severe injuries), immediately recommend calling 911
- For urgent symptoms, recommend urgent care or ER within 24 hours
- For moderate symptoms, suggest teleconsult or doctor visit
- For mild symptoms, provide self-care guidance and natural remedies
- Always explain your reasoning
- Include follow-up questions when appropriate

Respond in JSON format:
{
  "response": "Your empathetic response",
  "urgencyLevel": "low|medium|high|emergency",
  "stage": "greeting|symptom_gathering|triage|recommendations",
  "suggestedActions": ["action1", "action2"],
  "followUpQuestions": ["question1", "question2"],
  "riskFactors": ["factor1", "factor2"],
  "nextSteps": "What should happen next"
}`;

      // Call the AI service
      const { data, error } = await supabase.functions.invoke('enhanced-health-chat', {
        body: { 
          message: content,
          systemPrompt,
          conversationHistory,
          userProfile,
          personality: aiPersonality
        }
      });

      if (error) throw error;

      let aiResponse;
      try {
        aiResponse = JSON.parse(data.response);
      } catch {
        // Fallback if JSON parsing fails
        aiResponse = {
          response: data.response || "I'm here to help. Could you tell me more about how you're feeling?",
          urgencyLevel: 'low',
          stage: 'symptom_gathering',
          suggestedActions: [],
          followUpQuestions: [],
          riskFactors: [],
          nextSteps: 'Continue conversation'
        };
      }

      // Update conversation stage
      setConversationStage(aiResponse.stage);

      // Handle urgent cases
      if (aiResponse.urgencyLevel === 'emergency') {
        onUrgentCare?.(aiResponse.urgencyLevel);
        toast({
          title: "Emergency Detected",
          description: "Please seek immediate medical attention or call 911.",
          variant: "destructive",
        });
      } else if (aiResponse.urgencyLevel === 'high') {
        onUrgentCare?.(aiResponse.urgencyLevel);
        toast({
          title: "Urgent Care Recommended",
          description: "Please consider seeking medical care within 24 hours.",
        });
      }

      // Add AI response
      const assistantMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.response,
        timestamp: new Date(),
        metadata: {
          urgencyLevel: aiResponse.urgencyLevel,
          suggestedActions: aiResponse.suggestedActions,
          followUpQuestions: aiResponse.followUpQuestions,
          riskFactors: aiResponse.riskFactors
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Play audio response if available
      if (data.audioContent) {
        playAudioResponse(data.audioContent);
      }

      // Complete triage if we have enough information
      if (aiResponse.stage === 'recommendations') {
        // Show feedback widget when consultation is complete
        setShowFeedback(true);
        
        onTriageComplete?.({
          urgencyLevel: aiResponse.urgencyLevel,
          suggestedActions: aiResponse.suggestedActions,
          riskFactors: aiResponse.riskFactors,
          conversationSummary: conversationHistory
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Communication Error",
        description: "I'm having trouble processing your message. Please try again.",
        variant: "destructive",
      });
      
      // Add error message
      const errorMessage: ConversationMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your message right now. Could you please try again? If this continues, please consider calling your healthcare provider directly.",
        timestamp: new Date(),
        metadata: {
          urgencyLevel: 'low'
        }
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, [messages, aiPersonality, conversationStage, userProfile, onUrgentCare, onTriageComplete, toast]);

  // Voice input handling
  const startVoiceInput = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice Not Supported",
        description: "Voice input is not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast({
        title: "Voice Recognition Error",
        description: "Please check your microphone and try again.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [toast]);

  // Audio playback
  const playAudioResponse = useCallback((audioContent: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
    audioRef.current = audio;
    setIsPlaying(true);

    audio.onended = () => {
      setIsPlaying(false);
      audioRef.current = null;
    };

    audio.onerror = () => {
      setIsPlaying(false);
      audioRef.current = null;
    };

    audio.play().catch(() => {
      setIsPlaying(false);
      audioRef.current = null;
    });
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }
  }, []);

  // Handle quick reply
  const handleQuickReply = useCallback((question: string) => {
    sendMessage(question);
  }, [sendMessage]);

  // Get urgency color
  const getUrgencyColor = (level?: string) => {
    switch (level) {
      case 'emergency': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-blue-50/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
              Ask CareBow - Health Conversation
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {aiPersonality.replace('_', ' ')}
              </Badge>
              {isPlaying && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stopAudio}
                  className="flex items-center gap-1"
                >
                  <VolumeX className="w-3 h-3" />
                  Stop
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Conversation Area */}
      <Card className="h-[500px] flex flex-col">
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  } rounded-lg p-4`}>
                    <div className="flex items-start gap-2 mb-2">
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 mt-1 flex-shrink-0" />
                      ) : (
                        <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        
                        {/* Urgency indicator */}
                        {message.metadata?.urgencyLevel && message.role === 'assistant' && (
                          <Badge 
                            variant={getUrgencyColor(message.metadata.urgencyLevel) as "default" | "destructive" | "outline" | "secondary"}
                            className="mt-2 text-xs"
                          >
                            {message.metadata.urgencyLevel} priority
                          </Badge>
                        )}
                        
                        {/* Suggested actions */}
                        {message.metadata?.suggestedActions && message.metadata.suggestedActions.length > 0 && (
                          <div className="mt-3 space-y-1">
                            <p className="text-xs font-medium opacity-70">Suggested Actions:</p>
                            {message.metadata.suggestedActions.map((action, index) => (
                              <p key={index} className="text-xs opacity-80">• {action}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs opacity-60">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted rounded-lg p-4 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">CareBow is thinking...</span>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>

        {/* Quick Replies */}
        {messages.length > 0 && messages[messages.length - 1]?.metadata?.followUpQuestions && (
          <div className="border-t p-4">
            <p className="text-sm font-medium mb-2">Quick replies:</p>
            <div className="flex flex-wrap gap-2">
              {messages[messages.length - 1].metadata!.followUpQuestions!.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply(question)}
                  className="text-xs h-8"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Describe your symptoms or ask a question..."
                onKeyPress={(e) => e.key === 'Enter' && !isProcessing && sendMessage(inputMessage)}
                disabled={isProcessing}
                className="pr-12"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={startVoiceInput}
                disabled={isListening || isProcessing}
                className="absolute right-1 top-1 h-8 w-8 p-0"
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-red-500" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button
              onClick={() => sendMessage(inputMessage)}
              disabled={!inputMessage.trim() || isProcessing}
              className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {isListening && (
            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
              <Mic className="w-3 h-3" />
              Listening... Speak now
            </p>
          )}
        </div>
      </Card>

      {/* Feedback Widget - Show when consultation is complete */}
      {showFeedback && conversationId && (
        <FeedbackWidget
          conversationId={conversationId}
          onFeedbackSubmitted={(rating, comment) => {
            console.log('Feedback submitted:', { rating, comment });
          }}
          className="mb-4"
        />
      )}

      {/* Emergency Actions */}
      <Card className="border-red-200 bg-red-50/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-800">Need immediate help?</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="destructive" size="sm">
                <Phone className="w-4 h-4 mr-1" />
                Call 911
              </Button>
              <Button variant="outline" size="sm" className="border-orange-200">
                <Calendar className="w-4 h-4 mr-1" />
                Urgent Care
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};