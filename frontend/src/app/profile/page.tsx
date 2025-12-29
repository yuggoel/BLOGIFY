'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, User, formatDate } from '@/lib/api';
import { ProfilePicture } from '@/components';
import { useUser } from '@/context/UserContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(userStr);
    
    // Fetch fresh user data
    getUser(userData.id)
      .then((freshUser) => {
        updateUser(freshUser);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load profile');
      })
      .finally(() => setLoading(false));
  }, [router, updateUser]);

  const handleUserUpdate = (updatedUser: User) => {
    updateUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Cover Banner */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
          
          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="relative -mt-16 mb-6">
              <ProfilePicture user={user} onUpdate={handleUserUpdate} size="xl" />
            </div>

            {/* Info */}
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{user.name}</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{user.email}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-200 dark:border-slate-700 pt-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Member Since
                </h3>
                <p className="text-slate-900 dark:text-white font-medium">
                  {formatDate(user.created_at)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Account ID
                </h3>
                <p className="text-slate-900 dark:text-white font-medium font-mono text-sm">
                  {user.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
