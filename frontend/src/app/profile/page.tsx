'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPosts, formatDate, type Post, type User } from '@/lib/api';
import { ProfilePicture, PostCard, PostCardSkeleton, RequireAuth } from '@/components';
import { useUser } from '@/context/UserContext';

function ProfileContent() {
  const { user, updateUser, logout } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // RequireAuth guarantees user is non-null here, but we add a guard for TS
  if (!user) return null;

  // Fetch this user's posts
  useEffect(() => {
    if (!user) return;
    setPostsLoading(true);
    getPosts(0, 1000, user.id)
      .then(setPosts)
      .catch(console.error)
      .finally(() => setPostsLoading(false));
  }, [user]);

  const handleUserUpdate = (updatedUser: User) => {
    updateUser(updatedUser);
  };

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

export default function ProfilePage() {
  return <RequireAuth><ProfileContent /></RequireAuth>;
}
