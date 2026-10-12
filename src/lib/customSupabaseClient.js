import { createClient } from '@supabase/supabase-js';

// Neither value can contain whitespace; a stray space or line break pasted into the
// hosting dashboard makes Supabase reject every request with "Invalid API key".
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\s+/g, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.replace(/\s+/g, '');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file (see .env.example).'
  );
}

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export {
    customSupabaseClient,
    customSupabaseClient as supabase,
};
