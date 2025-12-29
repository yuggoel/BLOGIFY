'use client';

import { useState, useRef, useEffect } from 'react';
import { User, uploadImage, updateUser, getImageUrl } from '@/lib/api';

interface ProfilePictureProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function ProfilePicture({ user, onUpdate, size = 'xl' }: ProfilePictureProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setIsMenuOpen(false);

    try {
      // 1. Upload Image
      const imageUrl = await uploadImage(file);

      // 2. Update User
      const updatedUser = await updateUser(user.id, {
        profile_picture_url: imageUrl,
      });

      onUpdate(updatedUser);
    } catch (error) {
      console.error('Failed to update profile picture:', error);
      alert('Failed to update profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm('Are you sure you want to remove your profile picture?')) return;

    setUploading(true);
    setIsMenuOpen(false);

    try {
      const updatedUser = await updateUser(user.id, {
        profile_picture_url: null, // Set to null to remove
      });

      onUpdate(updatedUser);
    } catch (error) {
      console.error('Failed to remove profile picture:', error);
      alert('Failed to remove profile picture');
    } finally {
      setUploading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-base',
    lg: 'w-24 h-24 text-2xl',
    xl: 'w-32 h-32 text-4xl',
  };

  const imageUrl = getImageUrl(user.profile_picture_url);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <div
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`
          ${sizeClasses[size]} 
          rounded-full 
          cursor-pointer 
          relative 
          overflow-hidden 
          border-4 border-white dark:border-slate-800 
          shadow-lg 
          transition-transform hover:scale-105
          bg-white dark:bg-slate-700
        `}
      >
        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
          </div>
        ) : null}

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        
        {/* Hover Overlay Hint */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
            <span className="text-white opacity-0 hover:opacity-100 text-xs font-medium">Edit</span>
        </div>
      </div>

      {/* Context Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden py-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-2"
          >
            <span>📷</span> Change Picture
          </button>
          
          {user.profile_picture_url && (
            <button
              onClick={handleRemove}
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-2"
            >
              <span>🗑️</span> Remove Picture
            </button>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
