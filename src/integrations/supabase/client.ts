// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gqfhszgakpwtmevnwpsl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZmhzemdha3B3dG1ldm53cHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5Mjk4MDIsImV4cCI6MjA2MDUwNTgwMn0.QlVUq0gU7joNxRerbzVGHqQt05eCtNpo7un4RBX2cAI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);