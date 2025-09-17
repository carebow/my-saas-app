import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  ArrowRight, 
  Calendar, 
  User, 
  Clock, 
  Share2,
  BookOpen,
  TrendingUp,
  Shield,
  Heart,
  Zap,
  CheckCircle
} from 'lucide-react';

export const PillarArticle1: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center space-y-4">
            <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              Featured Article
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              How AI Is Changing Symptom Checking in 2025
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The healthcare landscape is undergoing a revolutionary transformation as artificial intelligence 
              redefines how we approach symptom analysis and medical guidance.
            </p>
          </div>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Dr. Sarah Chen, Chief Medical Officer</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>September 17, 2024</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>8 min read</span>
            </div>
            <div className="flex items-center space-x-2">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </div>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-lg max-w-none space-y-8"
        >
          {/* Introduction */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">The AI Revolution in Healthcare</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                In 2025, artificial intelligence is not just transforming healthcare—it's revolutionizing how we 
                understand, analyze, and respond to symptoms. What once required a visit to a doctor's office 
                can now be assessed with remarkable accuracy through AI-powered symptom checkers that combine 
                medical expertise with machine learning precision.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This transformation is particularly evident in platforms like CareBow, where AI doesn't just 
                replace human judgment but enhances it, providing personalized insights that consider both 
                modern medical knowledge and traditional healing wisdom.
              </p>
            </CardContent>
          </Card>

          {/* Current State of Symptom Checking */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">The Current State of Symptom Checking</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">Traditional Methods</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>Doctor consultations for every concern</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>Generic symptom checklists</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>Limited accessibility and availability</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>One-size-fits-all approach</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">AI-Powered Solutions</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <Brain className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                      <span>24/7 availability and instant access</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Brain className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                      <span>Personalized analysis based on individual factors</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Brain className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                      <span>Integration of multiple data sources</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Brain className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                      <span>Continuous learning and improvement</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Technology in Symptom Analysis */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">The Technology Behind AI Symptom Analysis</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Machine Learning Algorithms</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Modern AI symptom checkers utilize sophisticated machine learning algorithms that have been 
                    trained on vast datasets of medical literature, patient records, and clinical outcomes. These 
                    algorithms can identify patterns and correlations that might be missed by human analysis alone.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Natural Language Processing</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Advanced NLP capabilities allow AI systems to understand and interpret natural language 
                    descriptions of symptoms, making the interaction feel more like a conversation with a 
                    knowledgeable healthcare provider rather than filling out a rigid form.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Predictive Analytics</h3>
                  <p className="text-gray-700 leading-relaxed">
                    AI can analyze symptom patterns to predict potential health outcomes and recommend 
                    preventive measures, helping users take proactive steps toward better health.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CareBow's Innovative Approach */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">CareBow's Revolutionary Approach</h2>
              
              <div className="space-y-6">
                <p className="text-blue-800 leading-relaxed">
                  CareBow represents a unique convergence of cutting-edge AI technology and traditional healing 
                  wisdom. Our platform doesn't just analyze symptoms—it provides holistic health insights that 
                  consider the whole person, not just isolated symptoms.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Brain className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-blue-900">AI-Powered Analysis</h3>
                    <p className="text-blue-700 text-sm">Advanced machine learning for accurate symptom assessment</p>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Heart className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-blue-900">Traditional Wisdom</h3>
                    <p className="text-blue-700 text-sm">Integration of Ayurvedic and holistic healing approaches</p>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <Shield className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-blue-900">Personalized Care</h3>
                    <p className="text-blue-700 text-sm">Tailored recommendations based on individual health profiles</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Future Predictions */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">The Future of AI in Symptom Checking</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">2025 and Beyond: What to Expect</h3>
                  <p className="text-gray-700 leading-relaxed">
                    As we look toward the future, AI-powered symptom checking is poised to become even more 
                    sophisticated and integrated into our daily lives. We can expect to see:
                  </p>
                </div>
                
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-3">
                    <Zap className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <span><strong>Wearable Integration:</strong> Real-time health monitoring through smart devices and wearables</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Zap className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <span><strong>Voice-Activated Analysis:</strong> Natural conversation-based symptom assessment</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Zap className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <span><strong>Predictive Health Modeling:</strong> AI that can predict health issues before they manifest</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Zap className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <span><strong>Global Health Integration:</strong> Worldwide health data sharing for better outcomes</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-8 text-center space-y-6">
              <h2 className="text-2xl font-bold text-purple-900">
                Experience the Future of Symptom Checking Today
              </h2>
              <p className="text-purple-700 text-lg">
                Don't just read about the future—experience it. Try CareBow's AI-powered symptom checker 
                and discover how artificial intelligence can transform your approach to health and wellness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3">
                  <Brain className="h-5 w-5 mr-2" />
                  Try AI Symptom Checker
                </Button>
                <Button variant="outline" className="border-purple-600 text-purple-600 text-lg px-8 py-3">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Learn More About CareBow
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Related Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Related Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900 mb-2">Ayurveda Meets AI: The Future of Preventive Healthcare</h4>
                  <p className="text-gray-600 text-sm mb-3">Explore how traditional healing wisdom is being enhanced by artificial intelligence</p>
                  <Button size="sm" variant="outline">Read More</Button>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900 mb-2">The Science Behind AI Symptom Analysis</h4>
                  <p className="text-gray-600 text-sm mb-3">Deep dive into the technology and algorithms powering modern symptom checkers</p>
                  <Button size="sm" variant="outline">Read More</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
