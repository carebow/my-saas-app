import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Clock, 
  Trash2, 
  Search, 
  Calendar,
  Filter,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface ChatSession {
  id: string;
  title: string;
  status: string;
  created_at: string;
  last_activity: string;
  message_count: number;
}

interface ChatHistoryProps {
  sessions: ChatSession[];
  onSelectSession: (sessionId: string) => void;
  currentSession: string | null;
  onDeleteSession?: (sessionId: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  sessions,
  onSelectSession,
  currentSession,
  onDeleteSession
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'title'>('recent');

  const filteredSessions = sessions
    .filter(session => {
      const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || session.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime();
        case 'oldest':
          return new Date(a.last_activity).getTime() - new Date(b.last_activity).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteSession) {
      onDeleteSession(sessionId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Filter className="w-4 h-4 mr-2" />
                {filterStatus === 'all' ? 'All' : filterStatus}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                All Sessions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('urgent')}>
                Urgent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('completed')}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('archived')}>
                Archived
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Calendar className="w-4 h-4 mr-2" />
                {sortBy === 'recent' ? 'Recent' : sortBy === 'oldest' ? 'Oldest' : 'Title'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('recent')}>
                Most Recent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('oldest')}>
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('title')}>
                Alphabetical
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Sessions List */}
      <ScrollArea className="h-96">
        <div className="space-y-2">
          <AnimatePresence>
            {filteredSessions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-gray-500"
              >
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">No conversations found</p>
                {searchQuery && (
                  <p className="text-xs text-gray-400 mt-1">
                    Try adjusting your search terms
                  </p>
                )}
              </motion.div>
            ) : (
              filteredSessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-200 ${
                      currentSession === session.id
                        ? 'ring-2 ring-carebow-primary bg-carebow-primary/5'
                        : 'hover:shadow-md hover:bg-gray-50'
                    }`}
                    onClick={() => onSelectSession(session.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageCircle className="w-4 h-4 text-carebow-primary flex-shrink-0" />
                            <h4 className="font-medium text-sm text-carebow-text-dark truncate">
                              {session.title}
                            </h4>
                            <Badge className={`text-xs ${getStatusColor(session.status)}`}>
                              {session.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-carebow-text-light">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(session.last_activity)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              <span>{session.message_count} messages</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 ml-2">
                          {currentSession === session.id && (
                            <ChevronRight className="w-4 h-4 text-carebow-primary" />
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => handleDeleteSession(session.id, e)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Stats */}
      {sessions.length > 0 && (
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-carebow-text-light">
            <span>{sessions.length} total conversations</span>
            <span>{filteredSessions.length} shown</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;

