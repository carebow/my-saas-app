import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useHealthInterview } from '../hooks/useHealthInterview';
import { useToast } from './ui/use-toast';
import { 
  Send, 
  User, 
  Bot, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

const quickStartPrompts = [
  "I have a headache and feel tired",
  "I'm feeling anxious and stressed",
  "I have stomach pain after eating",
  "I can't sleep well lately",
  "I have a sore throat and cough",
  "I feel dizzy when I stand up"
];

export const HealthInterview: React.FC = () => {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    currentSession,
    loading,
    analyzing,
    startInterview,
    continueInterview,
    analyzeSymptoms,
    resetInterview
  } = useHealthInterview();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const handleSendMessage = async (messageText: string = message) => {
    if (!messageText.trim()) return;

    try {
      if (!currentSession) {
        await startInterview(messageText);
      } else {
        await continueInterview(messageText);
      }
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setMessage(prompt);
    handleSendMessage(prompt);
  };

  const handleAnalyze = async () => {
    try {
      const results = await analyzeSymptoms();
      setAnalysisResults(results);
      setShowAnalysis(true);
      toast({
        title: "Analysis Complete",
        description: "Your health assessment is ready.",
      });
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (showAnalysis && analysisResults) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Health Assessment Results
              </CardTitle>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAnalysis(false);
                  resetInterview();
                }}
              >
                Start New Conversation
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Analysis results would be displayed here */}
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Analysis results would be displayed here with recommendations
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {!currentSession ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                Start Your Health Conversation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Tell me about your symptoms, health concerns, or wellness goals. 
                I'll ask thoughtful questions to better understand and help you.
              </p>
              
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Quick Start Ideas:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quickStartPrompts.map((prompt, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="p-3 text-left border rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <span className="text-sm">{prompt}</span>
                      <ArrowRight className="h-4 w-4 inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Or type your own message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button 
                  onClick={() => handleSendMessage()} 
                  disabled={!message.trim() || loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Chat Messages */}
          <Card className="h-96 flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  Health Interview
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={currentSession.status === 'active' ? 'default' : 'secondary'}>
                    {currentSession.status}
                  </Badge>
                  {currentSession.urgencyLevel && (
                    <Badge variant={currentSession.urgencyLevel === 'emergency' ? 'destructive' : 'outline'}>
                      {currentSession.urgencyLevel}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                <AnimatePresence>
                  {currentSession.messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      
                      {msg.role === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">CareBow is thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  placeholder="Continue the conversation..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading || currentSession.status === 'completed'}
                  className="flex-1"
                />
                <Button 
                  onClick={() => handleSendMessage()} 
                  disabled={!message.trim() || loading || currentSession.status === 'completed'}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {currentSession.messages.length >= 4 && currentSession.status === 'active' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center gap-4"
            >
              <Button 
                onClick={handleAnalyze}
                disabled={analyzing}
                size="lg"
                className="flex items-center gap-2"
              >
                {analyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Get Health Assessment
              </Button>
              
              <Button 
                variant="outline" 
                onClick={resetInterview}
                size="lg"
              >
                Start Over
              </Button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};