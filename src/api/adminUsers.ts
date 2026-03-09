import { API_BASE_URL } from './client';
import { getAdminAuthHeader } from '../utils/adminSession';

export interface AdminUserRecord {
  id: number | string;
  username: string;
  email: string;
  is_active?: boolean;
  full_name?: string;
  category_id?: string | null;
  roles?: Array<{ id?: number | string; name?: string }> | string[];
}

export interface CreateAdminUserRequest {
  username: string;
  email: string;
  password: string;
  is_active?: boolean;
}

function getAuthHeaderOrThrow(): string {
  const authHeader = getAdminAuthHeader();
  if (!authHeader) {
    throw new Error('Admin session token missing. Please log in as admin.');
  }
  return authHeader;
}

function parseErr(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') return fallback;
  const p = payload as Record<string, unknown>;

  if (typeof p.detail === 'string') return p.detail;
  if (Array.isArray(p.detail) && p.detail.length > 0) {
    const first = p.detail[0] as Record<string, unknown>;
    if (typeof first?.msg === 'string') return first.msg;
  }
  if (typeof p.error === 'string') return p.error;
  if (typeof p.message === 'string') return p.message;

  return fallback;
}

async function sessionFetch(endpoint: string, init?: RequestInit): Promise<unknown> {
  const authHeader = getAuthHeaderOrThrow();

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...init,
    headers: {
      Authorization: authHeader,
      ...(init?.headers || {}),
    },
  });

  const raw = await res.text();
  let payload: unknown = null;
  try {
    payload = raw ? JSON.parse(raw) : null;
  } catch {
    payload = null;
  }

  if (!res.ok) {
    throw new Error(parseErr(payload, `Request failed: ${res.status} ${res.statusText}`));
  }

  return payload;
}

function extractUsers(payload: unknown): AdminUserRecord[] {
  if (Array.isArray(payload)) return payload as AdminUserRecord[];
  if (!payload || typeof payload !== 'object') return [];

  const p = payload as Record<string, unknown>;
  const data = p.data;

  if (Array.isArray(data)) return data as AdminUserRecord[];

  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    if (Array.isArray(d.users)) return d.users as AdminUserRecord[];
    if (Array.isArray(d.items)) return d.items as AdminUserRecord[];
    if (Array.isArray(d.results)) return d.results as AdminUserRecord[];
  }

  if (Array.isArray(p.users)) return p.users as AdminUserRecord[];
  if (Array.isArray(p.items)) return p.items as AdminUserRecord[];
  if (Array.isArray(p.results)) return p.results as AdminUserRecord[];

  return [];
}

function unwrapSingleUser(payload: unknown): AdminUserRecord {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: AdminUserRecord }).data;
  }
  return payload as AdminUserRecord;
}

export async function listAdminUsers(): Promise<AdminUserRecord[]> {
  const payload = await sessionFetch('/users/');
  return extractUsers(payload);
}

export async function createAdminUser(body: CreateAdminUserRequest): Promise<AdminUserRecord> {
  const payload = await sessionFetch('/users/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return unwrapSingleUser(payload);
}

export async function assignRolesToAdminUser(userId: number | string, roleIds: Array<number | string>): Promise<unknown> {
  return sessionFetch(`/users/${userId}/roles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role_ids: roleIds }),
  });
}

export async function assignCategoryToAdminUser(userId: number | string, categoryId: string): Promise<unknown> {
  return sessionFetch(`/users/${userId}/category`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category_id: categoryId }),
  });
}

export async function listUsersByCategory(categoryId: string): Promise<AdminUserRecord[]> {
  const payload = await sessionFetch(`/users/category/${categoryId}`);
  return extractUsers(payload);
}

export async function generateAdminUserOtp(userId: number | string): Promise<unknown> {
  return sessionFetch(`/users/${userId}/otp`, { method: 'POST' });
}
