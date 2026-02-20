import { API_BASE_URL, USE_MOCK_API, setAuthToken } from "./client";
import type { LoginRequest, LoginResponse, NormalizedLoginResponse } from "../types/auth";

/**
 * Login
 * - Backend error clearly shows it expects a JSON object body (dictionary),
 *   NOT x-www-form-urlencoded.
 */
export async function login(credentials: LoginRequest): Promise<NormalizedLoginResponse> {
  // 1) Mock mode (no network call)
  if (USE_MOCK_API) {
    return {
      success: true,
      data: {
        token: "mock-jwt-token-12345",
        user: {
          id: "user-1",
          username: "admin",
          name: "Admin User",
          type: "user",
        },
      },
    };
  }



  // Use JSON body as expected by backend
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
    }),
  });

  // 3) Try to read JSON even when failing, so we can show meaningful error messages
  const raw = await response.text();
  let parsed: any = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    // If backend returned non-JSON text, keep parsed as null
  }

  if (!response.ok) {
    const fastApiDetail =
      parsed?.detail?.[0]?.msg ||
      (typeof parsed?.detail === "string" ? parsed.detail : null);

    const msg =
      fastApiDetail ||
      parsed?.message ||
      `Login failed: ${response.status} ${response.statusText}`;

    throw new Error(msg);
  }

 
  if (!parsed?.access_token) {
    throw new Error("Login failed: Invalid response");
  }

  // Transform to expected format
  const normalizedResponse: NormalizedLoginResponse = {
    success: true,
    data: {
      token: parsed.access_token,
      user: {
        id: "1", // You can extract from JWT if needed
        username: credentials.username,
        name: credentials.username,
        type: "user",
      },
    },
  };

  return normalizedResponse;
}

// Keep your alias so LoginPage can call saveAuthToken(token)
export { setAuthToken as saveAuthToken };
