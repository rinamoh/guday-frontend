const ADMIN_TOKEN_KEY = 'admin_token';
const ADMIN_TOKEN_TYPE_KEY = 'admin_token_type';

function normalizeToken(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let token = raw.trim();

  if (!token) return null;

  if (
    (token.startsWith('"') && token.endsWith('"')) ||
    (token.startsWith("'") && token.endsWith("'"))
  ) {
    token = token.slice(1, -1).trim();
  }

  token = token.replace(/^Bearer\s+/i, '').trim();

  if (!token || token === 'undefined' || token === 'null') return null;
  return token;
}

function normalizeTokenType(raw: string | null | undefined): string {
  const clean = (raw || 'Bearer').trim().toLowerCase();
  if (!clean) return 'Bearer';
  return clean === 'bearer' ? 'Bearer' : clean;
}

export function saveAdminSession(accessToken: string, tokenType?: string): void {
  const token = normalizeToken(accessToken);
  if (!token) {
    throw new Error('Invalid admin token received from login response.');
  }

  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_TOKEN_TYPE_KEY, normalizeTokenType(tokenType));
}

export function clearAdminSession(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_TOKEN_TYPE_KEY);
}

export function getAdminAuthHeader(): string | null {
  const token = normalizeToken(localStorage.getItem(ADMIN_TOKEN_KEY));
  if (!token) return null;

  const type = normalizeTokenType(localStorage.getItem(ADMIN_TOKEN_TYPE_KEY));
  return `${type} ${token}`;
}

export function hasAdminSession(): boolean {
  return !!normalizeToken(localStorage.getItem(ADMIN_TOKEN_KEY));
}
