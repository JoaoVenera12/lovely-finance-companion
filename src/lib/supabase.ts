import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = "https://gqfhszgakpwtmevnwpsl.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZmhzemdha3B3dG1ldm53cHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5Mjk4MDIsImV4cCI6MjA2MDUwNTgwMn0.QlVUq0gU7joNxRerbzVGHqQt05eCtNpo7un4RBX2cAI";

// Client-side Supabase client
export const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Since we're using React Router instead of Next.js, we don't need the server client code
// If server functionality is needed later, we can implement it differently
