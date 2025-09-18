import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { safeLocalStorage } from '../../lib/safeStorage';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Calendar,
  TrendingUp,
  BarChart3,
  FileText,
  Search,
  Filter,
  MoreHorizontal,
  Clock,
  Users,
  Share2,
  Target,
  Zap,
  BookOpen,
  PenTool,
  Settings
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  published_at: string;
  reading_time: number;
  word_count: number;
  seo_score: number;
  page_views: number;
  social_shares: number;
}

interface DashboardStats {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  total_views: number;
  total_shares: number;
  avg_reading_time: number;
  top_categories: Array<{name: string; count: number}>;
  top_tags: Array<{name: string; count: number}>;
  recent_posts: BlogPost[];
  performance_metrics: {
    avg_seo_score: number;
    total_word_count: number;
  };
}

export const WriterDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Load dashboard stats
      const statsResponse = await fetch('/api/v1/content/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${safeLocalStorage.get('token')}`
        }
      });
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Load recent posts
      const postsResponse = await fetch('/api/v1/content/posts?page=1&per_page=10', {
        headers: {
          'Authorization': `Bearer ${safeLocalStorage.get('token')}`
        }
      });
      const postsData = await postsResponse.json();
      setPosts(postsData.posts);
      setTotalPages(postsData.total_pages);
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
  }, [toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <Eye className="h-4 w-4" />;
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'archived': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Writer Dashboard</h1>
          <p className="text-gray-600">Manage your content and grow organically</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_posts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Eye className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.published_posts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_views.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Share2 className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Shares</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_shares.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          {/* Posts Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                      <Badge className={getStatusColor(post.status)}>
                        {getStatusIcon(post.status)}
                        <span className="ml-1 capitalize">{post.status}</span>
                      </Badge>
                      {post.featured && (
                        <Badge className="bg-purple-100 text-purple-800">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{post.excerpt}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.reading_time} min read</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>{post.word_count} words</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.page_views} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="h-4 w-4" />
                        <span>SEO: {Math.round(post.seo_score)}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-3">
                      {post.category && (
                        <Badge variant="outline">{post.category}</Badge>
                      )}
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span>Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average SEO Score</span>
                    <span className="font-semibold">{Math.round(stats?.performance_metrics.avg_seo_score || 0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Word Count</span>
                    <span className="font-semibold">{stats?.performance_metrics.total_word_count.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Reading Time</span>
                    <span className="font-semibold">{Math.round(stats?.avg_reading_time || 0)} min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Top Categories</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats?.top_categories.map((category, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm text-gray-600">{category.name}</span>
                      <span className="font-semibold">{category.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-purple-600" />
                <span>SEO Optimization</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">SEO optimization tools and recommendations will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-orange-600" />
                <span>Content Categories</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Category management will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PenTool className="h-5 w-5 text-indigo-600" />
                <span>Content Templates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Content templates will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
