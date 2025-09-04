import React from 'react';
import { FeedbackWidget } from '@/components/ui/feedback-widget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const FeedbackExample: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Consultation Complete</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Based on your symptoms, I recommend scheduling a routine check-up with your primary care physician within the next week. 
            In the meantime, continue monitoring your symptoms and contact your doctor if they worsen.
          </p>
          
          <FeedbackWidget
            conversationId="example-conversation-123"
            onFeedbackSubmitted={(rating, comment) => {
              console.log('Feedback received:', { rating, comment });
              alert(`Thank you for your ${rating} feedback!${comment ? ` Comment: "${comment}"` : ''}`);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};