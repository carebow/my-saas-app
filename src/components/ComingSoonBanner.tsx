
import { motion } from "framer-motion";
import { Rocket, Clock, Users, Sparkles } from "lucide-react";

const ComingSoonBanner = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-md">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-purple-600 font-semibold">Coming Soon</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            🚀 CareBow is 
            <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Actively Developing
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're working hard to launch our AI-powered home healthcare solution. 
            Our team is dedicated to bringing you the most innovative and compassionate care experience.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
            >
              <Rocket className="w-8 h-8 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Platform Development</h3>
              <p className="text-gray-600">Building cutting-edge AI technology for personalized healthcare</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
            >
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Provider Network</h3>
              <p className="text-gray-600">Partnering with top healthcare professionals nationwide</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
            >
              <Clock className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Launch Preparation</h3>
              <p className="text-gray-600">Final testing and quality assurance for the best experience</p>
            </motion.div>
          </div>

          <div className="mt-12 p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Early Access</h3>
            <p className="text-gray-600 mb-6">
              Join our waitlist to be among the first to experience CareBow's revolutionary healthcare platform. 
              Early members will receive exclusive benefits and priority access.
            </p>
            <motion.a
              href="#waitlist"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Our Waitlist
              <Rocket className="w-5 h-5 ml-2" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComingSoonBanner;
