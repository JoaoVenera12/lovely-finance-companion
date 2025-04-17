
import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { cookies } from 'next/headers';

const supabaseUrl = "https://gqfhszgakpwtmevnwpsl.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZmhzemdha3B3dG1ldm53cHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5Mjk4MDIsImV4cCI6MjA2MDUwNTgwMn0.QlVUq0gU7joNxRerbzVGHqQt05eCtNpo7un4RBX2cAI";

// Client-side Supabase client
export const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Create an authenticated client for the server
export const createServerSupabaseClient = () => {
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value;
        },
        set(name: string, value: string, options: { path: string; maxAge: number }) {
          try {
            cookies().set(name, value, options);
          } catch (error) {
            // Handle cookie error
          }
        },
        remove(name: string, options: { path: string }) {
          try {
            cookies().set(name, "", { ...options, maxAge: -1 });
          } catch (error) {
            // Handle cookie error
          }
        },
      },
    }
  );
};
