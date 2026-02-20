import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  assignCategoryToAdminAgent,
  createAdminAgent,
  deactivateAdminAgent,
  generateAdminAgentOtp,
  updateAdminAgent,
  type CreateAgentRequest,
  type UpdateAgentRequest,
} from '../../../api/adminAgents';

export function useCreateAdminAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateAgentRequest) => createAdminAgent(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-agents'] }),
  });
}

export function useUpdateAdminAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ agentId, body }: { agentId: number | string; body: UpdateAgentRequest }) =>
      updateAdminAgent(agentId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-agents'] }),
  });
}

export function useDeactivateAdminAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (agentId: number | string) => deactivateAdminAgent(agentId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-agents'] }),
  });
}

export function useGenerateAdminAgentOtp() {
  return useMutation({
    mutationFn: (agentId: number | string) => generateAdminAgentOtp(agentId),
  });
}

export function useAssignCategoryToAdminAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ agentId, categoryId }: { agentId: number | string; categoryId: string }) =>
      assignCategoryToAdminAgent(agentId, categoryId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-agents'] }),
  });
}
