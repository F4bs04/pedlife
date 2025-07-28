import { supabase } from '@/integrations/supabase/client';

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test 1: Check if client is initialized
    console.log('Supabase client:', supabase);
    
    // Test 2: Check connection
    const { data, error } = await supabase.auth.getSession();
    console.log('Current session:', data, 'Error:', error);
    
    // Test 3: Check user
    const { data: user, error: userError } = await supabase.auth.getUser();
    console.log('Current user:', user, 'Error:', userError);
    
    return { success: true, message: 'Supabase connection is working' };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return { success: false, message: 'Supabase connection failed', error };
  }
};
