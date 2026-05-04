import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Make sure to add your Supabase credentials to .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for Medicine
export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  time: string; // Time in HH:MM format (e.g., "08:00")
  created_at: string;
  user_id?: string;
}
