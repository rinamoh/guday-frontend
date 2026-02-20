import { API_BASE_URL } from './client';
import { getAdminAuthHeader } from '../utils/adminSession';

export interface AdminAgent {
  id: number | string;
  username: string;
  email: string;
  is_active?: boolean;
  category_id?: string | null;
  avatar_url?: string | null;
}

export interface CreateAgentRequest {
  username: string;
  email: string;
  password: string;
  category_id?: string;
}

export interface UpdateAgentRequest {
  username?: string;
  email?: string;
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

async function sessionFetch(endpoint: string, init?: RequestInit) {
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

function extractAgents(payload: unknown): AdminAgent[] {
  if (Array.isArray(payload)) return payload as AdminAgent[];

  if (!payload || typeof payload !== 'object') return [];

  const p = payload as Record<string, unknown>;
  const data = p.data as unknown;

  if (Array.isArray(data)) return data as AdminAgent[];

  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    if (Array.isArray(d.agents)) return d.agents as AdminAgent[];
    if (Array.isArray(d.items)) return d.items as AdminAgent[];
    if (Array.isArray(d.results)) return d.results as AdminAgent[];
  }

  if (Array.isArray(p.agents)) return p.agents as AdminAgent[];
  if (Array.isArray(p.items)) return p.items as AdminAgent[];
  if (Array.isArray(p.results)) return p.results as AdminAgent[];

  return [];
}

export async function listAdminAgents(params?: { category_id?: string; is_active?: boolean }): Promise<AdminAgent[]> {
  const q = new URLSearchParams();
  if (params?.category_id) q.set('category_id', params.category_id);
  if (typeof params?.is_active === 'boolean') q.set('is_active', String(params.is_active));

  const payload = await sessionFetch(`/admin/agents${q.toString() ? `?${q.toString()}` : ''}`);
  return extractAgents(payload);
}

export async function createAdminAgent(body: CreateAgentRequest): Promise<AdminAgent> {
  const payload = await sessionFetch('/admin/agents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: AdminAgent }).data;
  }
  return payload as AdminAgent;
}

export async function updateAdminAgent(agentId: number | string, body: UpdateAgentRequest): Promise<AdminAgent> {
  const payload = await sessionFetch(`/admin/agents/${agentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: AdminAgent }).data;
  }
  return payload as AdminAgent;
}

export async function deactivateAdminAgent(agentId: number | string): Promise<void> {
  await sessionFetch(`/admin/agents/${agentId}`, { method: 'DELETE' });
}

export async function generateAdminAgentOtp(agentId: number | string): Promise<unknown> {
  return sessionFetch(`/admin/agents/${agentId}/otp`, { method: 'POST' });
}

export async function assignCategoryToAdminAgent(agentId: number | string, categoryId: string): Promise<unknown> {
  return sessionFetch(`/admin/agents/${agentId}/category`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category_id: categoryId }),
  });
}
