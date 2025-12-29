'use client';

import { useEffect, useState } from 'react';
import { getPostCount, getUserCount } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function Sidebar() {
  const [postCount, setPostCount] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Fetch stats
    getPostCount().then(setPostCount).catch(console.error);
    getUserCount().then(setUserCount).catch(console.error);
  }, []);

  const handleCreatePost = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      router.push('/posts/new');
    } else {
      router.push('/login');
    }
  };

  return (
    <aside className="space-y-8">
      {/* About Widget */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Blogify</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Blog Platform</p>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Everyone needs a little space where they can learn, practice, and produce
          something. Blogify is a community that gives the students a chance to do all of
          that.
        </p>
      </div>

      {/* Stats Widget */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white">
        <h3 className="font-bold mb-4">Community Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white/10 rounded-lg">
            <p className="text-2xl font-bold">{postCount !== null ? postCount : '...'}</p>
            <p className="text-xs text-slate-300">Posts</p>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-lg">
            <p className="text-2xl font-bold">{userCount !== null ? userCount : '...'}</p>
            <p className="text-xs text-slate-300">Writers</p>
          </div>
        </div>
      </div>

      {/* CTA Widget */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2">Start Writing Today</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Share your knowledge and ideas with the community.
        </p>
        <button
          onClick={handleCreatePost}
          className="block w-full text-center px-4 py-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold rounded-lg hover:opacity-90 transition"
        >
          Create Post
        </button>
      </div>
    </aside>
  );
}
