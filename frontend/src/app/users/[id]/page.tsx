'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { getUser, formatDate, getImageUrl, API_BASE_URL, type User, type Post } from '@/lib/api';
import { PostCard, PostCardSkeleton } from '@/components';
import { notFound } from 'next/navigation';

interface UserProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = use(params);
  
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      setLoading(true);
      try {
        // Fetch user
        const userData = await getUser(id);
        setUser(userData);
        
        // Fetch user's posts
        const res = await fetch(`${API_BASE_URL}/posts/`, {
          cache: 'no-store',
        });
        
        if (res.ok) {
          const allPosts: Post[] = await res.json();
          const userPosts = allPosts.filter((post) => post.user_id === id);
          setPosts(userPosts);
        }
      } catch (err) {
        console.error(err);
        setError('User not found');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            User Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            The user you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/feed"
            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition"
          >
            Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back Link */}
      <Link
        href="/feed"
        className="inline-flex items-center text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-6 transition text-sm font-medium"
      >
        ← Back to Feed
      </Link>

      {/* User Profile Card */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Cover Banner */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
          
          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="relative -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden bg-white dark:bg-slate-700">
                {user.profile_picture_url ? (
                  <img
                    src={getImageUrl(user.profile_picture_url) || ''}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-600">
                    <span className="text-white text-4xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
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
      </div>

      {/* User's Posts */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Posts by {user.name}
        </h2>

        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-slate-600 dark:text-slate-400">
              This user hasn&apos;t published any posts yet.
            </p>
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
  );
}
