import { supabase } from './supabase';

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
  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(skip, skip + limit - 1);

  if (userId) query = query.eq('user_id', userId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapPost);
}

export async function getPost(id: string): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error('Post not found');
  return mapPost(data);
}

export async function createPost(data: PostCreate): Promise<Post> {
  // Ensure we have an active session before attempting insert (RLS requires auth.uid())
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) throw new Error('You must be logged in to create a post');

  const { data: row, error } = await supabase
    .from('posts')
    .insert({
      title: data.title,
      content: data.content,
      user_id: data.user_id,
      tags: data.tags ?? [],
      image_url: data.image_url ?? null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapPost(row);
}

export async function updatePost(id: string, data: PostUpdate): Promise<Post> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) throw new Error('You must be logged in to update a post');

  const { data: row, error } = await supabase
    .from('posts')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapPost(row);
}

export async function deletePost(id: string): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) throw new Error('You must be logged in to delete a post');

  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function getPostCount(): Promise<number> {
  const { count, error } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true });
  if (error) throw new Error(error.message);
  return count ?? 0;
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
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) throw new Error('User not found');
  return mapUser(data);
}

export async function updateUser(id: string, data: UserUpdate): Promise<User> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) throw new Error('You must be logged in to update your profile');

  const update: Record<string, any> = { updated_at: new Date().toISOString() };
  if (data.name !== undefined) update.name = data.name;
  if (data.email !== undefined) update.email = data.email;
  if (data.profile_picture_url !== undefined) update.profile_picture = data.profile_picture_url;

  const { data: row, error } = await supabase
    .from('users')
    .update(update)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapUser(row);
}

export async function deleteUser(id: string): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) throw new Error('You must be logged in to delete your account');

  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function getUserCount(): Promise<number> {
  const { count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });
  if (error) throw new Error(error.message);
  return count ?? 0;
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

