import React, { useState, useRef, useEffect } from 'react';
// import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useToast } from './ui/use-toast';
import { useHealthProfile } from '../hooks/useHealthProfile';
import { supabase } from '../../integrations/supabase/client';
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
  Settings
} from 'lucide-react';

interface VoiceMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
  timestamp: string;
}

export const VoiceInterface: React.FC = () => {
  const { toast } = useToast();
  const { healthProfile, userPreferences } = useHealthProfile();
  
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

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
        
        // Stop all tracks to free up the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsListening(true);

      toast({
        title: "Listening",
        description: "Speak now, I'm listening to your health concerns...",
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

  const processVoiceInput = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Convert audio to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        const base64Data = base64Audio.split(',')[1];

        // Transcribe audio using OpenAI Whisper
        const transcriptionResponse = await supabase.functions.invoke('voice-to-text', {
          body: { audio: base64Data }
        });

        if (transcriptionResponse.error) {
          throw new Error('Failed to transcribe audio');
        }

        const userMessage = transcriptionResponse.data.text;
        
        // Add user message to conversation
        const userMessageObj: VoiceMessage = {
          id: crypto.randomUUID(),
          role: 'user',
          content: userMessage,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, userMessageObj]);

        // Get AI response with voice
        const voiceResponse = await supabase.functions.invoke('voice-chat-enhanced', {
          body: {
            message: userMessage,
            personality: userPreferences?.ai_personality || 'caring_nurse',
            tone: userPreferences?.communication_style || 'balanced',
            profileData: healthProfile,
            sessionId
          }
        });

        if (voiceResponse.error) {
          throw new Error('Failed to get AI response');
        }

        const { text, audioContent } = voiceResponse.data;
        
        // Create audio element for playback
        const audioUrl = `data:audio/mp3;base64,${audioContent}`;
        
        const assistantMessage: VoiceMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: text,
          audioUrl,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Auto-play the response
        await playAudio(audioUrl);

        // Set session ID if this is the first exchange
        if (!sessionId) {
          setSessionId(crypto.randomUUID());
        }
      };

    } catch (error) {
      console.error('Error processing voice input:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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

  const togglePlayback = (audioUrl: string) => {
    if (currentAudio && !currentAudio.paused) {
      currentAudio.pause();
      setIsPlaying(false);
    } else {
      playAudio(audioUrl);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setSessionId(null);
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    setIsPlaying(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Voice Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-primary" />
              Voice Health Assistant
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {userPreferences?.ai_personality || 'caring_nurse'} mode
              </Badge>
              {isListening && (
                <Badge variant="default" className="animate-pulse">
                  Listening
                </Badge>
              )}
              {isProcessing && (
                <Badge variant="secondary">
                  Processing
                </Badge>
              )}
              {isPlaying && (
                <Badge variant="default">
                  Speaking
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing || isPlaying}
                className={`h-20 w-20 rounded-full ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {isProcessing ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : isListening ? (
                  <MicOff className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </Button>
            </motion.div>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            {isListening 
              ? "I'm listening... Click to stop recording"
              : isProcessing 
                ? "Processing your message..."
                : isPlaying 
                  ? "CareBow is speaking..."
                  : "Click to start talking to CareBow"
            }
          </p>
        </CardContent>
      </Card>

      {/* Conversation History */}
      {messages.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Conversation
              </CardTitle>
              <Button variant="outline" size="sm" onClick={clearConversation}>
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
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
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] p-3 rounded-lg ${
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
                          onClick={() => togglePlayback(message.audioUrl!)}
                          className="flex-shrink-0 h-6 w-6 p-0"
                        >
                          {isPlaying && currentAudio?.src === message.audioUrl ? (
                            <Pause className="h-3 w-3" />
                          ) : (
                            <Play className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {messages.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Mic className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Talk to CareBow</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Click the microphone and describe your symptoms, health concerns, or ask questions. 
                  CareBow will respond with voice and provide personalized health guidance.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                <span>• Natural conversation</span>
                <span>• Instant voice responses</span>
                <span>• Personalized guidance</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};