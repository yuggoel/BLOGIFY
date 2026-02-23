// ── FastAPI base URL ───────────────────────────────────────────────────────────
// Set NEXT_PUBLIC_API_URL in .env.local for local dev and in Vercel for production.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

// ── Token storage ──────────────────────────────────────────────────────────────
const TOKEN_KEY = 'blogify_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
}

/**
 * Decode the JWT payload client-side (no verification — server verifies).
 * Clears the token and returns null if it is expired or malformed.
 */
export function getTokenPayload(): { sub: string; email: string } | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (Date.now() >= payload.exp * 1000) {
      clearToken();
      return null;
    }
    return payload;
  } catch {
    clearToken();
    return null;
  }
}

/**
 * Returns headers with Bearer token. Throws if no token is stored.
 */
async function authHeaders(): Promise<HeadersInit> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
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
  if (!res.ok) {
    const detail = json.detail ?? json.error ?? 'Request failed';
    // FastAPI validation errors return detail as an array of objects
    const message = Array.isArray(detail)
      ? detail.map((e: any) => e.msg ?? JSON.stringify(e)).join('; ')
      : typeof detail === 'object'
        ? JSON.stringify(detail)
        : String(detail);
    throw new Error(message);
  }
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

interface TokenResponse {
  access_token: string;
  user_id: string;
  name: string;
  email: string;
}

// ── Mappers ────────────────────────────────────────────────────────────────────
function mapUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    profile_picture_url: row.profile_picture_url ?? undefined,
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

// ── Auth ───────────────────────────────────────────────────────────────────────
export async function signup(data: UserCreate): Promise<User> {
  const res = await apiFetch<TokenResponse>('/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
  });
  setToken(res.access_token);
  // Fetch the full profile so we have created_at and all fields
  return await getUser(res.user_id);
}

export async function login(data: UserLogin): Promise<User> {
  const res = await apiFetch<TokenResponse>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: data.email, password: data.password }),
  });
  setToken(res.access_token);
  return await getUser(res.user_id);
}

// ── Posts ──────────────────────────────────────────────────────────────────────
export async function getPosts(skip = 0, limit = 20, userId?: string, tag?: string): Promise<Post[]> {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  if (userId) params.set('user_id', userId);
  if (tag) params.set('tag', tag);
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

// ── Upload (MongoDB GridFS) ────────────────────────────────────────────────────
export async function uploadImage(file: File): Promise<string> {
  const token = getToken();
  if (!token) throw new Error('You must be logged in to upload images');

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.detail ?? 'Image upload failed');
  return json.url as string;
}

// ── Users ──────────────────────────────────────────────────────────────────────
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
  // Already an absolute URL (GridFS URLs are always stored as absolute)
  if (path.startsWith('http')) return path;
  // Fallback for relative paths written by older code
  return `${API_URL}${path}`;
}
