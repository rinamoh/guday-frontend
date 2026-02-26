import { useMutation, useQueryClient } from '@tanstack/react-query';
import { claimTicket, closeTicket, sendTicketMessage, type SendTicketMessageRequest } from '../../../api/adminTickets';

export function useClaimTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ticketId: number | string) => claimTicket(ticketId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-unclaimed-tickets'] });
    },
  });
}

export function useCloseTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ticketId: number | string) => closeTicket(ticketId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-unclaimed-tickets'] });
      qc.invalidateQueries({ queryKey: ['admin-active-ticket'] });
    },
  });
}

export function useSendTicketMessage() {
  return useMutation({
    mutationFn: ({ ticketId, body }: { ticketId: number | string; body: SendTicketMessageRequest }) =>
      sendTicketMessage(ticketId, body),
  });
}
