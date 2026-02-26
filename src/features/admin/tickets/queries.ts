import { useQuery } from '@tanstack/react-query';
import { getActiveTicket, listUnclaimedTickets } from '../../../api/adminTickets';
import { hasAdminSession } from '../../../utils/adminSession';

export function useUnclaimedTickets() {
  return useQuery({
    queryKey: ['admin-unclaimed-tickets'],
    queryFn: () => listUnclaimedTickets(),
    enabled: hasAdminSession(),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useActiveTicket(telegramId: string, isAgent: boolean, enabled: boolean) {
  return useQuery({
    queryKey: ['admin-active-ticket', telegramId, isAgent],
    queryFn: () => getActiveTicket(telegramId, isAgent),
    enabled: hasAdminSession() && enabled && !!telegramId.trim(),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
