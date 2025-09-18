import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../hooks/useAuth';
import { 
  TrendingUp, 
  Calendar, 
  Heart, 
  Brain, 
  Leaf, 
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Star
} from 'lucide-react';

interface HealthRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority_level: string;
  created_at: string;
}

interface ConversationSession {
  id: string;
  session_type: string;
  urgency_level?: string;
  created_at: string;
  conversation_data: {
    messages?: Array<{ role: string; content: string }>;
    [key: string]: unknown;
  };
}

export const HealthInsights: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<HealthRecommendation[]>([]);
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const fetchData = React.useCallback(async () => {
    try {
      // Fetch health recommendations
      const { data: recsData } = await supabase
        .from('health_recommendations')
        .select('*')
        .eq('profile_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20);

      // Fetch conversation sessions
      const { data: sessionsData } = await supabase
        .from('conversation_sessions')
        .select('*')
        .eq('profile_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setRecommendations(recsData || []);
      setSessions(sessionsData || []);
    } catch (error) {
      console.error('Error fetching insights data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'medical':
        return <Heart className="h-4 w-4" />;
      case 'natural':
      case 'ayurvedic':
        return <Leaf className="h-4 w-4" />;
      case 'mentalhHealth':
        return <Heart className="h-4 w-4" />;
      case 'lifestyle':
        return <Activity className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency?.toLowerCase()) {
      case 'emergency':
        return 'destructive';
      case 'urgent':
        return 'destructive';
      case 'moderate':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const groupedRecommendations = recommendations.reduce((acc, rec) => {
    if (!acc[rec.category]) {
      acc[rec.category] = [];
    }
    acc[rec.category].push(rec);
    return acc;
  }, {} as Record<string, HealthRecommendation[]>);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                  <p className="text-xl font-semibold">{sessions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Recommendations</p>
                  <p className="text-xl font-semibold">{recommendations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                  <p className="text-xl font-semibold">
                    {recommendations.filter(r => r.priority_level === 'high').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-xl font-semibold">
                    {sessions.filter(s => 
                      new Date(s.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recommendations">Health Recommendations</TabsTrigger>
          <TabsTrigger value="history">Conversation History</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-6">
          {Object.keys(groupedRecommendations).length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
                <p className="text-muted-foreground">
                  Start a health conversation to receive personalized recommendations
                </p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(groupedRecommendations).map(([category, recs]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 capitalize">
                      {getCategoryIcon(category)}
                      {category} Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recs.map((rec) => (
                        <div key={rec.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">{rec.title}</h4>
                            <Badge variant={getPriorityColor(rec.priority_level) as "default" | "destructive" | "outline" | "secondary"}>
                              {rec.priority_level}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {rec.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(rec.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {sessions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Conversations Yet</h3>
                <p className="text-muted-foreground">
                  Your conversation history will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            sessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium capitalize">
                          {session.session_type.replace('_', ' ')} Session
                        </h4>
                        {session.urgency_level && (
                          <Badge variant={getUrgencyColor(session.urgency_level) as "default" | "destructive" | "outline" | "secondary"}>
                            {session.urgency_level}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(session.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {session.conversation_data?.messages && (
                      <div className="text-sm text-muted-foreground">
                        {session.conversation_data.messages.length} messages exchanged
                      </div>
                    )}
                    
                    <Button variant="outline" size="sm" className="mt-2">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};