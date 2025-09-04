import React from 'react';
import { HealthDashboard } from '@/components/health/HealthDashboard';
import SEO from '@/components/SEO';

const AskCareBowApp = () => {

  return (
    <>
      <SEO 
        title="CareBow AI Assistant - Your Health Buddy"
        description="Experience your personal AI health companion with voice chat, natural remedies, and intelligent health guidance."
        keywords="AI health assistant, voice chat, natural remedies, health guidance, CareBow app"
      />
      
      <div className="min-h-screen bg-background">
        <HealthDashboard />
      </div>
    </>
  );
};

export default AskCareBowApp;