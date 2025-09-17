import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Activity, 
  TrendingUp, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Shield,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface HealthMetric {
  id: string;
  type: string;
  value: number;
  unit: string;
  recorded_at: string;
  trend: 'up' | 'down' | 'stable';
}

interface Consultation {
  id: string;
  symptoms: string;
  urgency_level: string;
  created_at: string;
  ai_analysis: string;
}

interface HealthInsight {
  type: 'positive' | 'warning' | 'info';
  title: string;
  description: string;
  action?: string;
}

export const HealthDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load health metrics
      const metricsResponse = await fetch(`/api/v1/health/metrics?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const metricsData = await metricsResponse.json();
      setHealthMetrics(metricsData.metrics || []);

      // Load consultations
      const consultationsResponse = await fetch(`/api/v1/health/consultations?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const consultationsData = await consultationsResponse.json();
      setConsultations(consultationsData.consultations || []);

      // Generate insights
      generateInsights(metricsData.metrics || [], consultationsData.consultations || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (metrics: HealthMetric[], consultations: Consultation[]) => {
    const newInsights: HealthInsight[] = [];

    // Analyze consultation patterns
    const recentConsultations = consultations.filter(c => 
      new Date(c.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    if (recentConsultations.length > 3) {
      newInsights.push({
        type: 'warning',
        title: 'Frequent Health Concerns',
        description: `You've had ${recentConsultations.length} consultations in the past week. Consider scheduling a comprehensive health check.`,
        action: 'Schedule Checkup'
      });
    }

    // Analyze urgency levels
    const urgentConsultations = consultations.filter(c => c.urgency_level === 'red');
    if (urgentConsultations.length > 0) {
      newInsights.push({
        type: 'warning',
        title: 'Recent Urgent Symptoms',
        description: `You've reported ${urgentConsultations.length} urgent symptoms recently. Please follow up with healthcare providers.`,
        action: 'View Details'
      });
    }

    // Analyze metrics trends
    const bloodPressureMetrics = metrics.filter(m => m.type === 'blood_pressure');
    if (bloodPressureMetrics.length > 0) {
      const latest = bloodPressureMetrics[bloodPressureMetrics.length - 1];
      if (latest.value > 140) {
        newInsights.push({
          type: 'warning',
          title: 'Elevated Blood Pressure',
          description: `Your latest blood pressure reading is ${latest.value} ${latest.unit}. Consider lifestyle changes and consult your doctor.`,
          action: 'View Trends'
        });
      }
    }

    // Positive insights
    if (consultations.length === 0) {
      newInsights.push({
        type: 'positive',
        title: 'Great Health Tracking!',
        description: 'You\'re maintaining good health awareness. Keep up the great work!',
        action: 'Continue Tracking'
      });
    }

    setInsights(newInsights);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'red': return 'text-red-600 bg-red-50 border-red-200';
      case 'yellow': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'green': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyEmoji = (urgency: string) => {
    switch (urgency) {
      case 'red': return '🔴';
      case 'yellow': return '🟡';
      case 'green': return '🟢';
      default: return '⚪';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Dashboard</h1>
          <p className="text-gray-600">Track your health journey and insights</p>
        </div>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d'] as const).map(period => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod(period)}
              size="sm"
            >
              {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : '90 Days'}
            </Button>
          ))}
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Health Insights</h2>
          <div className="grid gap-4">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-l-4 ${
                  insight.type === 'positive' ? 'border-l-green-500' :
                  insight.type === 'warning' ? 'border-l-yellow-500' :
                  'border-l-blue-500'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {insight.type === 'positive' ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        ) : insight.type === 'warning' ? (
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                        ) : (
                          <Brain className="h-5 w-5 text-blue-500 mt-0.5" />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">{insight.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                        </div>
                      </div>
                      {insight.action && (
                        <Button variant="outline" size="sm">
                          {insight.action}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Health Metrics</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Heart className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Consultations</p>
                    <p className="text-2xl font-bold text-gray-900">{consultations.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Activity className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Health Metrics</p>
                    <p className="text-2xl font-bold text-gray-900">{healthMetrics.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Urgent Symptoms</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {consultations.filter(c => c.urgency_level === 'red').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Target className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Health Score</p>
                    <p className="text-2xl font-bold text-gray-900">85%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consultations.slice(0, 5).map((consultation, index) => (
                  <div key={consultation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getUrgencyEmoji(consultation.urgency_level)}</span>
                      <div>
                        <p className="font-medium text-gray-900">{consultation.symptoms}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(consultation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getUrgencyColor(consultation.urgency_level)}>
                      {consultation.urgency_level.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <span>Health Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthMetrics.length > 0 ? (
                  healthMetrics.map((metric, index) => (
                    <div key={metric.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getTrendIcon(metric.trend)}
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {metric.type.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(metric.recorded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {metric.value} {metric.unit}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No health metrics recorded yet</p>
                    <p className="text-sm">Start tracking your health metrics to see them here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>Consultation History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consultations.length > 0 ? (
                  consultations.map((consultation, index) => (
                    <div key={consultation.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getUrgencyEmoji(consultation.urgency_level)}</span>
                          <div>
                            <p className="font-medium text-gray-900">{consultation.symptoms}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(consultation.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={getUrgencyColor(consultation.urgency_level)}>
                          {consultation.urgency_level.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {consultation.ai_analysis}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No consultations yet</p>
                    <p className="text-sm">Start a symptom check to see your consultation history</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span>Health Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Trend analysis coming soon</p>
                <p className="text-sm">We're working on advanced trend visualization</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
