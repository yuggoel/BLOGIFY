'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/api';
import { useUser } from '@/context/UserContext';

export default function Header() {
  const { user, logout } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={user ? "/feed" : "/"} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">Blogify</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {user ? (
              <Link href="/feed" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
                Feed
              </Link>
            ) : (
              <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
                Home
              </Link>
            )}
            <Link href="/about" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
              About Us
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center">
                    {user.profile_picture_url ? (
                      <img
                        src={getImageUrl(user.profile_picture_url) || ''}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
