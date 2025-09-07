import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const AuthDebug: React.FC = () => {
  const { user, session, loading } = useAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          🔐 Auth Debug
          <Badge variant={loading ? "secondary" : user ? "default" : "destructive"}>
            {loading ? "Loading" : user ? "Authenticated" : "Unauthenticated"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <strong>User:</strong> {user ? user.email : 'None'}
        </div>
        <div>
          <strong>User ID:</strong> {user?.id || 'None'}
        </div>
        <div>
          <strong>Session:</strong> {session ? 'Active' : 'None'}
        </div>
        <div>
          <strong>Access Token:</strong> {session?.access_token ? 'Present' : 'Missing'}
        </div>
        <div>
          <strong>Expires:</strong> {session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'None'}
        </div>
        <div>
          <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
        </div>
      </CardContent>
    </Card>
  );
};
