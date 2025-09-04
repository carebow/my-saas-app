import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Book, 
  Search, 
  Heart, 
  Brain, 
  Leaf, 
  Activity,
  Eye,
  Wind,
  Zap,
  Apple,
  Moon,
  Shield,
  Stethoscope,
  Lightbulb,
  Calendar,
  Play,
  Clock,
  Star
} from 'lucide-react';
import { HealthAssessmentTool } from './HealthAssessmentTool';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface HealthArticle {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  content: string;
  tags: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const healthArticles: HealthArticle[] = [
  {
    id: '1',
    title: 'Understanding Your Heart Health',
    category: 'Cardiovascular',
    duration: '5 min read',
    level: 'Beginner',
    summary: 'Learn the basics of heart health, warning signs, and prevention strategies.',
    content: 'Your heart is a remarkable muscle that beats about 100,000 times per day...',
    tags: ['heart', 'prevention', 'lifestyle'],
    icon: Heart
  },
  {
    id: '2',
    title: 'Ayurvedic Approach to Digestion',
    category: 'Ayurveda',
    duration: '7 min read',
    level: 'Intermediate',
    summary: 'Discover ancient wisdom for optimal digestive health and energy.',
    content: 'According to Ayurveda, digestion is the foundation of health...',
    tags: ['ayurveda', 'digestion', 'agni'],
    icon: Leaf
  },
  {
    id: '3',
    title: 'Mental Health and Mindfulness',
    category: 'Mental Health',
    duration: '6 min read',
    level: 'Beginner',
    summary: 'Practical techniques for managing stress and improving mental well-being.',
    content: 'Mental health is just as important as physical health...',
    tags: ['mental health', 'mindfulness', 'stress'],
    icon: Brain
  },
  {
    id: '4',
    title: 'Seasonal Eating Guidelines',
    category: 'Nutrition',
    duration: '8 min read',
    level: 'Intermediate',
    summary: 'How to align your diet with natural seasons for optimal health.',
    content: 'Eating seasonally is one of the fundamental principles...',
    tags: ['nutrition', 'seasonal', 'natural'],
    icon: Apple
  },
  {
    id: '5',
    title: 'Sleep Hygiene Essentials',
    category: 'Sleep',
    duration: '4 min read',
    level: 'Beginner',
    summary: 'Evidence-based strategies for better sleep quality and restoration.',
    content: 'Quality sleep is essential for physical and mental health...',
    tags: ['sleep', 'hygiene', 'restoration'],
    icon: Moon
  },
  {
    id: '6',
    title: 'Building Natural Immunity',
    category: 'Immunity',
    duration: '9 min read',
    level: 'Advanced',
    summary: 'Comprehensive approach to strengthening your immune system naturally.',
    content: 'Your immune system is your body\'s defense mechanism...',
    tags: ['immunity', 'natural', 'herbs'],
    icon: Shield
  }
];

const healthConditions = [
  {
    name: 'Type 2 Diabetes',
    description: 'Understanding blood sugar management and lifestyle modifications',
    icon: Activity,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    name: 'Hypertension',
    description: 'Blood pressure management through diet and lifestyle',
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50'
  },
  {
    name: 'Anxiety & Depression',
    description: 'Mental health support and coping strategies',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    name: 'Digestive Issues',
    description: 'IBS, bloating, and digestive health management',
    icon: Apple,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    name: 'Chronic Fatigue',
    description: 'Energy optimization and fatigue management',
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    name: 'Respiratory Health',
    description: 'Asthma, allergies, and breathing support',
    icon: Wind,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  }
];

const preventiveCare = [
  {
    category: 'Regular Checkups',
    frequency: 'Annually',
    items: [
      'Complete physical examination',
      'Blood pressure monitoring',
      'Cholesterol screening',
      'Blood sugar testing'
    ]
  },
  {
    category: 'Screening Tests',
    frequency: 'As recommended',
    items: [
      'Mammography (women)',
      'Colonoscopy (age 50+)',
      'Eye examination',
      'Skin cancer screening'
    ]
  },
  {
    category: 'Vaccinations',
    frequency: 'Per schedule',
    items: [
      'Annual flu vaccine',
      'COVID-19 boosters',
      'Tetanus every 10 years',
      'Shingles (age 50+)'
    ]
  },
  {
    category: 'Self-Care',
    frequency: 'Daily/Weekly',
    items: [
      'Self-examination (breast/testicular)',
      'Weight monitoring',
      'Blood pressure tracking',
      'Symptom journaling'
    ]
  }
];

export const HealthEducationHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<HealthArticle | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const categories = ['all', 'Cardiovascular', 'Ayurveda', 'Mental Health', 'Nutrition', 'Sleep', 'Immunity'];
  
  const filteredArticles = healthArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg">
            <Book className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Health Learning Hub
            </h1>
            <p className="text-muted-foreground">Evidence-based health education and resources</p>
          </div>
        </div>
      </motion.div>

      {selectedTool === 'assessment' ? (
        /* Health Assessment Tool */
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setSelectedTool(null)}>
              ← Back to Hub
            </Button>
          </div>
          <HealthAssessmentTool />
        </motion.div>
      ) : selectedArticle ? (
        /* Article View */
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setSelectedArticle(null)}>
              ← Back to Hub
            </Button>
            <div className="flex items-center gap-2">
              <selectedArticle.icon className="h-5 w-5 text-primary" />
              <Badge variant="outline">{selectedArticle.category}</Badge>
              <Badge variant="secondary">{selectedArticle.level}</Badge>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{selectedArticle.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {selectedArticle.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  {selectedArticle.level}
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-lg text-muted-foreground mb-6">{selectedArticle.summary}</p>
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {selectedArticle.content}
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                {selectedArticle.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        /* Main Hub View */
        <Tabs defaultValue="articles" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="articles">Health Articles</TabsTrigger>
            <TabsTrigger value="conditions">Health Conditions</TabsTrigger>
            <TabsTrigger value="prevention">Preventive Care</TabsTrigger>
            <TabsTrigger value="tools">Health Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search articles, topics, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="capitalize"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => {
                const Icon = article.icon;
                return (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <Card className="h-full hover:shadow-lg transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <Icon className="h-6 w-6 text-primary" />
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-xs">
                              {article.level}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {article.duration}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {article.summary}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {article.tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <Book className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="conditions" className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50">
              <Stethoscope className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                <strong>Educational Purpose:</strong> This information is for educational purposes only. 
                Always consult healthcare professionals for proper diagnosis and treatment.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthConditions.map((condition, index) => {
                const Icon = condition.icon;
                return (
                  <motion.div
                    key={condition.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`hover:shadow-lg transition-all cursor-pointer ${condition.bgColor}`}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full bg-white`}>
                            <Icon className={`h-6 w-6 ${condition.color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{condition.name}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{condition.description}</p>
                        <Button variant="outline" size="sm" className="mt-4 w-full">
                          Learn More
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="prevention" className="space-y-6">
            <Alert className="border-green-200 bg-green-50">
              <Shield className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <strong>Prevention is Key:</strong> Regular preventive care can help detect issues early 
                and maintain optimal health throughout your life.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {preventiveCare.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{category.category}</span>
                        <Badge variant="outline">{category.frequency}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-red-600" />
                    BMI Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Calculate your Body Mass Index and understand what it means for your health.
                  </p>
                  <Button variant="outline" className="w-full">
                    Calculate BMI
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Symptom Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Track your symptoms over time to identify patterns and triggers.
                  </p>
                  <Button variant="outline" className="w-full">
                    Start Tracking
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-600" />
                    Health Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set and track personalized health and wellness goals.
                  </p>
                  <Button variant="outline" className="w-full">
                    Set Goals
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedTool('assessment')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    Health Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete a comprehensive health assessment for personalized insights.
                  </p>
                  <Button variant="outline" className="w-full">
                    Start Assessment
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Apple className="h-5 w-5 text-green-600" />
                    Nutrition Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Explore nutritional information and meal planning tools.
                  </p>
                  <Button variant="outline" className="w-full">
                    Explore
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Moon className="h-5 w-5 text-purple-600" />
                    Sleep Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Analyze your sleep patterns and get personalized recommendations.
                  </p>
                  <Button variant="outline" className="w-full">
                    Analyze Sleep
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};