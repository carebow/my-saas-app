import React from 'react';

// Temporary workaround for TooltipProvider React bundling issue
// This provides a fallback when the Radix TooltipProvider fails
export const CustomTooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};