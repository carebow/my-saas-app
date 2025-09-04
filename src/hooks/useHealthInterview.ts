import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useHealthProfile } from './useHealthProfile';

export interface InterviewMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface InterviewSession {
  id: string;
  messages: InterviewMessage[];
  status: 'active' | 'completed';
  urgencyLevel?: string;
}

export const useHealthInterview = () => {
  const { toast } = useToast();
  const { healthProfile, userPreferences } = useHealthProfile();
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const startInterview = useCallback(async (initialMessage: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('health-interview', {
        body: {
          message: initialMessage,
          profileData: healthProfile,
          userPreferences,
          conversationHistory: []
        }
      });

      if (error) throw error;

      const newSession: InterviewSession = {
        id: data.sessionId,
        messages: [
          {
            id: crypto.randomUUID(),
            role: 'user',
            content: initialMessage,
            timestamp: new Date().toISOString()
          },
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: data.reply,
            timestamp: new Date().toISOString()
          }
        ],
        status: 'active'
      };

      setCurrentSession(newSession);
      return newSession;
    } catch (error) {
      console.error('Error starting interview:', error);
      toast({
        title: "Interview Failed",
        description: "Failed to start health interview. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [healthProfile, userPreferences, toast]);

  const continueInterview = useCallback(async (message: string) => {
    if (!currentSession) {
      throw new Error('No active session');
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('health-interview', {
        body: {
          message,
          sessionId: currentSession.id,
          profileData: healthProfile,
          conversationHistory: currentSession.messages
        }
      });

      if (error) throw error;

      const newMessages: InterviewMessage[] = [
        ...currentSession.messages,
        {
          id: crypto.randomUUID(),
          role: 'user',
          content: message,
          timestamp: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toISOString()
        }
      ];

      const updatedSession: InterviewSession = {
        ...currentSession,
        messages: newMessages
      };

      setCurrentSession(updatedSession);
      return updatedSession;
    } catch (error) {
      console.error('Error continuing interview:', error);
      toast({
        title: "Message Failed",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [currentSession, healthProfile, toast]);

  const analyzeSymptoms = useCallback(async () => {
    if (!currentSession) {
      throw new Error('No active session to analyze');
    }

    setAnalyzing(true);
    try {
      // Extract symptoms from conversation
      const symptoms = currentSession.messages
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content)
        .join(' ');

      const { data, error } = await supabase.functions.invoke('symptom-analyzer-enhanced', {
        body: {
          sessionId: currentSession.id,
          symptoms: { description: symptoms },
          profileData: healthProfile,
          conversationHistory: currentSession.messages
        }
      });

      if (error) throw error;

      // Update session status
      setCurrentSession(prev => prev ? {
        ...prev,
        status: 'completed',
        urgencyLevel: data.analysis?.assessment?.urgencyLevel
      } : null);

      return data;
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze symptoms. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setAnalyzing(false);
    }
  }, [currentSession, healthProfile, toast]);

  const resetInterview = useCallback(() => {
    setCurrentSession(null);
  }, []);

  return {
    currentSession,
    loading,
    analyzing,
    startInterview,
    continueInterview,
    analyzeSymptoms,
    resetInterview
  };
};