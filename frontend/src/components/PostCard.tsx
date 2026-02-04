import Link from 'next/link';
import { Post, formatDate, calculateReadTime } from '@/lib/api';
import DeletePostButton from './DeletePostButton';
import EditPostButton from './EditPostButton';

interface PostCardProps {
  post: Post;
  featured?: boolean;
  authorName?: string;
}

// Strip markdown syntax for plain text preview
function stripMarkdown(text: string): string {
  return text
    // Remove images ![alt](url)
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Remove links [text](url) but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove bold **text** or __text__
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    // Remove italic *text* or _text_
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove code blocks ```code```
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code `code`
    .replace(/`([^`]+)`/g, '$1')
    // Remove headers # ## ###
    .replace(/^#{1,6}\s+/gm, '')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

export default function PostCard({ post, featured = false, authorName }: PostCardProps) {
  const readTime = calculateReadTime(post.content);
  const formattedDate = formatDate(post.created_at);
  const excerpt = stripMarkdown(post.content);

  if (featured) {
    return (
      <div className="relative group block">
        <Link href={`/posts/${post.id}`}>
          <article className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-8 min-h-[300px] flex flex-col justify-between hover:shadow-xl transition-shadow">
            {/* Content */}
            <div className="relative z-10">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:underline decoration-2 underline-offset-4">
                {post.title}
              </h2>

              <p className="text-indigo-100 mb-6 line-clamp-3 text-lg">
                {excerpt}
              </p>
            </div>

            {/* Meta */}
            <div className="relative z-10 flex items-center gap-4 text-sm text-indigo-100 font-medium border-t border-white/20 pt-4">
              {authorName && (
                <>
                  <span className="text-white font-semibold">{authorName}</span>
                  <span>•</span>
                </>
              )}
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{readTime}</span>
            </div>
          </article>
        </Link>
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <EditPostButton postId={post.id} authorId={post.user_id} className="text-white/70 hover:text-white hover:bg-white/20" />
          <DeletePostButton postId={post.id} authorId={post.user_id} className="text-white/70 hover:text-white hover:bg-white/20" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative group block h-full">
      <Link href={`/posts/${post.id}`} className="h-full block">
        <article className="flex flex-col h-full p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-md">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4 pr-16">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 flex-grow">
            {excerpt}
          </p>

          <div className="mt-auto">
            {/* Footer Line */}
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-500 border-t border-slate-100 dark:border-slate-700 pt-4">
              {authorName && (
                <>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{authorName}</span>
                  <span>•</span>
                </>
              )}
              <time dateTime={post.created_at}>{formattedDate}</time>
              <span>•</span>
              <span>{readTime}</span>
            </div>
          </div>
        </article>
      </Link>
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <EditPostButton postId={post.id} authorId={post.user_id} />
        <DeletePostButton postId={post.id} authorId={post.user_id} />
      </div>
    </div>
  );
}
