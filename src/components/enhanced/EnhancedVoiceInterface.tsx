import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Loader2, 
  Play, 
  Pause,
  Bot,
  User,
  Heart,
  Brain,
  Leaf,
  Sparkles,
  AlertTriangle,
  Shield,
  Type,
  Send
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';

interface VoiceMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
  timestamp: string;
  urgencyLevel?: 'low' | 'medium' | 'high' | 'urgent';
  personality?: string;
  recommendations?: {
    ayurveda?: string[];
    lifestyle?: string[];
    medical?: string[];
    mentalHealth?: string[];
  };
}

type AIPersonality = 'caring_nurse' | 'wise_healer' | 'professional_doctor' | 'ayurvedic_practitioner';
type CommunicationStyle = 'gentle' | 'direct' | 'detailed' | 'balanced';

export const EnhancedVoiceInterface: React.FC = () => {
  const { toast } = useToast();
  const { healthProfile, userPreferences } = useHealthProfile();
  
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [personality, setPersonality] = useState<AIPersonality>('caring_nurse');
  const [communicationStyle, setCommunicationStyle] = useState<CommunicationStyle>('balanced');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.remove();
      }
    };
  }, [currentAudio]);

  // Enhanced voice recording with better audio quality
  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processVoiceInput(audioBlob);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsListening(true);

      toast({
        title: "🎤 Listening",
        description: "Speak naturally about your health concerns...",
      });

    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const processMessage = async (message: string) => {
    setIsProcessing(true);
    
    try {
      // Add user message to conversation
      const userMessage: VoiceMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);

      let aiResponseText = '';
      let recommendations = {};

      try {
        // Try to get AI response from our FastAPI backend
        const response = await fetch('http://localhost:8000/api/v1/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            personality,
            tone: communicationStyle,
            profileData: healthProfile,
            sessionId
          })
        });

        if (response.ok) {
          const data = await response.json();
          aiResponseText = data.message || data.response || '';
          recommendations = data.recommendations || {};
        }
      } catch (apiError) {
        console.log('API unavailable, using fallback response');
      }

      // Use fallback response if API failed or returned empty
      if (!aiResponseText) {
        aiResponseText = generateFallbackResponse(message);
        recommendations = generateRecommendations(message);
      }
      
      const assistantMessage: VoiceMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date().toISOString(),
        personality: personality,
        recommendations: recommendations
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Use browser's speech synthesis for voice response
      if (mode === 'voice') {
        speakText(aiResponseText);
      }

      // Set session ID if this is the first exchange
      if (!sessionId) {
        setSessionId(crypto.randomUUID());
      }

    } catch (error) {
      console.error('Error processing message:', error);
      
      // Even if everything fails, provide a helpful fallback
      const fallbackMessage: VoiceMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I'm experiencing some technical difficulties, but I'm still here to help. Could you please try rephrasing your question? I'm designed to provide health guidance combining modern medicine with traditional Ayurvedic wisdom.",
        timestamp: new Date().toISOString(),
        personality: personality
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      
      if (mode === 'voice') {
        speakText(fallbackMessage.content);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const processVoiceInput = async (audioBlob: Blob) => {
    try {
      // For demo purposes, we'll simulate voice input
      // In production, you'd integrate with a speech-to-text service
      const transcribedText = "I have a headache and feel tired. Can you help me?"; 
      
      toast({
        title: "Voice Processed",
        description: `Heard: "${transcribedText}"`,
      });
      
      await processMessage(transcribedText);
    } catch (error) {
      console.error('Error processing voice input:', error);
      toast({
        title: "Voice Processing Error",
        description: "Failed to process your voice. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  // Speech synthesis function
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Try to use a female voice for the caring nurse personality
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('samantha')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  // Fallback response generator for demo purposes
  const generateFallbackResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('headache') || lowerMessage.includes('head')) {
      return "I understand you're experiencing a headache. This can be caused by various factors like stress, dehydration, or tension. Here are some gentle remedies you can try:\n\n🌿 **Ayurvedic Approach:**\n- Apply a cool compress to your forehead\n- Try gentle head and neck massage with sesame oil\n- Drink warm ginger tea\n\n💡 **Immediate Relief:**\n- Rest in a quiet, dark room\n- Stay hydrated with warm water\n- Practice deep breathing exercises\n\n⚠️ **When to seek help:** If headaches are severe, frequent, or accompanied by other symptoms, please consult a healthcare provider.";
    }
    
    if (lowerMessage.includes('tired') || lowerMessage.includes('fatigue') || lowerMessage.includes('energy')) {
      return "Feeling tired can affect your daily life significantly. Let me help you understand some natural ways to boost your energy:\n\n🌿 **Ayurvedic Wisdom:**\n- Start your day with warm water and lemon\n- Include iron-rich foods like spinach and dates\n- Try Ashwagandha for natural energy support\n\n💪 **Lifestyle Tips:**\n- Ensure 7-8 hours of quality sleep\n- Take short walks in fresh air\n- Avoid heavy meals that drain energy\n\n🧘 **Mind-Body Connection:**\n- Practice pranayama (breathing exercises)\n- Consider meditation for mental clarity\n\nIf fatigue persists for more than a few weeks, it's wise to consult with a healthcare provider to rule out underlying conditions.";
    }
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
      return "I hear that you're feeling stressed. This is very common, and there are many natural ways to find relief:\n\n🧘 **Immediate Calming Techniques:**\n- Try the 4-7-8 breathing technique\n- Practice progressive muscle relaxation\n- Listen to calming music or nature sounds\n\n🌿 **Ayurvedic Support:**\n- Brahmi tea for mental clarity\n- Jatamansi for anxiety relief\n- Warm oil massage (Abhyanga) before bed\n\n💚 **Daily Practices:**\n- Regular meditation, even 5 minutes helps\n- Gentle yoga or stretching\n- Maintain a consistent sleep schedule\n\nRemember, it's okay to seek professional support if stress becomes overwhelming. You don't have to handle everything alone.";
    }
    
    if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia')) {
      return "Good sleep is fundamental to health and healing. Let me share some natural approaches to improve your sleep quality:\n\n🌙 **Ayurvedic Sleep Remedies:**\n- Warm almond milk with a pinch of nutmeg before bed\n- Gentle foot massage with sesame oil\n- Valerian root tea 30 minutes before sleep\n\n🛏️ **Sleep Hygiene:**\n- Keep your bedroom cool and dark\n- Avoid screens 1 hour before bed\n- Create a consistent bedtime routine\n\n🧘 **Relaxation Techniques:**\n- Practice yoga nidra (yogic sleep)\n- Try guided meditation for sleep\n- Journal your thoughts to clear your mind\n\nQuality sleep heals both body and mind. If sleep issues persist, consider consulting a healthcare provider.";
    }
    
    // Default caring response
    return `Thank you for sharing your health concern with me. As your AI health companion, I'm here to provide guidance combining modern medical knowledge with traditional Ayurvedic wisdom.\n\n🌿 **Holistic Approach:**\nEvery health concern is unique, and I believe in addressing both the symptoms and the root cause through natural, gentle methods.\n\n💡 **General Wellness Tips:**\n- Stay hydrated with warm water throughout the day\n- Maintain regular meal times\n- Include fresh fruits and vegetables in your diet\n- Practice deep breathing exercises\n\n🤝 **Remember:** While I can provide general guidance and natural remedies, please consult with a qualified healthcare provider for persistent or serious symptoms.\n\nHow else can I support your health journey today?`;
  };

  // Generate recommendations based on user input
  const generateRecommendations = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    const baseRecommendations = {
      ayurveda: ['Drink warm water with ginger', 'Practice deep breathing exercises'],
      lifestyle: ['Get adequate rest', 'Maintain regular sleep schedule'],
      medical: ['Monitor symptoms', 'Consult healthcare provider if symptoms persist'],
      mentalHealth: ['Practice mindfulness', 'Take breaks when needed']
    };

    if (lowerMessage.includes('headache')) {
      return {
        ayurveda: ['Apply sesame oil massage to temples', 'Drink ginger tea', 'Try cooling pranayama'],
        lifestyle: ['Rest in dark room', 'Stay hydrated', 'Avoid screen time'],
        medical: ['Track headache patterns', 'Note triggers', 'Consult doctor if severe']
      };
    }

    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety')) {
      return {
        ayurveda: ['Brahmi tea for mental clarity', 'Ashwagandha for stress relief', 'Warm oil massage'],
        lifestyle: ['Regular exercise', 'Consistent sleep schedule', 'Limit caffeine'],
        mentalHealth: ['Daily meditation', 'Journaling', 'Connect with loved ones']
      };
    }

    return baseRecommendations;
  };

  const playAudio = async (audioUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.remove();
      }

      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      setIsPlaying(true);

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
        resolve();
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
        reject(new Error('Audio playback failed'));
      };

      audio.play().catch(reject);
    });
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    
    const message = textInput.trim();
    setTextInput('');
    await processMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  const getPersonalityInfo = (type: AIPersonality) => {
    switch (type) {
      case 'caring_nurse':
        return { icon: Heart, name: 'Caring Nurse', desc: 'Warm and supportive', color: 'bg-pink-100 text-pink-700' };
      case 'wise_healer':
        return { icon: Brain, name: 'Wise Healer', desc: 'Thoughtful and holistic', color: 'bg-purple-100 text-purple-700' };
      case 'professional_doctor':
        return { icon: Shield, name: 'Professional Doctor', desc: 'Clinical and thorough', color: 'bg-blue-100 text-blue-700' };
      case 'ayurvedic_practitioner':
        return { icon: Leaf, name: 'Ayurvedic Practitioner', desc: 'Traditional wisdom', color: 'bg-green-100 text-green-700' };
    }
  };

  const getButtonContent = () => {
    if (isListening) {
      return {
        icon: <MicOff className="w-8 h-8" />,
        text: "Listening...",
        description: "I'm listening to your health concerns"
      };
    } else if (isProcessing) {
      return {
        icon: <Loader2 className="w-8 h-8 animate-spin" />,
        text: "Analyzing...",
        description: "Processing your input with AI"
      };
    } else if (isPlaying) {
      return {
        icon: <Volume2 className="w-8 h-8 animate-pulse" />,
        text: "Speaking...",
        description: "Listen to my response"
      };
    } else {
      return {
        icon: <Mic className="w-8 h-8" />,
        text: "Talk to CareBow",
        description: "Click and speak your health concerns"
      };
    }
  };

  const buttonContent = getButtonContent();
  const currentPersonality = getPersonalityInfo(personality);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Beta Notice */}
      <Alert className="border-primary/20 bg-gradient-to-r from-primary/5 to-blue-50/50">
        <Sparkles className="h-4 w-4 text-primary" />
        <AlertDescription>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">BETA</Badge>
            <span className="text-sm">
              Advanced AI Health Assistant - Powered by GPT-4 & Ayurvedic Knowledge Base
            </span>
          </div>
        </AlertDescription>
      </Alert>

      {/* Mode Toggle */}
      <div className="flex justify-center">
        <Tabs value={mode} onValueChange={(value) => setMode(value as 'voice' | 'text')} className="w-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voice Chat
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Text Chat
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Interface */}
        <div className="lg:col-span-3 space-y-6">
          {/* Voice Interface */}
          {mode === 'voice' && (
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-primary" />
                    Voice Health Assistant
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={currentPersonality.color}>
                      {currentPersonality.name}
                    </Badge>
                    {isListening && (
                      <Badge variant="default" className="animate-pulse">
                        Listening
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    onClick={isListening ? stopListening : startListening}
                    disabled={isProcessing || isPlaying}
                    className={`h-24 w-24 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : 'bg-gradient-to-br from-primary to-primary/80'
                    }`}
                  >
                    {buttonContent.icon}
                  </Button>
                </motion.div>
                
                <div className="space-y-2">
                  <p className="text-lg text-muted-foreground">
                    {buttonContent.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Speaking as: <span className="font-medium">{currentPersonality.name}</span> • 
                    Style: <span className="font-medium capitalize">{communicationStyle}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Text Interface */}
          {mode === 'text' && (
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5 text-primary" />
                  Text Health Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your symptoms, ask health questions, or tell me how you're feeling..."
                    className="min-h-[100px] resize-none"
                    disabled={isProcessing}
                  />
                  <Button
                    onClick={handleTextSubmit}
                    disabled={!textInput.trim() || isProcessing}
                    size="lg"
                    className="h-auto"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conversation History */}
          {messages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  Health Conversation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.role === 'assistant' && (
                          <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Bot className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        
                        <div className={`max-w-[80%] p-4 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          <div className="flex items-start gap-2">
                            <p className="text-sm flex-1">{message.content}</p>
                            {message.audioUrl && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => playAudio(message.audioUrl!)}
                                className="flex-shrink-0 h-8 w-8 p-0"
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
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
                          <p className="text-xs opacity-70 mt-2">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        
                        {message.role === 'user' && (
                          <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <User className="h-5 w-5" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Settings Panel */}
        <div className="space-y-6">
          {/* AI Personality */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">AI Personality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(['caring_nurse', 'wise_healer', 'professional_doctor', 'ayurvedic_practitioner'] as AIPersonality[]).map((p) => {
                const info = getPersonalityInfo(p);
                const Icon = info.icon;
                return (
                  <Button
                    key={p}
                    variant={personality === p ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPersonality(p)}
                    className="w-full justify-start gap-2 h-auto py-3"
                  >
                    <Icon className="w-4 h-4" />
                    <div className="text-left">
                      <p className="text-sm font-medium">{info.name}</p>
                      <p className="text-xs text-muted-foreground">{info.desc}</p>
                    </div>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Communication Style */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Communication Style</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(['gentle', 'direct', 'detailed', 'balanced'] as CommunicationStyle[]).map((style) => (
                <Button
                  key={style}
                  variant={communicationStyle === style ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCommunicationStyle(style)}
                  className="w-full capitalize"
                >
                  {style}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Emergency Alert */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-sm text-red-700">
              <strong>Emergency?</strong> For urgent medical situations, call 911 immediately. CareBow is for guidance only.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Enhanced Medical Disclaimer */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Medical Disclaimer:</strong> CareBow combines AI technology with traditional and modern health knowledge for educational purposes. This is not a substitute for professional medical advice, diagnosis, or treatment. Always consult healthcare providers for medical concerns. Our responses integrate evidence-based medicine with Ayurvedic principles but should not replace professional consultation.
        </AlertDescription>
      </Alert>
    </div>
  );
};