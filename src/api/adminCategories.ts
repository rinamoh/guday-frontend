import { apiGet, apiPost, apiPut, apiDelete, API_BASE_URL} from './client';

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  icon_url?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
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
  description?: string;
  parent_id?: string;
  icon_url?: string;
  display_order: number;
}

export async function getAdminCategories(token: string): Promise<AdminCategoryListResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/categories`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get categories: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getAdminCategory(token: string, id: string): Promise<AdminCategory> {
  const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get category: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function createAdminCategory(token: string, data: AdminCategoryCreateRequest): Promise<AdminCategory> {
  const response = await fetch(`${API_BASE_URL}/admin/categories`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create category: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function updateAdminCategory(token: string, id: string, data: Partial<AdminCategoryCreateRequest>): Promise<AdminCategory> {
  const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update category: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function deleteAdminCategory(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete category: ${response.status} ${response.statusText}`);
  }
}