import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const PROTECTED_PAGES = ['/profile', '/posts/new', '/feed'];

const AUTH_REQUIRED_API: { method: string; path: string }[] = [
  { method: 'POST',   path: '/api/posts' },
  { method: 'PUT',    path: '/api/posts' },
  { method: 'DELETE', path: '/api/posts' },
  { method: 'PUT',    path: '/api/users' },
  { method: 'DELETE', path: '/api/users' },
];

function isProtectedPage(pathname: string): boolean {
  if (PROTECTED_PAGES.includes(pathname)) return true;
  if (pathname.startsWith('/posts/')) return true;
  return false;
}

function requiresApiAuth(method: string, pathname: string): boolean {
  return AUTH_REQUIRED_API.some(
    (r) => r.method === method && pathname.startsWith(r.path)
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  let res = NextResponse.next({ request: { headers: req.headers } });

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

  if (pathname === '/login' || pathname === '/signup') {
    if (session) {
      const url = req.nextUrl.clone();
      url.pathname = '/feed';
      url.search = '';
      return NextResponse.redirect(url);
    }
    return res;
  }

  if (isProtectedPage(pathname)) {
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('returnTo', pathname);
      return NextResponse.redirect(url);
    }
    return res;
  }

  if (pathname.startsWith('/api/') && requiresApiAuth(req.method, pathname)) {
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/feed',
    '/profile',
    '/posts/new',
    '/posts/:id',
    '/posts/:id/edit',
    '/api/:path*',
  ],
};