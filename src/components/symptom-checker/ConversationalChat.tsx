import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, AlertTriangle, Clock, Stethoscope, MessageCircle } from 'lucide-react';
import { FeedbackWidget } from '@/components/ui/feedback-widget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import AssessmentResults from './AssessmentResults';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ConversationalChatProps {
  profileData: {
    name?: string;
    date_of_birth?: string;
    gender?: string;
    chronic_conditions?: string[];
    current_medications?: string[];
    emergency_contact_phone?: string;
    [key: string]: unknown;
  } | null;
}

const EXAMPLE_QUESTIONS = [
  "I have a headache and feel tired.",
  "My child has a fever and cough.",
  "I'm feeling chest pain and shortness of breath.",
  "I have a rash on my arm.",
  "What should I do for stomach pain?"
];

const ConversationalChat: React.FC<ConversationalChatProps> = ({ profileData }) => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentData, setAssessmentData] = useState(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting message
    const greeting = {
      id: '1',
      role: 'assistant' as const,
      content: `Hello ${profileData?.name || 'there'}! I'm Ask CareBow, your AI health companion. I'm here to help you understand your symptoms and guide you to the right care.\n\nPlease tell me how you're feeling today. What symptoms are you experiencing?`,
      timestamp: new Date()
    };
    setMessages([greeting]);
  }, [profileData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetConversation = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: `Hello ${profileData?.name || 'there'}! I'm Ask CareBow, your AI health companion. I'm here to help you understand your symptoms and guide you to the right care.\n\nPlease tell me how you're feeling today. What symptoms are you experiencing?`,
      timestamp: new Date()
    }]);
    setSessionId(null);
    setShowAssessment(false);
    setAssessmentData(null);
    setErrorMsg(null);
  };

  const handleQuickReply = (text: string) => {
    setCurrentMessage(text);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;
    setErrorMsg(null);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    setIsTyping(true);
    try {
      // Prepare user context from health profile
      const userContext = {
        age: profileData?.date_of_birth ? 
          new Date().getFullYear() - new Date(profileData.date_of_birth).getFullYear() : undefined,
        gender: profileData?.gender,
        medicalHistory: profileData?.chronic_conditions || [],
        currentMedications: profileData?.current_medications || [],
        location: profileData?.emergency_contact_phone ? 'Location on file' : undefined
      };

      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('symptom-analyzer', {
        body: {
          sessionId,
          profileId: user?.id,
          symptoms: userMessage.content,
          conversationHistory,
          userContext
        },
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined
      });

      if (error || !data) throw error || new Error('No response from AI');

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.analysis.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      
      if (!sessionId) {
        setSessionId(data.sessionId);
      }

      // If assessment is complete, show results
      if (!data.analysis.needsMoreInfo && data.analysis.preliminaryAssessment) {
        setAssessmentData(data.analysis.preliminaryAssessment);
        setShowFeedback(true); // Show feedback when consultation is complete
        setTimeout(() => setShowAssessment(true), 1000);
      }

    } catch (error: unknown) {
      setErrorMsg("Sorry, I couldn't process your request. Please try again or rephrase your symptoms.");
      toast({
        title: "Something went wrong",
        description: error instanceof Error ? error.message : "Failed to analyze symptoms. Please try again.",
        variant: "destructive"
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error while analyzing your symptoms. Please try describing them again, or use one of the example questions below.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'text-red-600 bg-red-50';
      case 'urgent': return 'text-purple-600 bg-purple-50';
      case 'routine': return 'text-blue-600 bg-blue-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  if (showAssessment && assessmentData) {
    return <AssessmentResults assessmentData={assessmentData} onBack={() => setShowAssessment(false)} showConnectProviderButton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-carebow-blue to-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="border-b bg-gradient-to-r from-carebow-primary/5 to-carebow-secondary/5 flex flex-col md:flex-row md:items-center md:justify-between">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-carebow-primary to-carebow-secondary rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-carebow-text-dark">Ask CareBow AI</h2>
                  <p className="text-sm text-carebow-text-medium font-normal">Intelligent Health Assessment</p>
                </div>
              </CardTitle>
              <Button variant="outline" size="sm" className="mt-4 md:mt-0" onClick={resetConversation}>Reset Conversation</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === 'user' 
                            ? 'bg-carebow-primary text-white' 
                            : 'bg-gradient-to-r from-carebow-primary to-carebow-secondary text-white'
                        }`}>
                          {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={`rounded-lg p-4 ${
                          message.role === 'user'
                            ? 'bg-carebow-primary text-white'
                            : 'bg-gray-50 text-carebow-text-dark border'
                        }`}>
                          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                          <p className={`text-xs mt-2 ${
                            message.role === 'user' ? 'text-white/70' : 'text-carebow-text-light'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-carebow-primary to-carebow-secondary flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-50 border rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <div className="animate-pulse w-4 h-4 bg-carebow-primary rounded-full" />
                          <span className="text-carebow-text-medium">CareBow is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {errorMsg && (
                <div className="p-4 text-red-600 bg-red-50 border-t border-red-200 text-center text-sm">{errorMsg}</div>
              )}
              <div className="border-t bg-gray-50/50 p-4">
                <div className="flex gap-3">
                  <Textarea
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your symptoms in detail... (Press Enter to send)"
                    className="flex-1 min-h-[60px] resize-none border-gray-200 focus:border-carebow-primary"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || isLoading}
                    className="bg-gradient-to-r from-carebow-primary to-carebow-secondary hover:from-carebow-primary/90 hover:to-carebow-secondary/90 text-white px-6"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {EXAMPLE_QUESTIONS.map((q, i) => (
                    <Button key={i} variant="outline" size="sm" onClick={() => handleQuickReply(q)}>{q}</Button>
                  ))}
                </div>
                
                {/* Feedback Widget - Show when consultation is complete */}
                {showFeedback && sessionId && (
                  <div className="mt-4">
                    <FeedbackWidget
                      conversationId={sessionId}
                      onFeedbackSubmitted={(rating, comment) => {
                        console.log('Feedback submitted:', { rating, comment });
                      }}
                    />
                  </div>
                )}
                <div className="flex items-center justify-center gap-4 mt-3 text-xs text-carebow-text-light">
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>For emergencies, call 911</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Stethoscope className="w-3 h-3" />
                    <span>AI guidance, not medical diagnosis</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ConversationalChat;