import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onstart: () => void;
  onend: () => void;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechRecognition: new () => SpeechRecognition;
  }
}

const SimpleVoiceChat = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastResponse, setLastResponse] = useState<string>('');
  const [userMessage, setUserMessage] = useState<string>('');
  const { toast } = useToast();

  const startVoiceChat = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast({
        title: "Browser not supported",
        description: "Please use Chrome, Safari, or Edge for voice features.",
        variant: "destructive"
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setLastResponse('');
      setUserMessage('');
    };

    recognition.onresult = async (event) => {
      const spokenText = event.results[0][0].transcript;
      setUserMessage(spokenText);
      setIsListening(false);
      setIsProcessing(true);

      try {
        const { data, error } = await supabase.functions.invoke('voice-chat', {
          body: { message: spokenText }
        });

        if (error) throw error;
        if (!data) throw new Error('No response received');

        setLastResponse(data.text);

        if (data.audio_base64) {
          setIsPlaying(true);
          const audio = new Audio(`data:audio/mpeg;base64,${data.audio_base64}`);
          
          audio.onended = () => setIsPlaying(false);
          audio.onerror = () => {
            setIsPlaying(false);
            toast({
              title: "Audio error",
              description: "Couldn't play the voice response, but you can read it above.",
            });
          };
          
          await audio.play();
        }

      } catch (error) {
        console.error('Voice chat error:', error);
        setLastResponse('I apologize, but I encountered an error. Please try again.');
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setIsProcessing(false);
      
      let message = 'Please try again.';
      switch (event.error) {
        case 'no-speech':
          message = 'No speech detected. Please speak clearly.';
          break;
        case 'audio-capture':
        case 'not-allowed':
          message = 'Microphone access needed. Please enable it in your browser.';
          break;
      }

      toast({
        title: "Voice recognition issue",
        description: message,
        variant: "destructive"
      });
    };

    recognition.onend = () => setIsListening(false);

    try {
      recognition.start();
    } catch (error) {
      toast({
        title: "Microphone error",
        description: "Please check your microphone permissions.",
        variant: "destructive"
      });
    }
  };

  const getButtonContent = () => {
    if (isListening) {
      return {
        icon: <MicOff className="w-6 h-6" />,
        text: 'Listening...',
        description: 'Speak now'
      };
    }
    if (isProcessing) {
      return {
        icon: <Heart className="w-6 h-6 animate-pulse" />,
        text: 'Thinking...',
        description: 'Processing your message'
      };
    }
    if (isPlaying) {
      return {
        icon: <Volume2 className="w-6 h-6" />,
        text: 'Speaking...',
        description: 'CareBow is responding'
      };
    }
    return {
      icon: <Mic className="w-6 h-6" />,
      text: 'Ask CareBow',
      description: 'Tap to speak'
    };
  };

  const buttonContent = getButtonContent();
  const isActive = isListening || isProcessing || isPlaying;

  return (
    <div className="flex flex-col items-center space-y-8 max-w-2xl mx-auto p-6">
      {/* Main Voice Button */}
      <motion.div
        className="relative"
        animate={{ scale: isActive ? 1.05 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          onClick={startVoiceChat}
          disabled={isActive}
          className={`
            relative w-40 h-40 rounded-full text-white font-semibold text-lg
            shadow-2xl transition-all duration-300 flex flex-col items-center justify-center gap-2
            ${isListening 
              ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
              : 'bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
            }
          `}
        >
          {buttonContent.icon}
          <span className="text-sm">{buttonContent.text}</span>
        </Button>
        
        {/* Pulse animation for listening */}
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-red-400"
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}
      </motion.div>

      <p className="text-muted-foreground text-center text-sm">
        {buttonContent.description}
      </p>

      {/* Conversation Display */}
      <AnimatePresence mode="wait">
        {(userMessage || lastResponse) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-xl space-y-4"
          >
            {/* User Message */}
            {userMessage && (
              <div className="bg-muted/50 rounded-2xl p-4 ml-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">You</span>
                  </div>
                  <p className="text-sm leading-relaxed">{userMessage}</p>
                </div>
              </div>
            )}

            {/* CareBow Response */}
            {lastResponse && (
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-4 mr-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm leading-relaxed">{lastResponse}</p>
                    {isPlaying && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Volume2 className="w-3 h-3" />
                        Playing audio...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disclaimer */}
      <div className="text-center text-xs text-muted-foreground max-w-md">
        💭 CareBow provides guidance and support, not medical diagnosis. Always consult a healthcare professional for health concerns.
      </div>
    </div>
  );
};

export default SimpleVoiceChat;