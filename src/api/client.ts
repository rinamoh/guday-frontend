// Set to false when your real API is live
export const USE_MOCK_API = false;

export const API_BASE_URL = "https://guday.taliyap2p.com/api/v1"; // From the collection variables


// Mock responses — only used when USE_MOCK_API is true
async function getMockResponse<T>(endpoint: string): Promise<T> {
  const { mockServicesList, getMockServiceBySlug,mockCategoriesList } = await import("./mockData");

  if (endpoint.startsWith("/services?") || endpoint === "/services") {
  return { data: mockServicesList } as T; 
}
    if (endpoint === "/categories") {
    // ✅ Return categories
    return { data: mockCategoriesList } as T;
  }

    const stepsMatch = endpoint.match(/^\/services\/([^\/]+)\/steps$/);
  if (stepsMatch) {
    const slug = stepsMatch[1];
    const detail = getMockServiceBySlug(slug);
    if (detail) {
      return { data: detail.steps } as T; // Return steps array
    }
    throw new Error("Service not found");
  }

  // ✅ Add documents endpoint: /services/{slug}/documents
  const docsMatch = endpoint.match(/^\/services\/([^\/]+)\/documents$/);
  if (docsMatch) {
    const slug = docsMatch[1];
    const detail = getMockServiceBySlug(slug);
    if (detail) {
      // Extract all document requirements from all steps
      const allDocuments = detail.steps.flatMap(step => step.documentRequirements);
      return { data: allDocuments } as T;
    }
    throw new Error("Service not found");
  }

  // ✅ Add FAQs endpoint: /services/{slug}/faqs
  const faqsMatch = endpoint.match(/^\/services\/([^\/]+)\/faqs$/);
  if (faqsMatch) {
    const slug = faqsMatch[1];
    const detail = getMockServiceBySlug(slug);
    if (detail) {
      return { data: detail.faqs } as T; // Return FAQs array
    }
    throw new Error("Service not found");
  }

  const slugMatch = endpoint.match(/^\/services\/(.+)$/);
  if (slugMatch) {
    const slug = slugMatch[1];
    const detail = getMockServiceBySlug(slug);
    if (detail) {
      return { data: detail } as T;
    }
    throw new Error("Service not found");
  }

  // ✅ Add login mock response
  if (endpoint === "/login") {
    return {
      success: true,
      data: {
        token: "mock-jwt-token-12345",
        user: {
          id: "user-1",
          username: "admin",
          name: "Admin User",
          type: "user"
        }
      }
    } as any;
  }

  throw new Error(`Unknown mock endpoint: ${endpoint}`);
}


// For auth headers later

let authToken: string | null = null;

export function setAuthToken(token: string) {
  authToken = token;
}

export function clearAuthToken() {
  authToken = null;
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
   if (USE_MOCK_API) {
    return getMockResponse<T>(endpoint);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return json;
}

export async function apiPost<T>(endpoint: string, data: any): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return json;
}

export async function apiPut<T>(endpoint: string, data: any): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return json;
}

export async function apiDelete<T = void>(endpoint: string): Promise<T> {
  const headers: Record<string, string> = {};
  
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  // DELETE might not return JSON, so handle it gracefully
  try {
    return await response.json();
  } catch {
    return {} as T; // Return empty object for successful deletes
  }
}