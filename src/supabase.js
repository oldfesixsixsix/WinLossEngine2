import { createClient } from '@supabase/supabase-js';

// Initialize as null, will be populated dynamically
export let supabase = null;

/**
 * Dynamically initialize Supabase client.
 * Priority: Vite env vars (local dev) -> Server API (production/Cloud Run)
 */
export async function initSupabaseDynamic() {
  // 1. Try Vite env variables (available during npm run dev)
  let url = import.meta.env.VITE_SUPABASE_URL;
  let key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // 2. If missing (typical in production Docker builds), fetch from server
  if (!url || !key) {
    try {
      const resp = await fetch('/api/config');
      if (resp.ok) {
        const config = await resp.json();
        url = config.supabaseUrl;
        key = config.supabaseAnonKey;
      }
    } catch (e) {
      console.warn('[Supabase] Failed to fetch runtime config from server', e);
    }
  }

  if (url && key) {
    try {
      supabase = createClient(url, key);
      console.log('[Supabase] Client initialized successfully.');
      return true;
    } catch (err) {
      console.error('[Supabase] Error creating client:', err);
    }
  } else {
    console.warn('[Supabase] Configuration missing. Auth features disabled.');
  }
  return false;
}

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
