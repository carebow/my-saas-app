import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, MessageSquare, X, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { feedbackService } from '@/services/feedbackService';

interface FeedbackWidgetProps {
  conversationId: string;
  onFeedbackSubmitted?: (rating: 'positive' | 'negative', comment?: string) => void;
  className?: string;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  conversationId,
  onFeedbackSubmitted,
  className = ''
}) => {
  const [selectedRating, setSelectedRating] = useState<'positive' | 'negative' | null>(null);
  const [comment, setComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleRatingClick = (rating: 'positive' | 'negative') => {
    setSelectedRating(rating);
    setShowCommentBox(true);
  };

  const submitFeedback = async () => {
    if (!selectedRating) return;

    setIsSubmitting(true);
    try {
      await feedbackService.submitFeedback({
        conversation_id: conversationId,
        rating: selectedRating,
        comment: comment.trim() || undefined
      });

      setIsSubmitted(true);
      onFeedbackSubmitted?.(selectedRating, comment.trim() || undefined);
      
      toast({
        title: "Thank you!",
        description: "Your feedback helps us improve CareBow.",
      });

    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFeedback = () => {
    setSelectedRating(null);
    setComment('');
    setShowCommentBox(false);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${className}`}
      >
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2 text-green-700">
              <Check className="w-5 h-5" />
              <span className="font-medium">Thank you for your feedback!</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFeedback}
              className="w-full mt-2 text-green-600 hover:text-green-700"
            >
              Submit new feedback
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${className}`}
    >
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-blue-50/50">
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Rating Question */}
            <div className="text-center">
              <h3 className="font-medium text-gray-900 mb-2">
                How was your consultation with CareBow?
              </h3>
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant={selectedRating === 'positive' ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => handleRatingClick('positive')}
                  className={`flex items-center gap-2 ${
                    selectedRating === 'positive' 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'hover:bg-green-50 hover:border-green-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span className="text-2xl">👍</span>
                </Button>
                <Button
                  variant={selectedRating === 'negative' ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => handleRatingClick('negative')}
                  className={`flex items-center gap-2 ${
                    selectedRating === 'negative' 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'hover:bg-red-50 hover:border-red-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <ThumbsDown className="w-5 h-5" />
                  <span className="text-2xl">👎</span>
                </Button>
              </div>
            </div>

            {/* Comment Box */}
            <AnimatePresence>
              {showCommentBox && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MessageSquare className="w-4 h-4" />
                    <span>Tell us more (optional)</span>
                  </div>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={
                      selectedRating === 'positive' 
                        ? "What did you like about your consultation?"
                        : "How can we improve your experience?"
                    }
                    className="min-h-[80px] resize-none"
                    maxLength={500}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {comment.length}/500 characters
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCommentBox(false)}
                        disabled={isSubmitting}
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                      <Button
                        onClick={submitFeedback}
                        disabled={isSubmitting}
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          'Submit'
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Submit for rating only */}
            {selectedRating && !showCommentBox && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCommentBox(true)}
                  disabled={isSubmitting}
                >
                  Add comment
                </Button>
                <Button
                  onClick={submitFeedback}
                  disabled={isSubmitting}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    'Submit'
                  )}
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};