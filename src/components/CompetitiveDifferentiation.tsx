import React from 'react';
import { Check, X, Heart } from 'lucide-react';

const CompetitiveDifferentiation = () => {
  const competitors = [
    {
      feature: "AI-Powered Predictive Analytics",
      carebow: true,
      others: false,
      description: "Predicts health issues before they become emergencies"
    },
    {
      feature: "24/7 Voice-Enabled Support",
      carebow: true,
      others: false,
      description: "Natural conversation with AI for immediate assistance"
    },
    {
      feature: "Real-Time Family Dashboard",
      carebow: true,
      others: "Limited",
      description: "Comprehensive health insights and daily updates"
    },
    {
      feature: "HIPAA-Compliant Communication",
      carebow: true,
      others: true,
      description: "Secure messaging between all care team members"
    },
    {
      feature: "Basic Caregiver Matching",
      carebow: true,
      others: true,
      description: "Connect with local certified caregivers"
    },
    {
      feature: "Emergency Response Coordination",
      carebow: true,
      others: "Manual",
      description: "Automated alerts and response protocols"
    }
  ];

  const getStatusIcon = (status: boolean | string) => {
    if (status === true) return <Check className="w-5 h-5 text-green-600" />;
    if (status === false) return <X className="w-5 h-5 text-red-500" />;
    return <span className="text-sm text-yellow-600 font-medium">{status}</span>;
  };

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            CareBow vs Other Platforms
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            See how our AI-powered approach goes beyond basic caregiver matching to deliver comprehensive family peace of mind.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="grid grid-cols-4 gap-4 p-6 bg-slate-50 border-b border-slate-200">
            <div className="col-span-2">
              <h3 className="font-semibold text-slate-900">Feature</h3>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-600">CareBow</span>
              </div>
            </div>
            <div className="text-center">
              <span className="font-semibold text-slate-600">Other Platforms</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {competitors.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 p-6 hover:bg-slate-50 transition-colors">
                <div className="col-span-2">
                  <h4 className="font-medium text-slate-900 mb-1">{item.feature}</h4>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
                <div className="flex justify-center items-center">
                  {getStatusIcon(item.carebow)}
                </div>
                <div className="flex justify-center items-center">
                  {getStatusIcon(item.others)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
            <Heart className="w-4 h-4" />
            Experience the difference with our comprehensive AI-powered platform
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompetitiveDifferentiation;