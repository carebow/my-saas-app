/**
 * Test component to verify Sentry integration in the frontend.
 * Add this to any page to test Sentry functionality.
 */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { captureException, captureMessage, setUserContext } from '@/lib/sentry';

const SentryTest: React.FC = () => {
  const handleTestMessage = () => {
    captureMessage('Sentry integration test - message from frontend', 'info', {
      tags: { test: 'true', component: 'frontend' },
      extra: { timestamp: new Date().toISOString() }
    });
    alert('Test message sent to Sentry! Check your dashboard.');
  };

  const handleTestException = () => {
    try {
      throw new Error('Sentry integration test - exception from frontend');
    } catch (error) {
      captureException(error as Error, {
        tags: { test: 'true', component: 'frontend' },
        extra: { timestamp: new Date().toISOString() }
      });
      alert('Test exception sent to Sentry! Check your dashboard.');
    }
  };

  const handleTestUserContext = () => {
    setUserContext({
      id: 'test-user-123',
      email: 'test@example.com',
      name: 'Test User'
    });
    
    captureMessage('User context test', 'info', {
      tags: { test: 'true', userContext: 'true' }
    });
    alert('User context set and test message sent!');
  };

  const handleTestErrorBoundary = () => {
    // This will trigger the error boundary
    throw new Error('Error boundary test - this should be caught by ErrorBoundary');
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Sentry Integration Test</CardTitle>
        <CardDescription>
          Test Sentry error monitoring and performance tracking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={handleTestMessage} variant="outline" className="w-full">
          Test Message Capture
        </Button>
        
        <Button onClick={handleTestException} variant="outline" className="w-full">
          Test Exception Capture
        </Button>
        
        <Button onClick={handleTestUserContext} variant="outline" className="w-full">
          Test User Context
        </Button>
        
        <Button onClick={handleTestErrorBoundary} variant="destructive" className="w-full">
          Test Error Boundary
        </Button>
      </CardContent>
    </Card>
  );
};

export default SentryTest;