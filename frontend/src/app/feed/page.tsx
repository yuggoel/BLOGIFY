import { getPosts, getPostCount, Post } from '@/lib/api';
import { PostCard, Sidebar, Pagination } from '@/components';

interface FeedPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const postsPerPage = 6;
  const skip = (currentPage - 1) * postsPerPage;

  let posts: Post[] = [];
  let totalPosts = 0;
  let error = null;

  try {
    const [postsData, countData] = await Promise.all([
      getPosts(skip, postsPerPage),
      getPostCount()
    ]);
    posts = postsData;
    totalPosts = countData;
  } catch (e) {
    error = 'Failed to load posts. Make sure the backend is running.';
    console.error(e);
  }

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Latest Posts</h1>
        <p className="text-slate-600 dark:text-slate-400">Explore the latest thoughts and stories from our community.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-8">
          <p className="font-medium">⚠️ {error}</p>
          <p className="text-sm mt-1">
            Run <code className="bg-red-100 dark:bg-red-900/40 px-1 rounded">uvicorn APP.main:app --reload</code> in the BACKEND folder.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Featured Post */}
          {featuredPost && (
            <section className="mb-8">
              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                Featured Post
              </h2>
              <PostCard post={featuredPost} featured />
            </section>
          )}

          {/* More Posts */}
          <section>
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
              More Issues
            </h2>
            
            {remainingPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {remainingPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : posts.length === 0 && !error ? (
              <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400 mb-4">No posts yet. Be the first to write!</p>
                <a
                  href="/posts/new"
                  className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Create Post
                </a>
              </div>
            ) : null}
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/feed"
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
