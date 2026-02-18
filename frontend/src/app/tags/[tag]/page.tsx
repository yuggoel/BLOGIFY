'use client';

import { useEffect, useState, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPosts, getUser, type Post } from '@/lib/api';
import { PostCard, PostCardSkeleton } from '@/components';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export default function TagPage({ params }: TagPageProps) {
  const { tag } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const decodedTag = decodeURIComponent(tag);

  useEffect(() => {
    const fetchPostsByTag = async () => {
      setLoading(true);
      try {
        // Fetch all posts and filter by tag on client side
        const allPosts: Post[] = await getPosts(0, 1000);
        const filteredPosts = allPosts.filter((post) =>
          post.tags.some((t) => t.toLowerCase() === decodedTag.toLowerCase())
        );
        
        setPosts(filteredPosts);

        // Fetch author names
        const uniqueUserIds = [...new Set(filteredPosts.map((p) => p.user_id))];
        const authorMap: Record<string, string> = {};
        
        await Promise.all(
          uniqueUserIds.map(async (userId) => {
            try {
              const userData = await getUser(userId);
              authorMap[userId] = userData.name;
            } catch {
              authorMap[userId] = "Unknown";
            }
          })
        );
        
        setAuthors(authorMap);
      } catch (err) {
        console.error(err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPostsByTag();
  }, [decodedTag]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Link */}
      <Link
        href="/feed"
        className="inline-flex items-center text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-6 transition text-sm font-medium"
      >
        ← Back to Feed
      </Link>

      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M5.5 3A2.5 2.5 0 003 5.5v2.879a2.5 2.5 0 00.732 1.767l6.5 6.5a2.5 2.5 0 003.536 0l2.878-2.878a2.5 2.5 0 000-3.536l-6.5-6.5A2.5 2.5 0 008.38 3H5.5zM6 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          Tag
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 capitalize">
          #{decodedTag}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {loading ? 'Loading...' : `${posts.length} post${posts.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && posts.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="text-6xl mb-4">🏷️</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No posts with this tag
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            There are no posts tagged with &quot;{decodedTag}&quot; yet.
          </p>
          <Link
            href="/feed"
            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition"
          >
            Browse All Posts
          </Link>
        </div>
      )}

      {/* Posts Grid */}
      {!loading && posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} authorName={authors[post.user_id]} />
          ))}
        </div>
      )}
    </div>
  );
}
