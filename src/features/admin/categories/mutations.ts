import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAdminCategory, updateAdminCategory, deleteAdminCategory } from '../../../api/adminCategories';

export function useCreateAdminCategory() {
  const token = localStorage.getItem('admin_token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => createAdminCategory(token!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });
}

export function useUpdateAdminCategory() {
  const token = localStorage.getItem('admin_token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      updateAdminCategory(token!, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });
}

export function useDeleteAdminCategory() {
  const token = localStorage.getItem('admin_token');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminCategory(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });
}