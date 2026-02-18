'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

interface RequireAuthProps {
  children: React.ReactNode;
}

/**
 * Wrap any page that requires authentication.
 * - While the session is loading → show a blank screen (avoids flash).
 * - If unauthenticated → redirect to /login preserving the intended URL.
 * - If authenticated → render children.
 */
export default function RequireAuth({ children }: RequireAuthProps) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const returnTo = encodeURIComponent(window.location.pathname);
      router.replace(`/login?returnTo=${returnTo}`);
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
