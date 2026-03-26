import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xkhqzuztpbvaoxutgidf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhraHF6dXp0cGJ2YW94dXRnaWRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NDQ3MTUsImV4cCI6MjA5MDAyMDcxNX0.tq7oEZ053-enRxbk6VzVe8s8e7xrwjRur6OpTzcegss';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
