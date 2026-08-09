import { createClient, Session, AuthChangeEvent } from '@supabase/supabase-js';

const supabaseURL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseURL, supabaseKey);

export { Session, AuthChangeEvent }
export default supabase;