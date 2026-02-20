import type { ApiResponse } from "./api";

export interface LoginRequest {
  username: string; // ✅ Changed from email to username
  password: string;
  // Removed userType - not used by API
}

// Update to match actual API response format
export interface LoginResponse {
  access_token: string;
  token_type: string;
}

// Keep the old format for internal use (for backward compatibility with existing code)
export interface NormalizedLoginResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      username: string;
      name: string;
      type: 'user' | 'agent';
    };
  };
}