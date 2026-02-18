import { supabase } from './supabase';

// ── FastAPI base URL ───────────────────────────────────────────────────────────
// Set NEXT_PUBLIC_API_URL in .env.local for local dev and in Vercel for production.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

/**
 * Attaches the current Supabase JWT as a Bearer token.
 * All FastAPI data routes require this header.
 */
async function authHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Not authenticated');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
  };
}

/**
 * Wrapper around fetch that throws on non-2xx responses.
 */
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, options);
  if (res.status === 204) return undefined as T;
  const json = await res.json();
  if (!res.ok) throw new Error(json.detail ?? json.error ?? 'Request failed');
  return json as T;
}

// ── Types ──────────────────────────────────────────────────────────────────────
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

// ── Mappers ────────────────────────────────────────────────────────────────────
function mapUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    profile_picture_url: row.profile_picture ?? undefined,
    created_at: row.created_at,
  };
}

function mapPost(row: any): Post {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    user_id: row.user_id,
    tags: row.tags ?? [],
    image_url: row.image_url ?? undefined,
    created_at: row.created_at,
    updated_at: row.updated_at ?? null,
  };
}

// ── Posts ──────────────────────────────────────────────────────────────────────
export async function getPosts(skip = 0, limit = 20, userId?: string): Promise<Post[]> {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  if (userId) params.set('user_id', userId);
  const rows = await apiFetch<Post[]>(`/posts?${params}`);
  return rows.map(mapPost);
}

export async function getPost(id: string): Promise<Post> {
  const row = await apiFetch<Post>(`/posts/${id}`);
  return mapPost(row);
}

export async function createPost(data: PostCreate): Promise<Post> {
  const headers = await authHeaders();
  const row = await apiFetch<Post>('/posts', {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  return mapPost(row);
}

export async function updatePost(id: string, data: PostUpdate): Promise<Post> {
  const headers = await authHeaders();
  const row = await apiFetch<Post>(`/posts/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
  return mapPost(row);
}

export async function deletePost(id: string): Promise<void> {
  const headers = await authHeaders();
  await apiFetch<void>(`/posts/${id}`, { method: 'DELETE', headers });
}

export async function getPostCount(): Promise<number> {
  const data = await apiFetch<{ count: number }>('/posts/count');
  return data.count;
}

export async function uploadImage(file: File): Promise<string> {
  // Ensure session is active (storage RLS requires auth.uid())
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) throw new Error('You must be logged in to upload images');

  const ext = file.name.split('.').pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('images').upload(path, file);
  if (error) throw new Error(`Image upload failed: ${error.message}`);
  const { data } = supabase.storage.from('images').getPublicUrl(path);
  return data.publicUrl;
}

// ── Users ──────────────────────────────────────────────────────────────────────
export async function signup(data: UserCreate): Promise<User> {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    if (res.status === 429) throw new Error('Too many signup attempts. Please wait a minute.');
    throw new Error(json.error ?? 'Signup failed');
  }
  return json as User;
}

export async function login(data: UserLogin): Promise<LoginResponse> {
  // Call Supabase directly so createBrowserClient writes the session cookie
  // automatically — without this, middleware can't read the session and
  // redirects back to /login after navigation.
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });
  if (error || !authData.user) {
    throw new Error('Invalid email or password');
  }
  return {
    id: authData.user.id,
    name: authData.user.user_metadata?.name ?? '',
    email: authData.user.email ?? data.email,
  };
}

export async function getUser(id: string): Promise<User> {
  const row = await apiFetch<User>(`/users/${id}`);
  return mapUser(row);
}

export async function updateUser(id: string, data: UserUpdate): Promise<User> {
  const headers = await authHeaders();
  const payload: Record<string, unknown> = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.email !== undefined) payload.email = data.email;
  if (data.profile_picture_url !== undefined) payload.profile_picture_url = data.profile_picture_url;

  const row = await apiFetch<User>(`/users/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  });
  return mapUser(row);
}

export async function deleteUser(id: string): Promise<void> {
  const headers = await authHeaders();
  await apiFetch<void>(`/users/${id}`, { method: 'DELETE', headers });
}

export async function getUserCount(): Promise<number> {
  const data = await apiFetch<{ count: number }>('/users/count');
  return data.count;
}

// ── Utilities ──────────────────────────────────────────────────────────────────
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();
}

export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} MIN READ`;
}

export function getImageUrl(path: string | undefined): string | null {
  if (!path) return null;
  return path; // Supabase Storage URLs are always absolute
}

