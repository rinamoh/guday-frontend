import { API_BASE_URL } from './client';
import { getAdminAuthHeader } from '../utils/adminSession';
//const API_BASE_URL = "http://localhost:8000/api/v1";

// Types (add to admin types file)
export interface AdminService {
  id: string;
  procedure_id: string;
  slug: string;
  title: string;
  overview: string;
  short_description?: string;
  language: string;
  category_id: string;
  sub_category_id?: string;
  target_audience: string;
  estimated_duration: string;
  processing_time: string;
  is_online_available: boolean;
  requires_appointment: boolean;
  fees?: string;
  keywords?: string[];
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface AdminServiceListResponse {
  data: AdminService[];
  total: number;
  page: number;
  page_size: number;
}

export interface CreateServiceRequest {
  procedure_id: string;
  slug: string;
  title: string;
  overview: string;
  short_description?: string;
  language?: string;
  category_id: string;
  sub_category_id?: string;
  target_audience: string;
  estimated_duration: string;
  processing_time: string;
  is_online_available: boolean;
  requires_appointment: boolean;
  fees?: string;
  keywords?: string[];
  status?: 'draft' | 'published';
}

export interface AdminServiceStep {
  id: string;
  service_id: string;
  step_number: number;
  step_type: string;
  title?: string;
  instruction: string;
  detailed_instructions?: string;
  estimated_duration?: string;
  is_online_available: boolean;
  requires_physical_presence: boolean;
  created_at: string;
}

export interface CreateStepRequest {
  step_number: number;
  step_type: string;
  title?: string;
  instruction: string;
  detailed_instructions?: string;
  estimated_duration?: string;
  is_online_available: boolean;
  requires_physical_presence: boolean;
}

export interface BulkImportRequest {
  items: CreateServiceRequest[];
}



export async function createAdminService(token: string, serviceData: CreateServiceRequest): Promise<AdminService> {
  const response = await fetch(`${API_BASE_URL}/admin/services`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(serviceData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create service: ${response.status} ${response.statusText}`);
  }

  return response.json();
}




// ...types unchanged

export async function getAdminServices(params?: {
  page?: number;
  page_size?: number;
  status?: string;
  category_id?: string;
  search?: string;
}): Promise<AdminServiceListResponse> {
  const authHeader = getAdminAuthHeader();
  if (!authHeader) {
    throw new Error('Admin session token missing. Please log in as admin.');
  }

  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.page_size) searchParams.append('page_size', params.page_size.toString());
  if (params?.status) searchParams.append('status', params.status);
  if (params?.category_id) searchParams.append('category_id', params.category_id);
  if (params?.search) searchParams.append('search', params.search);

  const url = `/admin/services${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: { Authorization: authHeader },
  });

  if (!response.ok) {
    throw new Error(`Failed to get services: ${response.status} ${response.statusText}`);
  }

  const apiResponse = await response.json();
  const list = apiResponse?.data ?? [];

  return {
    data: list,
    total: apiResponse?.meta?.total_count || list.length,
    page: apiResponse?.meta?.pagination?.page || 1,
    page_size: apiResponse?.meta?.pagination?.limit || list.length,
  };
}


export async function getAdminService(
  token: string | null,
  serviceId: string,
  serviceSlug?: string
): Promise<any> {
  if (token) {
    const adminResponse = await fetch(`${API_BASE_URL}/admin/services/${serviceId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (adminResponse.ok) {
      const payload = await adminResponse.json();
      return payload?.data ?? payload;
    }

    if (![401, 403, 404, 405].includes(adminResponse.status)) {
      throw new Error(`Failed to get service: ${adminResponse.status} ${adminResponse.statusText}`);
    }
  }

  if (!serviceSlug) {
    throw new Error('Failed to get service: missing slug for fallback endpoint');
  }

  const publicResponse = await fetch(`${API_BASE_URL}/services/${serviceSlug}`);
  if (!publicResponse.ok) {
    throw new Error(`Failed to get service: ${publicResponse.status} ${publicResponse.statusText}`);
  }

  const payload = await publicResponse.json();
  return payload?.data ?? payload;
}

export async function getAdminServiceSteps(
  token: string | null,
  serviceId: string,
  serviceSlug?: string
): Promise<AdminServiceStep[]> {
  if (token) {
    const adminResponse = await fetch(`${API_BASE_URL}/admin/services/${serviceId}/steps`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (adminResponse.ok) {
      const payload = await adminResponse.json();
      const unwrapped = payload?.data ?? payload;
      if (Array.isArray(unwrapped)) return unwrapped;
      if (Array.isArray(unwrapped?.steps)) return unwrapped.steps;
      return [];
    }

    if (![401, 403, 404, 405].includes(adminResponse.status)) {
      throw new Error(`Failed to get service steps: ${adminResponse.status} ${adminResponse.statusText}`);
    }
  }

  if (!serviceSlug) return [];

  const publicResponse = await fetch(`${API_BASE_URL}/services/${serviceSlug}/steps`);
  if (!publicResponse.ok) return [];

  const payload = await publicResponse.json();
  const unwrapped = payload?.data ?? payload;
  if (Array.isArray(unwrapped)) return unwrapped;
  if (Array.isArray(unwrapped?.steps)) return unwrapped.steps;
  return [];
}






export async function updateAdminService(token: string, serviceId: string, serviceData: Partial<CreateServiceRequest>): Promise<AdminService> {
  const response = await fetch(`${API_BASE_URL}/admin/services/${serviceId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(serviceData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update service: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function deleteAdminService(token: string, serviceId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/services/${serviceId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete service: ${response.status} ${response.statusText}`);
  }
}

export async function publishAdminService(token: string, serviceId: string): Promise<AdminService> {
  const response = await fetch(`${API_BASE_URL}/admin/services/${serviceId}/publish`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to publish service: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function archiveAdminService(token: string, serviceId: string): Promise<AdminService> {
  const response = await fetch(`${API_BASE_URL}/admin/services/${serviceId}/archive`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to archive service: ${response.status} ${response.statusText}`);
  }

  return response.json();
}


export async function createAdminServiceStep(token: string, serviceId: string, stepData: CreateStepRequest): Promise<AdminServiceStep> {
  const response = await fetch(`${API_BASE_URL}/admin/services/${serviceId}/steps`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stepData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create step: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function updateAdminServiceStep(token: string, serviceId: string, stepId: string, stepData: Partial<CreateStepRequest>): Promise<AdminServiceStep> {
  const response = await fetch(`${API_BASE_URL}/admin/services/${serviceId}/steps/${stepId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stepData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update step: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function deleteAdminServiceStep(token: string, serviceId: string, stepId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/services/${serviceId}/steps/${stepId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete step: ${response.status} ${response.statusText}`);
  }
}

// Bulk import
export async function bulkImportAdminServices(token: string, importData: BulkImportRequest): Promise<{ imported: number; failed: number; errors?: string[] }> {
  const response = await fetch(`${API_BASE_URL}/admin/services/import/bulk`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(importData),
  });

  if (!response.ok) {
    throw new Error(`Failed to import services: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
