import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';
import { checkAndCleanCorruptedTokens, clearAuthData } from '@/utils/auth-utils';

type UserProfile = Database['public']['Tables']['profiles']['Row'];

interface UserData {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

export function useUser(): UserData {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session with error handling
    const getSession = async () => {
      try {
        // First check and clean any corrupted tokens
        const hasValidSession = await checkAndCleanCorruptedTokens();
        
        if (!hasValidSession) {
          setLoading(false);
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          // If there's an auth error, clean the data and redirect
          if (error.message.includes('Invalid Refresh Token') || error.message.includes('refresh_token_not_found')) {
            clearAuthData();
            window.location.href = '/auth';
            return;
          }
        }
        
        setSession(session);
        
        // If there's a session, get the profile
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    // Function to fetch user profile
    const fetchProfile = async (userId: string) => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          // If profile doesn't exist, try to create it
          if (error.code === 'PGRST116') { // Row not found
            await createProfile(userId);
          }
        } else {
          setProfile(profile);
        }
      } catch (error) {
        console.error('Error in fetchProfile:', error);
      }
    };

    // Function to create user profile if it doesn't exist
    const createProfile = async (userId: string) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        const { data: newProfile, error } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
            crm: user.user_metadata?.crm || null,
            phone: user.user_metadata?.phone || null
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating profile:', error);
        } else {
          setProfile(newProfile);
        }
      } catch (error) {
        console.error('Error in createProfile:', error);
      }
    };

    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    session,
    user: session?.user || null,
    profile,
    loading
  };
}
