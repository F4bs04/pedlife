import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { checkAndCleanCorruptedTokens, clearAuthData } from '@/utils/auth-utils';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Get initial session with error handling
    const getSession = async () => {
      try {
        // First check and clean any corrupted tokens
        const hasValidSession = await checkAndCleanCorruptedTokens();
        
        if (!hasValidSession) {
          setSession(null);
          setLoading(false);
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthGuard session error:', error);
          // If there's an auth error related to refresh tokens, clean everything
          if (error.message.includes('Invalid Refresh Token') || error.message.includes('refresh_token_not_found')) {
            clearAuthData();
            setSession(null);
            setLoading(false);
            return;
          }
        }
        
        setSession(session);
        setLoading(false);
      } catch (error) {
        console.error('AuthGuard unexpected error:', error);
        clearAuthData();
        setSession(null);
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth state changes with error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AuthGuard auth state change:', event, session?.user?.email);
        setSession(session);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;