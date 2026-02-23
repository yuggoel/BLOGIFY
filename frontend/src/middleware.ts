import { NextRequest, NextResponse } from 'next/server';

// Middleware is intentionally minimal: auth is enforced by JWT verification
// in the FastAPI backend and token checks in api.ts.
// This file is kept for any future /api route additions.

export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};

