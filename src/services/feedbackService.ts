import { supabase } from '../integrations/supabase/client';

export interface FeedbackData {
  conversation_id: string;
  rating: 'positive' | 'negative';
  comment?: string;
}

export interface FeedbackResponse {
  id: string;
  conversation_id: string;
  user_id: number;
  rating: string;
  comment?: string;
  created_at: string;
}

import { safeLocalStorage } from '../lib/safeStorage';

class FeedbackService {
  private getAuthHeaders() {
    const token = safeLocalStorage.get('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async submitFeedback(feedbackData: FeedbackData): Promise<FeedbackResponse> {
    try {
      // First try using Supabase client if available
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        const response = await fetch('/api/v1/feedback/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify(feedbackData)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } else {
        // Fallback to localStorage token
        const response = await fetch('/api/v1/feedback/', {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(feedbackData)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }

  async getFeedback(conversationId: string): Promise<FeedbackResponse> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers = session?.access_token 
        ? { 'Authorization': `Bearer ${session.access_token}` }
        : this.getAuthHeaders();

      const response = await fetch(`/api/v1/feedback/${conversationId}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting feedback:', error);
      throw error;
    }
  }
}

export const feedbackService = new FeedbackService();