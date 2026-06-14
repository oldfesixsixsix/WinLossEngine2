import { createClient } from '@supabase/supabase-js';

// Access variables safely from import.meta.env (Vite client-side env variables)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a single Supabase client instance if values are specified
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Helper to check if Supabase is fully configured and usable in this workspace
 */
export function isSupabaseConfigured() {
  return !!supabase;
}

/**
 * Retrieve the current logged-in user details and active session tokens
 */
export async function getAuthSession() {
  if (!supabase) return null;
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return null;
    return session;
  } catch (err) {
    console.warn('[Supabase Error] Unable to check session.', err);
    return null;
  }
}
