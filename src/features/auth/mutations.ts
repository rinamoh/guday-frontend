import { useMutation } from '@tanstack/react-query';
import { login } from '../../api/auth'; // Fix: Import 'login' not 'loginUser'
import { setAuthToken } from '../../api/client';

export function useLogin() {
  return useMutation({
    mutationFn: login, // Fix: Use 'login' function
    onSuccess: (data) => {
      if (data.success && data.data.token) {
        setAuthToken(data.data.token);
        // Handle navigation/login state here
      }
    },
  });
}