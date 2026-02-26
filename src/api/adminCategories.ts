import { API_BASE_URL } from './client';
import { getAdminAuthHeader } from '../utils/adminSession';

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parent_id?: string | null;
  icon_url?: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
  service_count?: number;
  children?: AdminCategory[];
}

export interface AdminCategoryListResponse {
  data: AdminCategory[];
  total: number;
  page: number;
  page_size: number;
}

export interface AdminCategoryCreateRequest {
  name: string;
  slug: string;
  description?: string | null;
  parent_id?: string | null;
  icon_url?: string | null;
  display_order: number;
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

function extractCategories(payload: unknown): AdminCategory[] {
  if (Array.isArray(payload)) return payload as AdminCategory[];

  if (!payload || typeof payload !== 'object') return [];
  const p = payload as Record<string, unknown>;
  const data = p.data;

  if (Array.isArray(data)) return data as AdminCategory[];

  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    if (Array.isArray(d.categories)) return d.categories as AdminCategory[];
    if (Array.isArray(d.items)) return d.items as AdminCategory[];
    if (Array.isArray(d.results)) return d.results as AdminCategory[];
  }

  if (Array.isArray(p.categories)) return p.categories as AdminCategory[];
  if (Array.isArray(p.items)) return p.items as AdminCategory[];
  if (Array.isArray(p.results)) return p.results as AdminCategory[];

  return [];
}

function unwrapCategory(payload: unknown): AdminCategory {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: AdminCategory }).data;
  }
  return payload as AdminCategory;
}

export async function getAdminCategories(): Promise<AdminCategoryListResponse> {
  const payload = await sessionFetch('/admin/categories');
  const categories = extractCategories(payload);

  const p = (payload ?? {}) as Record<string, any>;
  return {
    data: categories,
    total: p?.meta?.total_count ?? p?.total ?? categories.length,
    page: p?.meta?.pagination?.page ?? p?.page ?? 1,
    page_size: p?.meta?.pagination?.limit ?? p?.page_size ?? categories.length,
  };
}

export async function getAdminCategory(id: string): Promise<AdminCategory> {
  const payload = await sessionFetch(`/admin/categories/${id}`);
  return unwrapCategory(payload);
}

export async function createAdminCategory(data: AdminCategoryCreateRequest): Promise<AdminCategory> {
  const payload = await sessionFetch('/admin/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return unwrapCategory(payload);
}

export async function updateAdminCategory(
  id: string,
  data: Partial<AdminCategoryCreateRequest>
): Promise<AdminCategory> {
  const payload = await sessionFetch(`/admin/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return unwrapCategory(payload);
}

export async function deleteAdminCategory(id: string): Promise<void> {
  await sessionFetch(`/admin/categories/${id}`, { method: 'DELETE' });
}
