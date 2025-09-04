import WaitlistForm from "./WaitlistForm";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Gift, Clock, Users, Star, ArrowRight } from "lucide-react";

const EnhancedWaitlistSection = () => {
  const { toast } = useToast();

  const handleWaitlistSubmit = async (data: { email: string; fullName: string; [key: string]: unknown }) => {
    console.log("Waitlist submission:", data);
    
    try {
      // Input validation
      if (!data.email || !data.fullName) {
        throw new Error('Full name and email are required');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Please enter a valid email address');
      }

      const { data: result, error } = await supabase.functions.invoke('join-waitlist', {
        body: {
          ...data,
          // Sanitize inputs
          email: data.email.toLowerCase().trim(),
          fullName: data.fullName.trim(),
          location: data.location?.trim() || null,
          questions: data.questions?.trim() || null,
          hearAbout: data.hearAbout?.trim() || null,
          signupFor: data.signupFor?.trim() || null,
          careType: data.careType?.trim() || null
        }
      });
      
      if (error) throw error;
      
      if (result.success) {
        toast({
          title: "Welcome to CareBow! 🎉",
          description: "Confirmation email sent to your inbox. Check your spam folder if you don't see it.",
        });
        
        return {
          success: true,
          queuePosition: result.queuePosition
        };
      } else {
        throw new Error(result.error || 'Failed to join waitlist');
      }
    } catch (error: unknown) {
      console.error("Waitlist submission error:", error);
      
      let errorMessage = "Failed to join waitlist. Please try again.";
      
      if (error instanceof Error && (error.message.includes('email') || error.message.includes('Email'))) {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message.includes('required')) {
        errorMessage = "Please fill in all required fields.";
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      toast({
        title: "Oops! Something went wrong",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const earlyAccessBenefits = [
    {
      icon: Gift,
      title: "50% Off First Month",
      description: "Exclusive discount for early adopters",
      color: "text-carebow-secondary"
    },
    {
      icon: Clock,
      title: "Priority Booking",
      description: "First access to caregiver appointments",
      color: "text-carebow-primary"
    },
    {
      icon: Users,
      title: "Free Family Assessment",
      description: "Comprehensive care evaluation ($200 value)",
      color: "text-carebow-accent"
    },
    {
      icon: Star,
      title: "VIP Support",
      description: "Direct line to our care coordination team",
      color: "text-carebow-secondary"
    }
  ];

  return (
    <section id="waitlist" className="py-24 bg-gradient-to-b from-white via-carebow-blue/10 to-carebow-mint/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-r from-carebow-primary/5 to-carebow-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-l from-carebow-secondary/5 to-carebow-accent/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-carebow-secondary/10 to-carebow-primary/10 text-carebow-secondary px-6 py-3 rounded-full text-sm font-medium mb-6 border border-carebow-secondary/20">
            🔥 Limited Early Access Spots Available
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-carebow-text-dark mb-8">
            Secure Your Family's{" "}
            <span className="bg-gradient-to-r from-carebow-primary to-carebow-secondary bg-clip-text text-transparent">
              Early Access
            </span>
          </h2>
          <p className="text-xl text-carebow-text-medium max-w-3xl mx-auto leading-relaxed mb-8">
            Join over 3,000 families waiting for CareBow's launch. Be the first to experience 
            the future of in-home care for your parents.
          </p>
          
          {/* Urgency indicator */}
          <div className="inline-flex items-center gap-2 text-carebow-text-medium mb-12">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm">
              <span className="font-bold text-carebow-secondary">150+ people</span> joined this week
            </span>
          </div>
        </motion.div>

        {/* Early Access Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-2xl border border-carebow-blue/20 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-carebow-text-dark mb-4">
                Early Access Benefits Worth $500+
              </h3>
              <p className="text-carebow-text-medium">
                Limited-time perks for waitlist members only
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {earlyAccessBenefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-4 rounded-xl bg-gradient-to-b from-carebow-neutral/20 to-transparent border border-carebow-blue/10"
                >
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r from-carebow-blue/20 to-carebow-mint/20 flex items-center justify-center`}>
                    <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                  </div>
                  <h4 className="font-bold text-carebow-text-dark mb-2 text-sm">
                    {benefit.title}
                  </h4>
                  <p className="text-xs text-carebow-text-medium">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Waitlist Form */}
        <WaitlistForm onSubmit={handleWaitlistSubmit} />

        {/* Social Proof Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-carebow-primary/5 to-carebow-secondary/5 rounded-2xl p-8 border border-carebow-blue/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <h4 className="text-lg font-bold text-carebow-text-dark mb-2">
                  Why families choose CareBow
                </h4>
                <div className="flex items-center gap-4 text-sm text-carebow-text-medium">
                  <div className="flex items-center gap-1">
                    ⭐⭐⭐⭐⭐ <span className="ml-1">4.9/5 rating</span>
                  </div>
                  <div>👥 3,000+ families waiting</div>
                  <div>🔒 HIPAA compliant</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-carebow-primary font-medium">
                <span>Questions? Book a demo</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedWaitlistSection;