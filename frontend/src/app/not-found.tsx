import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition"
          >
            Go Home
          </Link>
          <Link
            href="/feed"
            className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            Browse Feed
          </Link>
        </div>
      </div>
    </div>
  );
}
