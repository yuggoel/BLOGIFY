"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getPosts, getPostCount, getUser, type Post, type User } from "@/lib/api";
import { PostCard, Sidebar, Pagination, PostCardSkeleton } from "@/components";
import { useUser } from "@/context/UserContext";

const POSTS_PER_PAGE = 6;

export default function FeedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Record<string, string>>({});
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const skip = (currentPage - 1) * POSTS_PER_PAGE;
        const [postsData, countData] = await Promise.all([
          getPosts(skip, POSTS_PER_PAGE),
          getPostCount(),
        ]);
        setPosts(postsData);
        setTotalPosts(countData);

        // Fetch author names for all posts
        const uniqueUserIds = [...new Set(postsData.map((p) => p.user_id))];
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
        setError("Failed to load feed");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleCreatePost = () => {
    if (user) {
      router.push("/posts/new");
    } else {
      router.push("/login");
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  // Separate featured post (first post) from other posts
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Feed</h1>
          <button
            onClick={handleCreatePost}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition md:hidden"
          >
            + New Post
          </button>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Discover the latest stories from our community
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {loading ? (
            <>
              {/* Featured Post Skeleton */}
              <section className="mb-8">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                  Featured Post
                </p>
                <div className="h-[300px] bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
              </section>
              {/* More Posts Skeleton */}
              <section>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                  More Posts
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <PostCardSkeleton key={i} />
                  ))}
                </div>
              </section>
            </>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                No posts yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Be the first to share your story with the community!
              </p>
              <button
                onClick={handleCreatePost}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition"
              >
                Create Your First Post
              </button>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && currentPage === 1 && (
                <section className="mb-8">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                    Featured Post
                  </p>
                  <PostCard post={featuredPost} featured authorName={authors[featuredPost.user_id]} />
                </section>
              )}

              {/* More Posts */}
              <section>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                  {currentPage === 1 ? "More Posts" : "All Posts"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(currentPage === 1 ? otherPosts : posts).map((post) => (
                    <PostCard key={post.id} post={post} authorName={authors[post.user_id]} />
                  ))}
                </div>
              </section>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath="/feed"
                />
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
