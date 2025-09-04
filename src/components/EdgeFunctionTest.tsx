import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const EdgeFunctionTest: React.FC = () => {
  const { toast } = useToast();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<{
    voiceChat: 'pending' | 'success' | 'error';
    symptomAnalyzer: 'pending' | 'success' | 'error';
  }>({
    voiceChat: 'pending',
    symptomAnalyzer: 'pending'
  });

  const testEdgeFunctions = async () => {
    setTesting(true);
    setResults({ voiceChat: 'pending', symptomAnalyzer: 'pending' });

    // Test Voice Chat Function
    try {
      const { data: voiceData, error: voiceError } = await supabase.functions.invoke('voice-chat', {
        body: { message: 'Hello, this is a test message.' }
      });

      if (voiceError || !voiceData) {
        setResults(prev => ({ ...prev, voiceChat: 'error' }));
        console.error('Voice chat error:', voiceError);
      } else {
        setResults(prev => ({ ...prev, voiceChat: 'success' }));
        console.log('Voice chat success:', voiceData);
      }
    } catch (error) {
      setResults(prev => ({ ...prev, voiceChat: 'error' }));
      console.error('Voice chat exception:', error);
    }

    // Test Symptom Analyzer Function
    try {
      const { data: symptomData, error: symptomError } = await supabase.functions.invoke('symptom-analyzer', {
        body: {
          profileId: 'test-user',
          symptoms: 'I have a headache and feel tired.',
          userContext: { age: 30, gender: 'male' }
        }
      });

      if (symptomError || !symptomData) {
        setResults(prev => ({ ...prev, symptomAnalyzer: 'error' }));
        console.error('Symptom analyzer error:', symptomError);
      } else {
        setResults(prev => ({ ...prev, symptomAnalyzer: 'success' }));
        console.log('Symptom analyzer success:', symptomData);
      }
    } catch (error) {
      setResults(prev => ({ ...prev, symptomAnalyzer: 'error' }));
      console.error('Symptom analyzer exception:', error);
    }

    setTesting(false);

    // Show results
    if (results.voiceChat === 'success' && results.symptomAnalyzer === 'success') {
      toast({
        title: "🎉 All Systems Go!",
        description: "Both AI functions are working perfectly with your OpenAI API key!",
      });
    } else {
      toast({
        title: "🔧 Some Issues Detected",
        description: "Check the console for detailed error information.",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-lg">
          🔬 Edge Function Tests
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Voice Chat Function</span>
            {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : getStatusIcon(results.voiceChat)}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Symptom Analyzer Function</span>
            {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : getStatusIcon(results.symptomAnalyzer)}
          </div>
        </div>

        <Button 
          onClick={testEdgeFunctions}
          disabled={testing}
          className="w-full bg-gradient-to-r from-carebow-primary to-carebow-secondary hover:from-carebow-primary/90 hover:to-carebow-secondary/90 text-white"
        >
          {testing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            'Test AI Functions'
          )}
        </Button>

        <div className="text-xs text-gray-500 text-center">
          This tests if your OpenAI API key is configured correctly
        </div>
      </CardContent>
    </Card>
  );
};

export default EdgeFunctionTest;