import { API_BASE_URL } from './client';
import { getAdminAuthHeader } from '../utils/adminSession';

export interface AdminTicket {
  id: number | string;
  status?: string;
  user_telegram_id?: string | number;
  agent_telegram_id?: string | number;
  category_id?: string;
  created_at?: string;
  updated_at?: string;
  last_message?: string;
}

export interface SendTicketMessageRequest {
  sender_type: 'user' | 'agent' | 'system';
  message_text: string;
}

function getAuthHeaderOrThrow(): string {
  const authHeader = getAdminAuthHeader();
  if (!authHeader) throw new Error('Admin session token missing. Please log in as admin.');
  return authHeader;
}

function parseErr(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') return fallback;
  const p = payload as Record<string, unknown>;

  if (typeof p.detail === 'string') return p.detail;
  if (Array.isArray(p.detail) && p.detail[0] && typeof (p.detail[0] as any).msg === 'string') {
    return (p.detail[0] as any).msg;
  }
  if (typeof p.message === 'string') return p.message;
  if (typeof p.error === 'string') return p.error;

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

function extractTickets(payload: unknown): AdminTicket[] {
  if (Array.isArray(payload)) return payload as AdminTicket[];
  if (!payload || typeof payload !== 'object') return [];

  const p = payload as Record<string, unknown>;
  const data = p.data;

  if (Array.isArray(data)) return data as AdminTicket[];

  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    if (Array.isArray(d.tickets)) return d.tickets as AdminTicket[];
    if (Array.isArray(d.items)) return d.items as AdminTicket[];
    if (Array.isArray(d.results)) return d.results as AdminTicket[];
  }

  if (Array.isArray(p.tickets)) return p.tickets as AdminTicket[];
  if (Array.isArray(p.items)) return p.items as AdminTicket[];
  if (Array.isArray(p.results)) return p.results as AdminTicket[];

  return [];
}

function extractSingleTicket(payload: unknown): AdminTicket | null {
  if (!payload) return null;
  if (Array.isArray(payload)) return (payload[0] as AdminTicket) ?? null;
  if (typeof payload !== 'object') return null;

  const p = payload as Record<string, unknown>;
  if (p.data && typeof p.data === 'object') return p.data as AdminTicket;
  return p as AdminTicket;
}

export async function listUnclaimedTickets(): Promise<AdminTicket[]> {
  const payload = await sessionFetch('/tickets/unclaimed');
  return extractTickets(payload);
}

export async function claimTicket(ticketId: number | string): Promise<unknown> {
  return sessionFetch(`/tickets/${ticketId}/claim`, { method: 'POST' });
}

export async function closeTicket(ticketId: number | string): Promise<unknown> {
  return sessionFetch(`/tickets/${ticketId}/close`, { method: 'POST' });
}

export async function sendTicketMessage(
  ticketId: number | string,
  body: SendTicketMessageRequest
): Promise<unknown> {
  return sessionFetch(`/tickets/${ticketId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function getActiveTicket(
  telegramId: string,
  isAgent: boolean
): Promise<AdminTicket | null> {
  const payload = await sessionFetch(
    `/tickets/active/${encodeURIComponent(telegramId)}?is_agent=${String(isAgent)}`
  );
  return extractSingleTicket(payload);
}
