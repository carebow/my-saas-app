
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Form } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import FormFields from "./waitlist/FormFields";
import SuccessState from "./waitlist/SuccessState";
import { formSchema, type FormData } from "./waitlist/FormValidation";

interface WaitlistFormProps {
  onSubmit: (data: FormData) => Promise<{ success: boolean; queuePosition?: number; error?: string }>;
}

const WaitlistForm = ({ onSubmit }: WaitlistFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      location: "",
      signupFor: "myself",
      careType: "elder-care",
      hearAbout: "",
      questions: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const result = await onSubmit(data);
      if (result.success && result.queuePosition) {
        setQueuePosition(result.queuePosition);
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted && queuePosition) {
    return <SuccessState queuePosition={queuePosition} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-2xl mx-auto px-4 sm:px-6"
    >
      <Card className="border-2 border-slate-200 bg-white shadow-2xl">
        <CardHeader className="text-center pb-6 md:pb-8 bg-white px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center sm:text-left">
              Get Early Access to CareBow
            </CardTitle>
          </motion.div>
          <CardDescription className="text-slate-600 text-base md:text-lg leading-relaxed px-2 sm:px-0">
            Join our exclusive waitlist and be among the first to experience personalized in-home healthcare
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white px-4 sm:px-6 pb-6 md:pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 md:space-y-8">
              <FormFields control={form.control} />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <Button
                  type="submit"
                  className="w-full h-12 md:h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 text-base md:text-lg font-semibold min-h-[44px]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Joining Waitlist...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                      Join the Premium Waitlist
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WaitlistForm;
