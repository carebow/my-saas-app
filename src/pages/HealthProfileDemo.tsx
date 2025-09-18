'use client'
import React, { useState } from 'react';
// import { motion } from 'framer-motion';
import HealthProfileForm from '../components/forms/HealthProfileForm';
import Navbar from '../components/UnifiedNavigation';
import Footer from '../components/UnifiedFooter';
import SEO from '../components/SEO';

const HealthProfileDemo = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Health Profile Data:', data);
    
    // Here you would typically send the data to your backend
    // Example:
    // const { error } = await supabase
    //   .from('health_profiles')
    //   .upsert({ ...data, user_id: user.id });
    
    setIsLoading(false);
  };

  // Example of pre-filled data (you might load this from your database)
  const initialData = {
    fullName: 'John Doe',
    phone: '+1234567890',
    // Add other fields as needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SEO 
        title="Health Profile - CareBow"
        description="Complete your health profile to receive personalized care recommendations."
      />
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Complete Your Health Profile
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Help us provide you with personalized care by sharing your health information. 
              All data is encrypted and HIPAA compliant.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <HealthProfileForm
              initialData={initialData}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HealthProfileDemo;