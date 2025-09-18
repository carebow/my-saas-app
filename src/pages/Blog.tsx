'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight,
  Heart,
  Brain,
  Shield,
  Leaf,
  TrendingUp,
  BookOpen,
  Zap
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: number;
  category: string;
  tags: string[];
  featured: boolean;
  imageUrl: string;
  slug: string;
  seoScore: number;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "10 Early Symptoms You Shouldn't Ignore: A Comprehensive Guide",
    excerpt: "Learn about the warning signs that could indicate serious health conditions and when to seek immediate medical attention.",
    content: "Full article content...",
    author: "Dr. Sarah Chen",
    publishedAt: "2024-09-15",
    readTime: 8,
    category: "Health Awareness",
    tags: ["symptoms", "early detection", "prevention", "health screening"],
    featured: true,
    imageUrl: "/images/blog/early-symptoms.jpg",
    slug: "10-early-symptoms-you-shouldnt-ignore",
    seoScore: 95
  },
  {
    id: "2",
    title: "How Ayurveda + AI Can Revolutionize Home Healthcare",
    excerpt: "Discover how combining ancient Ayurvedic wisdom with modern AI technology is transforming personalized healthcare.",
    content: "Full article content...",
    author: "Dr. Priya Sharma",
    publishedAt: "2024-09-12",
    readTime: 12,
    category: "Technology",
    tags: ["ayurveda", "AI", "holistic health", "technology"],
    featured: true,
    imageUrl: "/images/blog/ayurveda-ai.jpg",
    slug: "ayurveda-ai-revolutionize-home-healthcare",
    seoScore: 92
  },
  {
    id: "3",
    title: "Symptom Checker vs. Doctor: What You Need to Know",
    excerpt: "Understanding when to use AI-powered symptom checkers and when to consult with healthcare professionals.",
    content: "Full article content...",
    author: "Dr. Raj Patel",
    publishedAt: "2024-09-10",
    readTime: 6,
    category: "AI Health",
    tags: ["symptom checker", "AI", "doctor consultation", "healthcare"],
    featured: false,
    imageUrl: "/images/blog/symptom-checker-vs-doctor.jpg",
    slug: "symptom-checker-vs-doctor-what-you-need-to-know",
    seoScore: 88
  },
  {
    id: "4",
    title: "The Future of Telehealth: AI-Powered Remote Care",
    excerpt: "Explore how artificial intelligence is reshaping telehealth and making quality healthcare more accessible.",
    content: "Full article content...",
    author: "Dr. Michael Johnson",
    publishedAt: "2024-09-08",
    readTime: 10,
    category: "Telehealth",
    tags: ["telehealth", "AI", "remote care", "future of healthcare"],
    featured: false,
    imageUrl: "/images/blog/future-telehealth.jpg",
    slug: "future-telehealth-ai-powered-remote-care",
    seoScore: 90
  },
  {
    id: "5",
    title: "Managing Chronic Conditions with AI: A Patient's Guide",
    excerpt: "Learn how AI-powered tools can help patients better manage chronic health conditions and improve quality of life.",
    content: "Full article content...",
    author: "Dr. Lisa Wang",
    publishedAt: "2024-09-05",
    readTime: 9,
    category: "Chronic Care",
    tags: ["chronic conditions", "AI", "patient care", "management"],
    featured: false,
    imageUrl: "/images/blog/chronic-conditions-ai.jpg",
    slug: "managing-chronic-conditions-with-ai",
    seoScore: 87
  },
  {
    id: "6",
    title: "Mental Health and AI: Breaking Down Barriers to Care",
    excerpt: "How AI technology is making mental health support more accessible and reducing stigma around seeking help.",
    content: "Full article content...",
    author: "Dr. Emily Rodriguez",
    publishedAt: "2024-09-03",
    readTime: 7,
    category: "Mental Health",
    tags: ["mental health", "AI", "accessibility", "stigma"],
    featured: false,
    imageUrl: "/images/blog/mental-health-ai.jpg",
    slug: "mental-health-ai-breaking-barriers",
    seoScore: 89
  }
];

const categories = ["All", "Health Awareness", "Technology", "AI Health", "Telehealth", "Chronic Care", "Mental Health"];

export const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">CareBow Health Blog</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert insights on AI-powered healthcare, traditional medicine, and holistic wellness
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge className="bg-blue-100 text-blue-800">
              <Brain className="h-4 w-4 mr-1" />
              AI-Powered Content
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              <Leaf className="h-4 w-4 mr-1" />
              Holistic Health
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              <Shield className="h-4 w-4 mr-1" />
              Expert Reviewed
            </Badge>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Featured Posts */}
        {selectedCategory === "All" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <span>Featured Articles</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-white opacity-50" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className="bg-blue-100 text-blue-800">Featured</Badge>
                      <Badge variant="outline">{post.category}</Badge>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime} min read</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="h-4 w-4 text-green-500" />
                        <span className="text-green-600 font-medium">{post.seoScore}% SEO</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedCategory === "All" ? "All Articles" : `${selectedCategory} Articles`}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-white opacity-50" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    {post.featured && <Badge className="bg-blue-100 text-blue-800">Featured</Badge>}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{post.author}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime} min</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button size="sm" className="flex-1 mr-2">
                      Read More
                    </Button>
                    <div className="flex items-center space-x-1 text-green-600">
                      <Zap className="h-3 w-3" />
                      <span className="text-xs font-medium">{post.seoScore}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="text-2xl font-bold text-blue-800">
                Stay Updated with Health Insights
              </h3>
              <p className="text-blue-700">
                Get the latest articles on AI-powered healthcare, traditional medicine, and wellness tips delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Subscribe
                </Button>
              </div>
              <p className="text-blue-600 text-sm">
                No spam, ever. Unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Posts Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>Recent Posts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 line-clamp-2 text-sm">
                      {post.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;