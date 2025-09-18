import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedAskCareBowProps {
  children: React.ReactNode;
}

const ProtectedAskCareBow: React.FC<ProtectedAskCareBowProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-carebow-primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth?redirect=/ask-carebow/app" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAskCareBow;