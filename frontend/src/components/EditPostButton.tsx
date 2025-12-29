'use client';

import { useUser } from '@/context/UserContext';
import Link from 'next/link';

interface EditPostButtonProps {
  postId: string;
  authorId: string;
  className?: string;
}

export default function EditPostButton({ postId, authorId, className = '' }: EditPostButtonProps) {
  const { user } = useUser();

  // Only show button if user is logged in and is the author
  if (!user || user.id !== authorId) return null;

  return (
    <Link
      href={`/posts/${postId}/edit`}
      className={`p-2 text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 ${className}`}
      title="Edit Post"
      aria-label="Edit Post"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    </Link>
  );
}
