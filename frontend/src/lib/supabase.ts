import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Single shared Supabase browser client.
 * Using createBrowserClient from @supabase/ssr so the session is stored
 * in cookies (not just localStorage) — this allows middleware to read
 * and validate the session server-side without an extra round-trip.
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
