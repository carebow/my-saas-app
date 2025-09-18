import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { safeLocalStorage } from '../../lib/safeStorage';
import { 
  Brain, 
  Search, 
  Clock, 
  Star, 
  Heart, 
  MessageCircle,
  TrendingUp,
  Filter,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useToast } from '../ui/use-toast';

interface Memory {
  id: string;
  type: string;
  title: string;
  content: string;
  importance: number;
  confidence: number;
  tags: string[];
  last_accessed?: string;
  access_count: number;
  effectiveness: number;
}

interface ChatGPTMemoryProps {
  userId: string;
  onMemorySelect?: (memory: Memory) => void;
  onSearch?: (query: string) => void;
}

const ChatGPTMemory: React.FC<ChatGPTMemoryProps> = ({ 
  userId, 
  onMemorySelect,
  onSearch 
}) => {
  const { toast } = useToast();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMemories, setFilteredMemories] = useState<Memory[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Memory types
  const memoryTypes = useMemo(() => [
    { value: 'all', label: 'All Memories', icon: '🧠', count: 0 },
    { value: 'health_concern', label: 'Health Concerns', icon: '🏥', count: 0 },
    { value: 'remedy_preference', label: 'Remedy Preferences', icon: '💊', count: 0 },
    { value: 'emotional_pattern', label: 'Emotional Patterns', icon: '💝', count: 0 },
    { value: 'user_profile', label: 'Profile Info', icon: '👤', count: 0 }
  ], []);

  // Load memories
  useEffect(() => {
    loadMemories();
  }, [userId, loadMemories]);

  // Filter memories
  useEffect(() => {
    let filtered = memories;

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(memory => memory.type === selectedType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(memory => 
        memory.title.toLowerCase().includes(query) ||
        memory.content.toLowerCase().includes(query) ||
        memory.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredMemories(filtered);
  }, [memories, selectedType, searchQuery]);

  // Update memory type counts
  useEffect(() => {
    const updatedTypes = memoryTypes.map(type => ({
      ...type,
      count: type.value === 'all' 
        ? memories.length 
        : memories.filter(m => m.type === type.value).length
    }));
    // Update the state or pass to parent component
  }, [memories, memoryTypes]);

  const loadMemories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/enhanced-chat/memories', {
        headers: {
          'Authorization': `Bearer ${safeLocalStorage.get('access_token')}`
        }
      });
      const data = await response.json();
      setMemories(data.memories || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load memories",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchQuery('');
      return;
    }

    setSearchQuery(query);
    onSearch?.(query);

    try {
      const response = await fetch(`/api/v1/enhanced-chat/memories/search?query=${encodeURIComponent(query)}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${safeLocalStorage.get('access_token')}`
        }
      });
      const data = await response.json();
      setMemories(data.memories || []);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const getMemoryIcon = (type: string) => {
    const typeConfig = memoryTypes.find(t => t.value === type);
    return typeConfig?.icon || '🧠';
  };

  const getMemoryColor = (type: string) => {
    switch (type) {
      case 'health_concern': return 'bg-red-100 text-red-800 border-red-200';
      case 'remedy_preference': return 'bg-green-100 text-green-800 border-green-200';
      case 'emotional_pattern': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'user_profile': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const getImportanceColor = (importance: number) => {
    if (importance >= 0.8) return 'text-red-600';
    if (importance >= 0.6) return 'text-orange-600';
    if (importance >= 0.4) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="w-4 h-4 text-carebow-primary" />
            ChatGPT Memory
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            className="pl-10 pr-4"
          />
        </div>

        {/* Memory Type Filter */}
        <Tabs value={selectedType} onValueChange={setSelectedType}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="health_concern" className="text-xs">Health</TabsTrigger>
            <TabsTrigger value="remedy_preference" className="text-xs">Remedies</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Memory List */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 max-h-96 overflow-y-auto"
            >
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-carebow-primary"></div>
                </div>
              ) : filteredMemories.length === 0 ? (
                <div className="text-center py-4 text-sm text-gray-500">
                  {searchQuery ? 'No memories found' : 'No memories yet'}
                </div>
              ) : (
                filteredMemories.slice(0, 10).map((memory) => (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onMemorySelect?.(memory)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getMemoryIcon(memory.type)}</span>
                        <h4 className="font-medium text-sm text-carebow-text-dark line-clamp-1">
                          {memory.title}
                        </h4>
                      </div>
                      <Badge className={`text-xs ${getMemoryColor(memory.type)}`}>
                        {memory.type.replace('_', ' ')}
                      </Badge>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {memory.content}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          <span className={getImportanceColor(memory.importance)}>
                            {Math.round(memory.importance * 100)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(memory.last_accessed)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{memory.access_count}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {memory.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {memory.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {memory.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{memory.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Stats */}
        {!isExpanded && memories.length > 0 && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{memories.length} memories stored</span>
            <span>Last updated: {formatDate(memories[0]?.last_accessed)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatGPTMemory;
