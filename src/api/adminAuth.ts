import { API_BASE_URL } from './client';

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  access_token: string;
  token_type: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_superuser: boolean;
  is_active: boolean;
  created_at: string;
}

export async function adminLogin(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Admin login failed: ${response.status} ${response.statusText} - ${text}`);
  }

  const payload = await response.json();
  const normalized = payload?.data ?? payload;
  const accessToken = normalized?.access_token ?? normalized?.token;
  const tokenType = normalized?.token_type ?? 'bearer';

  if (!accessToken) {
    throw new Error('Admin login response did not include access_token.');
  }

  return {
    access_token: accessToken,
    token_type: tokenType,
  };
}


export async function getCurrentAdmin(authHeader: string): Promise<AdminUser> {
  const response = await fetch(`${API_BASE_URL}/admin/auth/me`, {
    headers: {
      Authorization: authHeader,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get admin: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
