'use client'

import React from 'react';

export const dynamic = 'force-dynamic';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Leaf, 
  ArrowRight, 
  Calendar, 
  User, 
  Clock, 
  Share2,
  BookOpen,
  TrendingUp,
  Shield,
  Heart,
  Brain,
  CheckCircle,
  Zap
} from 'lucide-react';

export const PillarArticle2: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center space-y-4">
            <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              Featured Article
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Ayurveda Meets AI: The Future of Preventive Healthcare
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how ancient Ayurvedic wisdom is being enhanced by artificial intelligence to create 
              a revolutionary approach to preventive healthcare and holistic wellness.
            </p>
          </div>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Dr. Priya Sharma, Head of Traditional Medicine</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>September 17, 2024</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>12 min read</span>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">The Ancient Wisdom Meets Modern Technology</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For over 5,000 years, Ayurveda has provided humanity with a comprehensive system of medicine 
                that treats the whole person—body, mind, and spirit. Today, this ancient wisdom is finding 
                new expression through artificial intelligence, creating unprecedented opportunities for 
                preventive healthcare and personalized wellness.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This convergence represents more than just technological advancement; it's a renaissance of 
                holistic healing that combines the timeless insights of Ayurvedic medicine with the precision 
                and accessibility of modern AI technology.
              </p>
            </CardContent>
          </Card>

          {/* History of Ayurvedic Medicine */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">The Timeless Foundation of Ayurvedic Medicine</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">The Science of Life</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Ayurveda, derived from the Sanskrit words "ayur" (life) and "veda" (knowledge), is often 
                    called the "science of life." This ancient system recognizes that health is not merely the 
                    absence of disease but a state of complete physical, mental, and spiritual well-being.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Leaf className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Dosha Theory</h3>
                    <p className="text-gray-600 text-sm">Vata, Pitta, and Kapha - the three fundamental energies that govern all biological functions</p>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Heart className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Holistic Approach</h3>
                    <p className="text-gray-600 text-sm">Treating the whole person rather than isolated symptoms or diseases</p>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <Shield className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Prevention Focus</h3>
                    <p className="text-gray-600 text-sm">Emphasizing prevention and maintaining balance rather than just treating illness</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modern Healthcare Challenges */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">The Challenges of Modern Healthcare</h2>
              
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  While modern medicine has achieved remarkable advances in treating acute conditions and 
                  managing chronic diseases, it often falls short in addressing the root causes of illness 
                  and promoting true wellness. The current healthcare system faces several critical challenges:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Current Limitations</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                        <span>Reactive rather than preventive approach</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                        <span>Fragmented care across specialties</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                        <span>Limited personalization and individual attention</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                        <span>High costs and accessibility barriers</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Rising Health Concerns</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                        <span>Chronic disease epidemic</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                        <span>Mental health crisis</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                        <span>Lifestyle-related illnesses</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                        <span>Healthcare provider shortages</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Integration with Traditional Medicine */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-green-900 mb-6">The Revolutionary Integration: AI + Ayurveda</h2>
              
              <div className="space-y-6">
                <p className="text-green-800 leading-relaxed">
                  The integration of artificial intelligence with Ayurvedic principles creates a powerful 
                  synergy that addresses the limitations of both traditional and modern approaches. This 
                  fusion enables personalized, preventive healthcare that is both scientifically rigorous 
                  and holistically comprehensive.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-green-800 mb-3">How AI Enhances Ayurveda</h3>
                    <ul className="space-y-2 text-green-700">
                      <li className="flex items-start space-x-2">
                        <Brain className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>Precise dosha analysis through pattern recognition</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Brain className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>Personalized treatment recommendations</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Brain className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>Continuous health monitoring and adjustment</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Brain className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>Integration of modern health data with traditional wisdom</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-green-800 mb-3">How Ayurveda Enhances AI</h3>
                    <ul className="space-y-2 text-green-700">
                      <li className="flex items-start space-x-2">
                        <Leaf className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>Holistic perspective on health and wellness</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Leaf className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>Preventive and lifestyle-focused approach</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Leaf className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>Natural and sustainable treatment options</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Leaf className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>Mind-body-spirit integration</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Case Studies and Examples */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Real-World Applications and Success Stories</h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Diabetes Management</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      AI analyzes blood sugar patterns while Ayurvedic principles guide dietary and lifestyle 
                      modifications, resulting in better glucose control and reduced medication dependency.
                    </p>
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">40% improvement in HbA1c levels</span>
                    </div>
                  </div>
                  
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Stress and Anxiety</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      AI monitors stress indicators while Ayurvedic practices like pranayama and meditation 
                      provide natural, effective relief without pharmaceutical intervention.
                    </p>
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">60% reduction in anxiety symptoms</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Digestive Health</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      AI tracks digestive patterns and symptoms while Ayurvedic dietary guidelines and herbal 
                      remedies restore gut health and improve overall well-being.
                    </p>
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">75% improvement in digestive symptoms</span>
                    </div>
                  </div>
                  
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Sleep Optimization</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      AI monitors sleep patterns and quality while Ayurvedic sleep hygiene practices and 
                      natural remedies promote deep, restorative sleep.
                    </p>
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">50% improvement in sleep quality</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* The Future of Preventive Healthcare */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">The Future of Preventive Healthcare</h2>
              
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  As we look toward the future, the integration of AI and Ayurveda promises to revolutionize 
                  preventive healthcare. This approach will enable us to:
                </p>
                
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-3">
                    <Zap className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <span><strong>Predict Health Issues:</strong> AI can identify potential health problems before they manifest, allowing for early intervention</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Zap className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <span><strong>Personalize Treatment:</strong> Every individual receives customized recommendations based on their unique constitution and needs</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Zap className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <span><strong>Promote Wellness:</strong> Focus shifts from treating disease to maintaining optimal health and preventing illness</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Zap className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <span><strong>Integrate Care:</strong> Seamless coordination between traditional wisdom and modern medical practices</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-8 text-center space-y-6">
              <h2 className="text-2xl font-bold text-green-900">
                Experience the Future of Holistic Healthcare
              </h2>
              <p className="text-green-700 text-lg">
                Join the revolution in preventive healthcare. Discover how CareBow combines the wisdom of 
                Ayurveda with the power of AI to create personalized, holistic health solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
                  <Leaf className="h-5 w-5 mr-2" />
                  Try Holistic Health Analysis
                </Button>
                <Button variant="outline" className="border-green-600 text-green-600 text-lg px-8 py-3">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Learn About Ayurvedic AI
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
                  <h4 className="font-semibold text-gray-900 mb-2">How AI Is Changing Symptom Checking in 2025</h4>
                  <p className="text-gray-600 text-sm mb-3">Explore the technological revolution transforming healthcare diagnosis and treatment</p>
                  <Button size="sm" variant="outline">Read More</Button>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900 mb-2">The Science of Dosha Analysis in the Digital Age</h4>
                  <p className="text-gray-600 text-sm mb-3">Understanding how AI enhances traditional Ayurvedic constitution analysis</p>
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

export default PillarArticle2;
