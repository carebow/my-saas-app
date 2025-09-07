import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Shield, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Remedy {
  id: string;
  type: string;
  title: string;
  description: string;
  instructions: string;
  safety_level: string;
  confidence_score: number;
  personalization_factors: string[];
  comfort_level?: string;
  empathy_phrases?: string[];
  safety_notes?: string;
  comfort_message?: string;
}

interface PersonalizedRemedyCardProps {
  remedy: Remedy;
  onFeedback?: (remedyId: string, rating: number, followed: boolean) => void;
}

const PersonalizedRemedyCard: React.FC<PersonalizedRemedyCardProps> = ({ 
  remedy, 
  onFeedback 
}) => {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [followed, setFollowed] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'modern_medicine': return '💊';
      case 'ayurvedic': return '🌿';
      case 'home_remedy': return '🏠';
      case 'lifestyle': return '🏃‍♀️';
      case 'comfort_measure': return '🤗';
      default: return '💡';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'modern_medicine': return 'bg-blue-100 text-blue-800';
      case 'ayurvedic': return 'bg-green-100 text-green-800';
      case 'home_remedy': return 'bg-orange-100 text-orange-800';
      case 'lifestyle': return 'bg-purple-100 text-purple-800';
      case 'comfort_measure': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSafetyIcon = (level: string) => {
    switch (level) {
      case 'safe': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'caution': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'requires_consultation': return <Shield className="w-4 h-4 text-red-500" />;
      default: return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'safe': return 'text-green-600 bg-green-50 border-green-200';
      case 'caution': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'requires_consultation': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
    setShowFeedback(true);
    onFeedback?.(remedy.id, rating, followed);
  };

  const handleFollow = () => {
    setFollowed(!followed);
    if (userRating) {
      onFeedback?.(remedy.id, userRating, !followed);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getTypeIcon(remedy.type)}</span>
              <div>
                <h4 className="font-semibold text-sm text-carebow-text-dark line-clamp-2">
                  {remedy.title}
                </h4>
                <Badge className={`text-xs ${getTypeColor(remedy.type)}`}>
                  {remedy.type.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {getSafetyIcon(remedy.safety_level)}
              <Badge className={`text-xs ${getSafetyColor(remedy.safety_level)}`}>
                {remedy.safety_level.replace('_', ' ')}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-carebow-text-medium mb-3 line-clamp-2">
            {remedy.description}
          </p>

          {/* Comfort Message */}
          {remedy.comfort_message && (
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-3 h-3 text-pink-500" />
                <span className="text-xs font-medium text-pink-800">Comforting Message</span>
              </div>
              <p className="text-xs text-pink-700 italic">
                "{remedy.comfort_message}"
              </p>
            </div>
          )}

          {/* Empathy Phrases */}
          {remedy.empathy_phrases && remedy.empathy_phrases.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3 text-pink-500" />
                <span className="text-xs font-medium text-carebow-text-dark">Supportive phrases</span>
              </div>
              <div className="space-y-1">
                {remedy.empathy_phrases.map((phrase, index) => (
                  <div key={index} className="text-xs text-pink-700 italic">
                    • {phrase}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions Preview */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-3 h-3 text-carebow-text-light" />
              <span className="text-xs font-medium text-carebow-text-dark">Instructions</span>
            </div>
            <p className="text-xs text-carebow-text-medium line-clamp-3">
              {remedy.instructions}
            </p>
          </div>

          {/* Safety Notes */}
          {remedy.safety_notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-3 h-3 text-yellow-600" />
                <span className="text-xs font-medium text-yellow-800">Important Safety Note</span>
              </div>
              <p className="text-xs text-yellow-700">
                {remedy.safety_notes}
              </p>
            </div>
          )}

          {/* Personalization Factors */}
          {remedy.personalization_factors.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3 text-carebow-primary" />
                <span className="text-xs font-medium text-carebow-text-dark">Personalized for you</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {remedy.personalization_factors.slice(0, 3).map((factor, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {factor}
                  </Badge>
                ))}
                {remedy.personalization_factors.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{remedy.personalization_factors.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Comfort Level Indicator */}
          {remedy.comfort_level && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-3 h-3 text-pink-500" />
                <span className="text-xs font-medium text-carebow-text-dark">Comfort Level</span>
                <Badge className={`text-xs ${
                  remedy.comfort_level === 'high' ? 'bg-pink-100 text-pink-800' :
                  remedy.comfort_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {remedy.comfort_level}
                </Badge>
              </div>
            </div>
          )}

          {/* Confidence Score */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-carebow-text-medium">Confidence</span>
              <span className="text-xs font-medium text-carebow-text-dark">
                {Math.round(remedy.confidence_score * 100)}%
              </span>
            </div>
            <Progress 
              value={remedy.confidence_score * 100} 
              className="h-2"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={followed ? "default" : "outline"}
              onClick={handleFollow}
              className="flex-1 text-xs"
            >
              {followed ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Following
                </>
              ) : (
                <>
                  <Heart className="w-3 h-3 mr-1" />
                  Follow
                </>
              )}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowFeedback(!showFeedback)}
              className="text-xs"
            >
              Rate
            </Button>
          </div>

          {/* Feedback Section */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 pt-3 border-t"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-carebow-text-dark">How was it?</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    size="sm"
                    variant={userRating === rating ? "default" : "outline"}
                    onClick={() => handleRating(rating)}
                    className="w-8 h-8 p-0"
                  >
                    <Star className={`w-3 h-3 ${userRating === rating ? 'fill-current' : ''}`} />
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PersonalizedRemedyCard;

