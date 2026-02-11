'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUser, User, formatDate, API_BASE_URL, type Post } from '@/lib/api';
import { ProfilePicture, PostCard, PostCardSkeleton } from '@/components';
import { useUser } from '@/context/UserContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, logout } = useUser();

  // If not authenticated, show login/signup prompt
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">B</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome to Blogify</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">Please log in or sign up to view your profile.</p>
          <div className="flex gap-4 justify-center">
            <a href="/login" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition">Login</a>
            <a href="/signup" className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition">Sign Up</a>
          </div>
        </div>
      </div>
    );
  }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

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

    // Fetch user's posts
    fetch(`${API_BASE_URL}/posts/`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((allPosts: Post[]) => {
        const userPosts = allPosts.filter((post) => post.user_id === userData.id);
        setPosts(userPosts);
      })
      .catch(console.error)
      .finally(() => setPostsLoading(false));
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
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-slate-200 dark:border-slate-700 pt-6">
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
                  Total Posts
                </h3>
                <p className="text-slate-900 dark:text-white font-medium">
                  {posts.length}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Account ID
                </h3>
                <p className="text-slate-900 dark:text-white font-medium font-mono text-sm truncate">
                  {user.id}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* My Posts Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Posts</h2>
            <Link
              href="/posts/new"
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition text-sm"
            >
              + New Post
            </Link>
          </div>

          {postsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                No posts yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Start sharing your thoughts with the community!
              </p>
              <Link
                href="/posts/new"
                className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition"
              >
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} authorName={user.name} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
