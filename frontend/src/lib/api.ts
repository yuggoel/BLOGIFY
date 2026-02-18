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
  const ext = file.name.split('.').pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('images').upload(path, file);
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('images').getPublicUrl(path);
  return data.publicUrl;
}

// ── Users ──────────────────────────────────────────────────────────────────────
export async function signup(data: UserCreate): Promise<User> {
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: { data: { name: data.name } },
  });
  if (error) throw new Error(error.message);
  if (!authData.user) throw new Error('Signup failed');

  // The DB trigger handles inserting the profile row.
  // Return a minimal user object from auth data directly —
  // no DB call needed here (avoids permission errors before session is active).
  return {
    id: authData.user.id,
    name: data.name,
    email: data.email,
    created_at: authData.user.created_at,
  };
}

export async function login(data: UserLogin): Promise<LoginResponse> {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });
  if (error) throw new Error(error.message);

  // Fetch profile — now the user is authenticated so RLS passes.
  // Fall back to auth data if the profile row isn't ready yet.
  const { data: profile } = await supabase
    .from('users')
    .select('id, name, email')
    .eq('id', authData.user.id)
    .single();

  return {
    id: authData.user.id,
    name: profile?.name ?? data.email.split('@')[0],
    email: authData.user.email!,
  };
}

export async function getUser(id: string): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error('User not found');
  return mapUser(data);
}

export async function updateUser(id: string, data: UserUpdate): Promise<User> {
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

