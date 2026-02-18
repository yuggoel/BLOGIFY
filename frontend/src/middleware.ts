import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { checkRateLimit } from '@/lib/rateLimitStore';

// ── Config ─────────────────────────────────────────────────────────────────────

/** Page routes that require a valid session */
const PROTECTED_PAGES = ['/profile', '/posts/new'];

/** API routes that require auth (mutations) */
const AUTH_REQUIRED_API: { method: string; path: string }[] = [
  { method: 'POST',   path: '/api/posts' },
  { method: 'PUT',    path: '/api/posts' },
  { method: 'DELETE', path: '/api/posts' },
  { method: 'PUT',    path: '/api/users' },
  { method: 'DELETE', path: '/api/users' },
];

/** Per-route rate limit configs */
const LIMITS: Record<string, { limit: number; windowMs: number }> = {
  '/api/auth/login':  { limit: 5,  windowMs: 60_000 },
  '/api/auth/signup': { limit: 3,  windowMs: 60_000 },
  '/api':             { limit: 60, windowMs: 60_000 },
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

function isProtectedPage(pathname: string): boolean {
  if (PROTECTED_PAGES.includes(pathname)) return true;
  // /posts/[id]/edit
  if (pathname.startsWith('/posts/') && pathname.endsWith('/edit')) return true;
  return false;
}

function requiresApiAuth(method: string, pathname: string): boolean {
  return AUTH_REQUIRED_API.some(
    (r) => r.method === method && pathname.startsWith(r.path)
  );
}

// ── Middleware ─────────────────────────────────────────────────────────────────

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  let res = NextResponse.next({ request: { headers: req.headers } });

  // Supabase SSR client — reads & refreshes the session cookie
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: { headers: req.headers } });
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // ── 1. Protected page routes ──────────────────────────────────────────────
  if (isProtectedPage(pathname)) {
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('returnTo', pathname);
      return NextResponse.redirect(url);
    }
    return res;
  }

  // ── 2. Protected API mutations ────────────────────────────────────────────
  if (pathname.startsWith('/api/') && requiresApiAuth(req.method, pathname)) {
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // ── 3. Rate limiting for all API routes ───────────────────────────────────
  if (pathname.startsWith('/api/')) {
    const routeKey =
      Object.keys(LIMITS).find((k) => pathname === k) ?? '/api';
    const config = LIMITS[routeKey];
    const ip = getIp(req);
    const result = checkRateLimit(`${ip}:${pathname}`, config);

    if (!result.allowed) {
      const retryAfterSec = Math.ceil((result.resetAt - Date.now()) / 1000);
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(retryAfterSec),
            'X-RateLimit-Limit': String(config.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
          },
        }
      );
    }

    res.headers.set('X-RateLimit-Limit', String(config.limit));
    res.headers.set('X-RateLimit-Remaining', String(result.remaining));
    res.headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetAt / 1000)));
  }

  return res;
}

export const config = {
  matcher: [
    '/profile',
    '/posts/new',
    '/posts/:id/edit',
    '/api/:path*',
  ],
};
