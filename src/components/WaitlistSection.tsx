
import WaitlistForm from "./WaitlistForm";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const WaitlistSection = () => {
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

  return (
    <section id="waitlist" className="py-24 bg-white relative overflow-hidden">
      {/* Clean background decoration */}
      <div className="absolute inset-0 bg-white"></div>
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-to-r from-purple-100/10 to-blue-100/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-blue-100/10 to-purple-100/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8">
            Join the{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Healthcare Revolution
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Be among the first to experience the future of in-home healthcare. Secure your spot for exclusive early access.
          </p>
        </motion.div>
        
        <WaitlistForm onSubmit={handleWaitlistSubmit} />
      </div>
    </section>
  );
};

export default WaitlistSection;
