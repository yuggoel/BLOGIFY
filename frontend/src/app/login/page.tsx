'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { login as apiLogin } from '@/lib/api';
import { useUser } from '@/context/UserContext';

// Exponential back-off cooldowns in seconds
const COOLDOWNS = [10, 20, 40, 80, 160, 300];

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading, login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const failCount = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Redirect already-logged-in users away from /login
  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/feed');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('Account created successfully! Please sign in.');
    }
  }, [searchParams]);

  // Count down the cooldown every second
  useEffect(() => {
    if (cooldown <= 0) return;
    timerRef.current = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) { clearInterval(timerRef.current!); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const user = await apiLogin({ email, password });
      login(user); // update UserContext immediately
      failCount.current = 0;
      const returnTo = decodeURIComponent(searchParams.get('returnTo') ?? '/feed');
      router.push(returnTo);
      // Keep button showing "Signing in..." while navigating
    } catch (err) {
      failCount.current += 1;
      const wait = COOLDOWNS[Math.min(failCount.current - 1, COOLDOWNS.length - 1)];
      setCooldown(wait);
      setError(err instanceof Error ? err.message : 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">B</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">Sign in to your Blogify account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? 'Signing in...' : cooldown > 0 ? `Try again in ${cooldown}s` : 'Sign in'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-slate-600 dark:text-slate-300 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-400 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
