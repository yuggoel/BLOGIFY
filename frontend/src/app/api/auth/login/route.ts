import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service-role key server-side so we can call signInWithPassword
// without exposing it to the browser.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Normalise Supabase error messages — don't leak internals
      const status = error.status === 400 ? 401 : (error.status ?? 500);
      return NextResponse.json({ error: 'Invalid email or password' }, { status });
    }

    // Fetch public profile (may not exist yet if trigger hasn't fired)
    const { data: profile } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', data.user.id)
      .maybeSingle();

    return NextResponse.json({
      id: data.user.id,
      name: profile?.name ?? email.split('@')[0],
      email: data.user.email,
      // Forward the session so the client can restore it
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
