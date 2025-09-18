/**
 * React Error Boundary with Sentry integration for CareBow
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  eventId: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Sentry disabled for debugging
    const eventId = null;

    this.setState({
      error,
      errorInfo,
      eventId,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportFeedback = () => {
    if (this.state.eventId) {
      Sentry.showReportDialog({ eventId: this.state.eventId });
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Something went wrong
              </CardTitle>
              <CardDescription className="text-gray-600">
                We're sorry, but an unexpected error occurred. Our team has been notified.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Button onClick={this.handleReload} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reload Page
                </Button>
                
                <Button variant="outline" onClick={this.handleGoHome} className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Homepage
                </Button>
                
                {this.state.eventId && (
                  <Button variant="outline" onClick={this.handleReportFeedback} className="w-full">
                    <Bug className="mr-2 h-4 w-4" />
                    Report Issue
                  </Button>
                )}
              </div>
              
              {(this.props.showDetails || import.meta.env.DEV) && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                    Technical Details
                  </summary>
                  <div className="mt-2 rounded-md bg-gray-100 p-3">
                    <pre className="text-xs text-gray-800 overflow-auto">
                      <strong>Error:</strong> {this.state.error.toString()}
                      {'\n\n'}
                      <strong>Stack:</strong> {this.state.error.stack}
                      {'\n\n'}
                      <strong>Component Stack:</strong> {this.state.errorInfo?.componentStack}
                    </pre>
                  </div>
                </details>
              )}
              
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Error ID: {this.state.eventId || 'Unknown'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Sentry's built-in error boundary (alternative)
export const SentryErrorBoundary = Sentry.withErrorBoundary;

export default ErrorBoundary;