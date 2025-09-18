import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square, Play, Pause } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

interface VoiceRecorderProps {
  onResult: (transcript: string, audioUri?: string) => void;
  isRecording: boolean;
  onRecordingChange: (recording: boolean) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onResult,
  isRecording,
  onRecordingChange
}) => {
  const { toast } = useToast();
  const [isSupported, setIsSupported] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if browser supports media recording
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setIsSupported(true);
    }
  }, []);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      onRecordingChange(true);
      setRecordingTime(0);
      
      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      onRecordingChange(false);
      setIsPaused(false);
      
      toast({
        title: "Recording Complete",
        description: "Processing your voice message...",
      });
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const sendRecording = async () => {
    if (audioBlob) {
      try {
        // Convert audio to text using Web Speech API (fallback)
        // In production, you'd send this to your backend for processing
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          onResult(transcript, audioUrl || undefined);
          resetRecording();
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          // Fallback: send audio without transcription
          onResult("Voice message", audioUrl || undefined);
          resetRecording();
        };
        
        recognition.start();
        
        // Fallback timeout
        setTimeout(() => {
          if (recognition.state === 'listening') {
            recognition.stop();
            onResult("Voice message", audioUrl || undefined);
            resetRecording();
          }
        }, 5000);
        
      } catch (error) {
        console.error('Error processing audio:', error);
        // Fallback: send as voice message
        onResult("Voice message", audioUrl || undefined);
        resetRecording();
      }
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingTime(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isSupported) {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled
        className="opacity-50"
        title="Voice recording not supported"
      >
        <Mic className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="wait">
        {!isRecording && !audioBlob && (
          <motion.div
            key="record-button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Button
              size="sm"
              variant="outline"
              onClick={startRecording}
              className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
            >
              <Mic className="w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {isRecording && (
          <motion.div
            key="recording-controls"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Button
              size="sm"
              variant="destructive"
              onClick={stopRecording}
              className="animate-pulse"
            >
              <Square className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={isPaused ? resumeRecording : pauseRecording}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>
            
            <span className="text-xs text-red-600 font-mono">
              {formatTime(recordingTime)}
            </span>
          </motion.div>
        )}

        {audioBlob && !isRecording && (
          <motion.div
            key="playback-controls"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Button
              size="sm"
              variant="outline"
              onClick={playRecording}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button
              size="sm"
              variant="default"
              onClick={sendRecording}
              className="bg-green-600 hover:bg-green-700"
            >
              <MicOff className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={resetRecording}
            >
              ×
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden audio element for playback */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
};

export default VoiceRecorder;

