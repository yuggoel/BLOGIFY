'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/api';
import { useUser } from '@/context/UserContext';

export default function Header() {
  const { user, logout } = useUser();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
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

          {/* Desktop Navigation */}
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

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-200 dark:border-slate-700 pt-4">
            <nav className="flex flex-col gap-4">
              {user ? (
                <>
                  <Link
                    href="/feed"
                    onClick={closeMobileMenu}
                    className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                  >
                    Feed
                  </Link>
                  <Link
                    href="/posts/new"
                    onClick={closeMobileMenu}
                    className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                  >
                    Create Post
                  </Link>
                </>
              ) : (
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                >
                  Home
                </Link>
              )}
              <Link
                href="/about"
                onClick={closeMobileMenu}
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
              >
                About Us
              </Link>

              <hr className="border-slate-200 dark:border-slate-700" />

              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
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
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="text-center py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition border border-slate-300 dark:border-slate-600 rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={closeMobileMenu}
                    className="text-center py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
