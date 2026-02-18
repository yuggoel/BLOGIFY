import { NextRequest, NextResponse } from 'next/server';

// Middleware is intentionally minimal: all data mutations go directly to
// Supabase via the JS client (not through /api routes), so auth is enforced
// by RLS policies on the database and session checks in api.ts.
// This file is kept for any future /api route additions.

export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};

