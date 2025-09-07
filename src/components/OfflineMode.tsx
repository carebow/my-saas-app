/**
 * Offline Mode Component - Shows when backend is not available
 */
import React from 'react';
import { AlertTriangle, Wifi, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface OfflineModeProps {
  onRetry?: () => void;
}

export const OfflineMode: React.FC<OfflineModeProps> = ({ onRetry }) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <Wifi className="h-6 w-6 text-orange-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Server Unavailable
          </CardTitle>
          <CardDescription className="text-gray-600">
            We're having trouble connecting to our servers. You can still browse the site, but some features may be limited.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            
            <Button variant="outline" onClick={() => window.location.href = '/'} className="w-full">
              Browse Offline
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Check your internet connection or try again later
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfflineMode;
