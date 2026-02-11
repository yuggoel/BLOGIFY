// API configuration and helper functions
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Types matching your FastAPI models
export interface User {
  id: string;
  name: string;
  email: string;
  profile_picture_url?: string;
  created_at: string;
}

export interface UserUpdate {
  name?: string;
  email?: string;
  profile_picture_url?: string | null;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  tags: string[];
  image_url?: string;
  created_at: string;
  updated_at: string | null;
}

export interface PostCreate {
  title: string;
  content: string;
  user_id: string;
  tags?: string[];
  image_url?: string;
}

export interface PostUpdate {
  title?: string;
  content?: string;
  tags?: string[];
  image_url?: string;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
}

// API Functions

// Posts
export async function getPosts(skip = 0, limit = 20): Promise<Post[]> {
  const url = `${API_BASE_URL}/posts/?skip=${skip}&limit=${limit}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText || '');
      throw new Error(`${res.status} ${res.statusText} ${text}`.trim());
    }
    const data = await res.json();
    try {
      // cache posts locally for offline fallback
      localStorage.setItem('posts_cache', JSON.stringify(data));
    } catch {}
    return data;
  } catch (err: any) {
    // try to return cached posts if available
    try {
      const cached = localStorage.getItem('posts_cache');
      if (cached) return JSON.parse(cached) as Post[];
    } catch {}
    throw new Error(err?.message || 'Failed to fetch posts');
  }
}

export async function getPost(id: string): Promise<Post> {
  const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Post not found');
  return res.json();
}

export async function createPost(data: PostCreate): Promise<Post> {
  const res = await fetch(`${API_BASE_URL}/posts/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
}

export async function updatePost(id: string, data: PostUpdate): Promise<Post> {
  const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update post');
  return res.json();
}

export async function deletePost(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete post');
}

export async function getPostCount(): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/posts/count`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch post count');
  return res.json();
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/posts/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Failed to upload image');
  const data = await res.json();
  return data.url;
}

// Users
export async function signup(data: UserCreate): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Signup failed');
  }
  return res.json();
}

export async function login(data: UserLogin): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Login failed');
  }
  return res.json();
}

export async function getUser(id: string): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('User not found');
  return res.json();
}

export async function updateUser(id: string, data: UserUpdate): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete user');
}

export async function getUserCount(): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/users/count`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch user count');
  return res.json();
}

// Utility function to format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();
}

// Calculate read time
export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} MIN READ`;
}

export function getImageUrl(path: string | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
}
