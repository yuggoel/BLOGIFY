'use client';

import { useUser } from '@/context/UserContext';
import { deletePost } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DeletePostButtonProps {
  postId: string;
  authorId: string;
  className?: string;
  onDelete?: () => void;
}

export default function DeletePostButton({ postId, authorId, className = '', onDelete }: DeletePostButtonProps) {
  const { user } = useUser();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // Only show button if user is logged in and is the author
  if (!user || user.id !== authorId) return null;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;

    setIsDeleting(true);
    try {
      await deletePost(postId);
      if (onDelete) {
        onDelete();
      } else {
        router.refresh();
        // If we are on the post detail page, we might want to redirect to feed
        if (window.location.pathname.includes(`/posts/${postId}`)) {
            router.push('/feed');
        }
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`p-2 text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 ${className}`}
      title="Delete Post"
      aria-label="Delete Post"
    >
      {isDeleting ? (
        <span className="block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
      )}
    </button>
  );
}
