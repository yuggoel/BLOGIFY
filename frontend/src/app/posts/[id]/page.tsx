/* eslint-disable @next/next/no-img-element */

export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
    if (!res.ok) {
      console.error('Posts fetch returned non-OK status', res.status);
      return [];
    }
    const posts = await res.json();
    return posts.map((post: any) => ({ id: String(post.id) }));
  } catch (err) {
    console.error('Failed to fetch posts for generateStaticParams', err);
    // Return empty list to avoid failing the whole build
    return [];
  }
}
}
import { getPost, getUser, formatDate, calculateReadTime, getImageUrl, type Post, type User } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DeletePostButton, EditPostButton } from '@/components';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkUnwrapImages from 'remark-unwrap-images';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  
  let post: Post;
  let author: User | null = null;

  try {
    post = await getPost(id);
    if (post.user_id) {
      try {
        author = await getUser(post.user_id);
      } catch {
        author = null;
      }
    }
  } catch {
    notFound();
  }

  const formattedDate = formatDate(post.created_at);
  const readTime = calculateReadTime(post.content);
  const imageUrl = getImageUrl(post.image_url);

  return (
    <div className="container mx-auto px-4 py-12 max-w-[720px]">
      <article>
        {/* Back Link */}
        <Link
          href="/feed"
          className="inline-flex items-center text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-8 transition text-sm font-medium"
        >
          ← Back to Feed
        </Link>

        {/* Header */}
        <header className="mb-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag: string, index: number) => (
              <Link
                key={`${tag}-${index}`}
                href={`/tags/${tag.toLowerCase()}`}
                className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold uppercase tracking-wide hover:underline"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Meta & Actions */}
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-8 mb-8">
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-base">
              {author && (
                <span className="font-medium text-slate-900 dark:text-white">
                  {author.name}
                </span>
              )}
              <span>•</span>
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{readTime}</span>
            </div>
            
            <div className="flex gap-2">
              <EditPostButton postId={post.id} authorId={post.user_id} />
              <DeletePostButton postId={post.id} authorId={post.user_id} />
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {imageUrl && (
          <div className="w-full mb-12 rounded-lg overflow-hidden shadow-sm">
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
          prose-p:text-[18px] prose-p:leading-[1.8] prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:mb-6
          prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-lg prose-img:shadow-md prose-img:my-8 prose-img:w-full
          prose-code:text-indigo-600 dark:prose-code:text-indigo-400 prose-code:bg-indigo-50 dark:prose-code:bg-indigo-900/20 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-slate-900 prose-pre:text-slate-50
        ">
          <ReactMarkdown
            remarkPlugins={[remarkMath, remarkUnwrapImages]}
            rehypePlugins={[rehypeKatex]}
            components={{
              img: (props) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
                const { node, src, alt, title, ...rest } = props as any;
                const imageUrl = getImageUrl(src);
                
                if (!imageUrl) return null;

                return (
                  <div className="my-10">
                    <img 
                      src={imageUrl} 
                      alt={alt || ''} 
                      className="w-full rounded-lg shadow-sm" 
                      {...rest} 
                    />
                    {title && (
                      <p className="text-center text-sm text-slate-500 mt-2 italic">
                        {title}
                      </p>
                    )}
                  </div>
                );
              }
            }}
          >
            {post.content || ''}
          </ReactMarkdown>
        </div>

        {/* Footer / Author Bio */}
        {author && (
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center overflow-hidden">
                 {author.profile_picture_url ? (
                    <img src={getImageUrl(author.profile_picture_url) || ''} alt={author.name} className="w-full h-full object-cover" />
                 ) : (
                    <span className="text-xl font-bold text-slate-500 dark:text-slate-400">
                      {author.name.charAt(0).toUpperCase()}
                    </span>
                 )}
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">
                  Written by
                </p>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {author.name}
                </h3>
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
