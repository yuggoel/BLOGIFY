import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser Supabase client — uses the standard localStorage-based session.
 * getSession() reads localStorage synchronously (after hydration) so there
 * is no cookie-flush race on navigation.
 *
 * Middleware uses its own createServerClient(@supabase/ssr) that reads the
 * sb-* cookies that Supabase also writes alongside localStorage.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
