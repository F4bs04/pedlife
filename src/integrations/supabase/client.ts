import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bwctrihpwmpafwpfzecg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Y3RyaWhwd21wYWZ3cGZ6ZWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1Nzc5MzksImV4cCI6MjA2NTE1MzkzOX0.UsNWzqfQtYr1oaRMhPii8CsCy37ObdDDLH5Kf1_zrp8';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});