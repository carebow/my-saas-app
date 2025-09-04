import React from 'react';
import SEO from '@/components/SEO';
import { BetaCareBow } from '@/components/enhanced/BetaCareBow';

const AskCareBow = () => {
  return (
    <>
      <SEO 
        title="Ask CareBow - AI Health Assistant | CareBow"
        description="Get instant AI-powered health guidance combining modern medicine with traditional Ayurvedic wisdom. Your personal health companion powered by GPT-4."
        keywords="AI health assistant, natural remedies, Ayurveda, voice chat, health guidance, multilingual health, personalized wellness, CareBow"
      />
      
      <BetaCareBow />
    </>
  );
};

export default AskCareBow;