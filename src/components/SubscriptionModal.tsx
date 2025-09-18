import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Check, Loader2 } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubscribe = async (priceType: 'basic' | 'premium' | 'annual') => {
    setLoading(priceType);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceType }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic Monthly',
      price: '$9.99',
      period: '/month',
      features: [
        'Basic AI health consultations',
        'Voice interactions in 7 languages',
        'Basic Ayurvedic remedies',
        'Limited recovery tracking',
        'Email support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Monthly',
      price: '$19.99',
      period: '/month',
      popular: true,
      features: [
        'Unlimited AI health consultations',
        'Voice interactions in 7 languages',
        'Personalized Ayurvedic remedies',
        'Advanced recovery tracking',
        'Smart doctor recommendations',
        'Save consultation history',
        'AI health reminders',
        'Priority doctor booking',
        'Expert video content library',
        'Family health profiles (up to 5)',
        'Advanced AI health analytics',
        'Priority customer support'
      ]
    },
    {
      id: 'annual',
      name: 'Premium Annual',
      price: '$199.99',
      period: '/year',
      savings: 'Save 17% vs Monthly',
      features: [
        'Unlimited AI health consultations',
        'Voice interactions in 7 languages',
        'Personalized Ayurvedic remedies',
        'Advanced recovery tracking',
        'Smart doctor recommendations',
        'Save consultation history',
        'AI health reminders',
        'Priority doctor booking',
        'Expert video content library',
        'Family health profiles (up to 5)',
        'Advanced AI health analytics',
        'Priority customer support',
        '2 months free vs monthly billing'
      ]
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-carebow-primary mb-2">
            You've Used All Free Consultations
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            Upgrade now to continue with unlimited AI-powered health guidance!
          </p>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.popular ? 'border-carebow-primary ring-2 ring-carebow-primary/20' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-carebow-primary">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-carebow-primary">
                    {plan.price}
                    <span className="text-sm text-muted-foreground font-normal">{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <Badge variant="secondary" className="text-xs">
                      {plan.savings}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-carebow-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSubscribe(plan.id as 'basic' | 'premium' | 'annual')}
                  disabled={loading === plan.id}
                  className={`w-full ${plan.popular ? 'bg-carebow-primary hover:bg-carebow-primary/90' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {loading === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Subscribe Now'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>✅ Cancel anytime • ✅ 7-day money-back guarantee • ✅ Secure payments</p>
          <p className="mt-1">Your subscription will auto-renew unless cancelled</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;