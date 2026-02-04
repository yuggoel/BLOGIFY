'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-4">⚠️</div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Something went wrong
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
          An unexpected error occurred. Please try again or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
