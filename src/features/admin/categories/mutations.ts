import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  linkAdminCategoryTranslation,
  type AdminCategoryCreateRequest,
} from '../../../api/adminCategories';

export function useCreateAdminCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminCategoryCreateRequest) => createAdminCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });
}

export function useUpdateAdminCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminCategoryCreateRequest> }) =>
      updateAdminCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-category'] });
    },
  });
}

export function useDeleteAdminCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });
}

export function useLinkAdminCategoryTranslation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ enCategoryId, targetId }: { enCategoryId: string; targetId: string }) =>
      linkAdminCategoryTranslation(enCategoryId, targetId),
    onSuccess: () => {
      // Safe to invalidate broadly; linking can affect how categories resolve across languages.
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-category'] });
    },
  });
}
