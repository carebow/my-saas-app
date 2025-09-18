
import { motion } from "framer-motion";
import { CheckCircle, Users, Mail, Heart, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface SuccessStateProps {
  queuePosition: number;
}

const SuccessState = ({ queuePosition }: SuccessStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-2xl mx-auto"
    >
      <Card className="border-2 border-emerald-200 bg-white shadow-2xl">
        <CardHeader className="text-center pb-8 bg-white">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CardTitle className="text-3xl bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Welcome to CareBow!
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg">
              You're successfully on our premium waitlist
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="text-center space-y-8 bg-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200 shadow-inner"
          >
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                #{queuePosition}
              </span>
            </div>
            <p className="text-slate-600 font-medium">Your premium position in the waitlist</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <Mail className="w-6 h-6 text-blue-500" />
              <span className="text-slate-700">Confirmation email sent</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <Heart className="w-6 h-6 text-red-500" />
              <span className="text-slate-700">Early access coming soon</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-700">What's Next?</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              We'll keep you updated on our progress and notify you when early access becomes available. Thank you for joining our mission to revolutionize healthcare!
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SuccessState;
