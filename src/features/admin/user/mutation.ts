import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  assignCategoryToAdminUser,
  assignRolesToAdminUser,
  createAdminUser,
  generateAdminUserOtp,
  type CreateAdminUserRequest,
} from '../../../api/adminUsers';

export function useCreateAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateAdminUserRequest) => createAdminUser(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}

export function useAssignRolesToAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, roleIds }: { userId: number | string; roleIds: Array<number | string> }) =>
      assignRolesToAdminUser(userId, roleIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}

export function useAssignCategoryToAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, categoryId }: { userId: number | string; categoryId: string }) =>
      assignCategoryToAdminUser(userId, categoryId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}

export function useGenerateAdminUserOtp() {
  return useMutation({
    mutationFn: (userId: number | string) => generateAdminUserOtp(userId),
  });
}
