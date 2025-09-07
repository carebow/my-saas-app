import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Mic, 
  MicOff, 
  Settings, 
  History, 
  Heart, 
  Shield, 
  Sparkles,
  MessageCircle,
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown,
  Download,
  Trash2,
  Plus,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { PersonalizedRemedyCard } from './PersonalizedRemedyCard';
import { VoiceRecorder } from './VoiceRecorder';
import { ChatHistory } from './ChatHistory';
import { UserPreferences } from './UserPreferences';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  remedies?: Remedy[];
  analysis?: {
    sentiment?: string;
    urgency?: string;
    topics?: string[];
    needs_comfort?: boolean;
  };
  modality?: 'text' | 'voice';
}

interface Remedy {
  id: string;
  type: string;
  title: string;
  description: string;
  instructions: string;
  safety_level: string;
  confidence_score: number;
  personalization_factors: string[];
}

interface ChatSession {
  id: string;
  title: string;
  status: string;
  created_at: string;
  last_activity: string;
  message_count: number;
}

interface UserPreferences {
  communication_style: string;
  ai_personality: string;
  response_length: string;
  remedy_preferences: Record<string, any>;
  cultural_considerations: Record<string, any>;
  voice_preferences: Record<string, any>;
}

const EnhancedAskCareBow: React.FC = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Load initial data
  useEffect(() => {
    if (user) {
      loadUserPreferences();
      loadChatSessions();
    }
  }, [user]);
  
  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [currentMessage]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const loadUserPreferences = async () => {
    try {
      const response = await fetch('/api/v1/enhanced-chat/preferences', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      const data = await response.json();
      setUserPreferences(data);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };
  
  const loadChatSessions = async () => {
    try {
      const response = await fetch('/api/v1/enhanced-chat/sessions', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };
  
  const createNewSession = async () => {
    try {
      const response = await fetch('/api/v1/enhanced-chat/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      setCurrentSession(data.id);
      setMessages([]);
      setSessions(prev => [data, ...prev]);
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `Hello ${user?.full_name || 'there'}! I'm Ask CareBow, your AI health companion. I'm here to listen, understand, and provide personalized guidance for your health concerns.\n\nI remember our past conversations and will tailor my advice specifically to you. How are you feeling today?`,
        timestamp: new Date().toISOString(),
        analysis: {
          sentiment: 'positive',
          urgency: 'low',
          topics: ['greeting'],
          needs_comfort: false
        }
      };
      setMessages([welcomeMessage]);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new session",
        variant: "destructive"
      });
    }
  };
  
  const loadSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/v1/enhanced-chat/sessions/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      const data = await response.json();
      
      setCurrentSession(sessionId);
      setMessages(data.messages || []);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load session",
        variant: "destructive"
      });
    }
  };
  
  const sendMessage = async (content: string, modality: 'text' | 'voice' = 'text', audioUri?: string) => {
    if (!content.trim() || isLoading || !currentSession) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      modality
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    setIsTyping(true);
    
    try {
      const response = await fetch(`/api/v1/enhanced-chat/sessions/${currentSession}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: content.trim(),
          message_type: modality,
          audio_uri: audioUri
        })
      });
      
      const data = await response.json();
      
      const aiMessage: Message = {
        id: data.message_id,
        role: 'assistant',
        content: data.content,
        timestamp: data.timestamp,
        remedies: data.remedies || [],
        analysis: data.analysis || {}
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
        analysis: { sentiment: 'neutral', urgency: 'low' }
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };
  
  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      sendMessage(currentMessage);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleVoiceResult = (transcript: string, audioUri?: string) => {
    if (transcript.trim()) {
      sendMessage(transcript, 'voice', audioUri);
    }
  };
  
  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'emergency': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      case 'concerned': return '😟';
      case 'anxious': return '😰';
      default: return '😐';
    }
  };
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-carebow-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-carebow-text-medium mb-4">
              Please sign in to access Ask CareBow for personalized health guidance.
            </p>
            <Button onClick={() => window.location.href = '/auth'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-carebow-blue to-white">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-carebow-primary to-carebow-secondary rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-carebow-text-dark">Ask CareBow</h1>
                <p className="text-carebow-text-medium">Your AI Health Companion</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Dialog open={showHistory} onOpenChange={setShowHistory}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <History className="w-4 h-4 mr-2" />
                    History
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Chat History</DialogTitle>
                  </DialogHeader>
                  <ChatHistory 
                    sessions={sessions}
                    onSelectSession={loadSession}
                    currentSession={currentSession}
                  />
                </DialogContent>
              </Dialog>
              
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Preferences</DialogTitle>
                  </DialogHeader>
                  <UserPreferences 
                    preferences={userPreferences}
                    onUpdate={setUserPreferences}
                  />
                </DialogContent>
              </Dialog>
              
              <Button onClick={createNewSession} className="bg-gradient-to-r from-carebow-primary to-carebow-secondary">
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>
          </motion.div>
          
          {/* Main Chat Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chat Area */}
            <div className="lg:col-span-3">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b bg-gradient-to-r from-carebow-primary/5 to-carebow-secondary/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="w-5 h-5 text-carebow-primary" />
                      {currentSession ? 'Health Conversation' : 'Start a New Conversation'}
                    </CardTitle>
                    {currentSession && (
                      <Badge variant="outline" className="text-xs">
                        {messages.length} messages
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-carebow-primary/20 to-carebow-secondary/20 rounded-full flex items-center justify-center mb-4">
                          <Heart className="w-8 h-8 text-carebow-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-carebow-text-dark mb-2">
                          Welcome to Ask CareBow
                        </h3>
                        <p className="text-carebow-text-medium mb-6 max-w-md">
                          I'm your AI health companion. I remember our past conversations and provide personalized guidance based on your health profile.
                        </p>
                        <Button onClick={createNewSession} className="bg-gradient-to-r from-carebow-primary to-carebow-secondary">
                          Start New Conversation
                        </Button>
                      </div>
                    ) : (
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
                                <div className="flex items-start justify-between gap-2">
                                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                                  {message.modality === 'voice' && (
                                    <Mic className="w-4 h-4 text-carebow-text-light flex-shrink-0" />
                                  )}
                                </div>
                                
                                {/* Analysis indicators */}
                                {message.analysis && (
                                  <div className="flex items-center gap-2 mt-2">
                                    {message.analysis.sentiment && (
                                      <span className="text-lg">{getSentimentIcon(message.analysis.sentiment)}</span>
                                    )}
                                    {message.analysis.urgency && (
                                      <Badge className={`text-xs ${getUrgencyColor(message.analysis.urgency)}`}>
                                        {message.analysis.urgency}
                                      </Badge>
                                    )}
                                    {message.analysis.topics && message.analysis.topics.length > 0 && (
                                      <div className="flex gap-1">
                                        {message.analysis.topics.slice(0, 2).map((topic, i) => (
                                          <Badge key={i} variant="outline" className="text-xs">
                                            {topic}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                <p className={`text-xs mt-2 ${
                                  message.role === 'user' ? 'text-white/70' : 'text-carebow-text-light'
                                }`}>
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                    
                    {/* Typing indicator */}
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
                              <div className="flex gap-1">
                                <div className="animate-pulse w-2 h-2 bg-carebow-primary rounded-full" />
                                <div className="animate-pulse w-2 h-2 bg-carebow-primary rounded-full delay-100" />
                                <div className="animate-pulse w-2 h-2 bg-carebow-primary rounded-full delay-200" />
                              </div>
                              <span className="text-carebow-text-medium text-sm">CareBow is thinking...</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Input Area */}
                  <div className="border-t bg-gray-50/50 p-4">
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <Textarea
                          ref={textareaRef}
                          value={currentMessage}
                          onChange={(e) => setCurrentMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Describe your health concerns... (Press Enter to send)"
                          className="min-h-[60px] resize-none border-gray-200 focus:border-carebow-primary pr-12"
                          disabled={isLoading}
                        />
                        <div className="absolute right-2 top-2 flex gap-1">
                          <VoiceRecorder
                            onResult={handleVoiceResult}
                            isRecording={isRecording}
                            onRecordingChange={setIsRecording}
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!currentMessage.trim() || isLoading}
                        className="bg-gradient-to-r from-carebow-primary to-carebow-secondary hover:from-carebow-primary/90 hover:to-carebow-secondary/90 text-white px-6"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-center gap-4 mt-3 text-xs text-carebow-text-light">
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        <span>HIPAA Compliant</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>Personalized Care</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>24/7 Available</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar - Remedies and Insights */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {/* Personalized Remedies */}
                {messages.some(m => m.remedies && m.remedies.length > 0) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-carebow-primary" />
                        Personalized Remedies
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {messages
                        .filter(m => m.remedies && m.remedies.length > 0)
                        .flatMap(m => m.remedies!)
                        .slice(0, 3)
                        .map((remedy) => (
                          <PersonalizedRemedyCard key={remedy.id} remedy={remedy} />
                        ))}
                    </CardContent>
                  </Card>
                )}
                
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Preferences
                    </Button>
                    {currentSession && (
                      <Button variant="outline" size="sm" className="w-full justify-start text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Session
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAskCareBow;
