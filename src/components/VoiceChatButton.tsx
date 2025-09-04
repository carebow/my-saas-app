import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

const VoiceChatButton = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastResponse, setLastResponse] = useState<string>('');
  const { toast } = useToast();

  const startVoiceChat = async () => {
    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser. Please try Chrome or Safari.",
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
      console.log('Speech recognition started');
    };

    recognition.onresult = async (event) => {
      const spokenText = event.results[0][0].transcript;
      console.log('Spoken text:', spokenText);

      setIsListening(false);
      setIsProcessing(true);
      setLastResponse('Thinking...');

      try {
        const { data, error } = await supabase.functions.invoke('voice-chat', {
          body: { message: spokenText }
        });

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('No response received');
        }

        // Show text response
        setLastResponse(data.text);

        // Play voice response
        if (data.audio_base64) {
          setIsPlaying(true);
          const audio = new Audio(`data:audio/mpeg;base64,${data.audio_base64}`);
          
          audio.onended = () => {
            setIsPlaying(false);
          };
          
          audio.onerror = () => {
            setIsPlaying(false);
            toast({
              title: "Audio Playback Error",
              description: "Failed to play the voice response.",
              variant: "destructive"
            });
          };
          
          await audio.play();
        }

      } catch (error) {
        console.error('Error processing voice chat:', error);
        setLastResponse('Sorry, I encountered an error. Please try again.');
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to process your request',
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setIsProcessing(false);
      
      let errorMessage = 'Speech recognition failed. Please try again.';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try speaking clearly.';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone access denied. Please check your permissions.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied. Please allow microphone access.';
          break;
      }

      toast({
        title: "Speech Recognition Error",
        description: errorMessage,
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('Speech recognition ended');
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      toast({
        title: "Error",
        description: "Failed to start speech recognition. Please check your microphone permissions.",
        variant: "destructive"
      });
    }
  };

  const getButtonIcon = () => {
    if (isListening) return <MicOff className="w-5 h-5" />;
    if (isPlaying) return <Volume2 className="w-5 h-5" />;
    return <Mic className="w-5 h-5" />;
  };

  const getButtonText = () => {
    if (isListening) return 'Listening...';
    if (isProcessing) return 'Processing...';
    if (isPlaying) return 'Speaking...';
    return 'Ask CareBow';
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <Button
        onClick={startVoiceChat}
        disabled={isListening || isProcessing || isPlaying}
        className="bg-gradient-to-r from-carebow-primary to-carebow-secondary hover:from-carebow-primary/90 hover:to-carebow-secondary/90 text-white px-6 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
      >
        {getButtonIcon()}
        {getButtonText()}
      </Button>
      
      {lastResponse && (
        <div className="mt-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-md max-w-md text-center">
          <h3 className="font-semibold text-carebow-text-dark mb-2 flex items-center justify-center gap-2">
            ❤️ CareBow Response:
          </h3>
          <p className="text-carebow-text-medium text-sm leading-relaxed">
            {lastResponse}
          </p>
          <div className="mt-3 text-xs text-carebow-text-light">
            💭 Remember: This is guidance, not a diagnosis. Always consult a healthcare professional for concerns.
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceChatButton;