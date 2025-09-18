import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
}

export const useSubscription = () => {
  const { user, session } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkSubscription = useCallback(async () => {
    if (!user || !session) {
      setSubscriptionData({
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      setSubscriptionData({
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier || null,
        subscription_end: data.subscription_end || null,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast({
        title: "Error",
        description: "Failed to check subscription status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, session, toast]);

  const openCustomerPortal = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management",
        variant: "destructive",
      });
    }
  };

  // Check subscription on auth state change
  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user, checkSubscription]);

  // Check subscription periodically for active sessions
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(checkSubscription, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  return {
    ...subscriptionData,
    loading,
    checkSubscription,
    openCustomerPortal,
    isSubscribed: subscriptionData.subscribed,
    isPremium: subscriptionData.subscription_tier === 'Premium' || subscriptionData.subscription_tier === 'Premium Annual',
    isBasic: subscriptionData.subscription_tier === 'Basic',
  };
};