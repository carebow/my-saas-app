
import React, { useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback,
  requireAuth = true 
}) => {
  const { user, session, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Memoize the authentication check to prevent unnecessary re-renders
  const authStatus = useMemo(() => ({
    isAuthenticated: isAuthenticated && !!user && !!session,
    isLoading: loading,
    hasUser: !!user,
    hasSession: !!session,
    path: location.pathname
  }), [isAuthenticated, user, session, loading, location.pathname]);

  // Debug logging with performance optimization
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🛡️ ProtectedRoute Status:', authStatus);
    }
  }, [authStatus]);

  // Show loading state
  if (loading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If no authentication required, render children
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Check authentication
  if (!authStatus.isAuthenticated) {
    // Store the attempted path for redirect after login
    const currentPath = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const redirectUrl = searchParams.toString() ? `${currentPath}?${searchParams.toString()}` : currentPath;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('❌ ProtectedRoute: Access denied, redirecting to auth');
      console.log('📍 Attempted path:', currentPath);
      console.log('🔄 Redirect URL:', redirectUrl);
    }
    
    return <Navigate to={`/auth?redirect=${encodeURIComponent(redirectUrl)}`} replace />;
  }

  // User is authenticated, render the protected content
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ ProtectedRoute: Access granted for', location.pathname);
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
