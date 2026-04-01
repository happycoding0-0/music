import { createClient } from '@supabase/supabase-js';

// Supabase environment variables should be defined in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-vibetree.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Missing Supabase environment variables! VibeTree features like sharing and editing will not work until variables are added.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
