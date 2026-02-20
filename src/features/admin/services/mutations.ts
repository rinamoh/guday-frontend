import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createAdminService,
  updateAdminService,
  deleteAdminService,
  publishAdminService,
  archiveAdminService,
  createAdminServiceStep,
  updateAdminServiceStep,
  deleteAdminServiceStep,
  bulkImportAdminServices,
  type CreateServiceRequest,
  type CreateStepRequest,
  type BulkImportRequest,
} from '../../../api/adminServices';

export function useCreateAdminService() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('admin_token');

  return useMutation({
    mutationFn: (serviceData: CreateServiceRequest) => createAdminService(token!, serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    },
  });
}

export function useUpdateAdminService() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('admin_token');

  return useMutation({
    mutationFn: ({ serviceId, serviceData }: { serviceId: string; serviceData: Partial<CreateServiceRequest> }) =>
      updateAdminService(token!, serviceId, serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    },
  });
}

export function useDeleteAdminService() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('admin_token');

  return useMutation({
    mutationFn: (serviceId: string) => deleteAdminService(token!, serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    },
  });
}

export function usePublishAdminService() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('admin_token');

  return useMutation({
    mutationFn: (serviceId: string) => publishAdminService(token!, serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    },
  });
}

export function useArchiveAdminService() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('admin_token');

  return useMutation({
    mutationFn: (serviceId: string) => archiveAdminService(token!, serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    },
  });
}

// Steps mutations
export function useCreateAdminServiceStep() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('admin_token');

  return useMutation({
    mutationFn: ({ serviceId, stepData }: { serviceId: string; stepData: CreateStepRequest }) =>
      createAdminServiceStep(token!, serviceId, stepData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-service-steps'] });
    },
  });
}

export function useUpdateAdminServiceStep() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('admin_token');

  return useMutation({
    mutationFn: ({ serviceId, stepId, stepData }: { serviceId: string; stepId: string; stepData: Partial<CreateStepRequest> }) =>
      updateAdminServiceStep(token!, serviceId, stepId, stepData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-service-steps'] });
    },
  });
}

export function useDeleteAdminServiceStep() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('admin_token');

  return useMutation({
    mutationFn: ({ serviceId, stepId }: { serviceId: string; stepId: string }) =>
      deleteAdminServiceStep(token!, serviceId, stepId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-service-steps'] });
    },
  });
}

// Bulk import mutation
export function useBulkImportAdminServices() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('admin_token');

  return useMutation({
    mutationFn: (importData: BulkImportRequest) => bulkImportAdminServices(token!, importData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    },
  });
}