import { useMutation } from '@tanstack/react-query';
import { adminLogin, getCurrentAdmin } from '../../../api/adminAuth';
import { clearAdminSession, getAdminAuthHeader, saveAdminSession } from '../../../utils/adminSession';

export function useAdminLogin() {
  return useMutation({
    mutationFn: adminLogin,
    onSuccess: (data) => {
      saveAdminSession(data.access_token, data.token_type);
    },
    onError: () => {
      clearAdminSession();
    },
  });
}

export function useGetCurrentAdmin() {
  return useMutation({
    mutationFn: async () => {
      const authHeader = getAdminAuthHeader();
      if (!authHeader) throw new Error('Admin session missing. Please log in again.');
      return getCurrentAdmin(authHeader);
    },
  });
}
