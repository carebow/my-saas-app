
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Users, TrendingUp, ArrowRight } from "lucide-react";

const InvestorSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-sm font-medium text-blue-300">
                <TrendingUp className="w-4 h-4 mr-2" />
                Investment Opportunity
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Ready to Transform
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Healthcare Together?
                </span>
              </h2>
              
              <p className="text-xl text-slate-300 leading-relaxed">
                Join us in revolutionizing India's home healthcare industry. CareBow is seeking strategic investors and partners who share our vision of making quality healthcare accessible to every family.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center text-blue-400">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  <span className="font-semibold">Market Opportunity</span>
                </div>
                <p className="text-slate-300 text-sm pl-5">$20B+ home healthcare market in India</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-purple-400">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  <span className="font-semibold">Technology Edge</span>
                </div>
                <p className="text-slate-300 text-sm pl-5">AI-powered care matching & monitoring</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="font-semibold">Proven Traction</span>
                </div>
                <p className="text-slate-300 text-sm pl-5">Growing waitlist & partner network</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-blue-300">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
                  <span className="font-semibold">Experienced Team</span>
                </div>
                <p className="text-slate-300 text-sm pl-5">Healthcare & tech industry veterans</p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="h-14 px-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg font-semibold group"
                asChild
              >
                <a 
                  href="https://cal.com/carebow/30min" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Calendar className="mr-3 w-5 h-5" />
                  Schedule a Meeting
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 border-2 border-slate-600 hover:border-blue-400 hover:bg-blue-500/10 text-slate-300 hover:text-blue-300 rounded-2xl transition-all duration-300 text-lg font-semibold bg-transparent"
                asChild
              >
                <a href="#waitlist" className="flex items-center">
                  <Users className="mr-2 w-5 h-5" />
                  View Pitch Deck
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white">Investment Meeting</h3>
                    <Calendar className="w-8 h-8 text-blue-400" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 px-4 bg-slate-700/50 rounded-xl">
                      <span className="text-slate-300">Duration</span>
                      <span className="text-white font-semibold">30 minutes</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 px-4 bg-slate-700/50 rounded-xl">
                      <span className="text-slate-300">Format</span>
                      <span className="text-white font-semibold">Video Call</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 px-4 bg-slate-700/50 rounded-xl">
                      <span className="text-slate-300">Availability</span>
                      <span className="text-green-400 font-semibold">Mon-Fri, 9AM-6PM IST</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-slate-400 text-sm">
                      Perfect for investors, strategic partners, and potential collaborators interested in learning more about CareBow's mission and growth opportunities.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-2xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InvestorSection;
