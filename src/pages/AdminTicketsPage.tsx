import { useMemo, useState } from 'react';
import { AdminLayout } from '../layouts/AdminLayout';
import { useActiveTicket, useUnclaimedTickets } from '../features/admin/tickets/queries';
import { useClaimTicket, useCloseTicket, useSendTicketMessage } from '../features/admin/tickets/mutations';

export function AdminTicketsPage() {
  const [telegramId, setTelegramId] = useState('');
  const [isAgent, setIsAgent] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  const unclaimedQuery = useUnclaimedTickets();
  const activeTicketQuery = useActiveTicket(telegramId, isAgent, searchTriggered);

  const claimMutation = useClaimTicket();
  const closeMutation = useCloseTicket();
  const sendMessageMutation = useSendTicketMessage();

  const unclaimedTickets = unclaimedQuery.data ?? [];

  const selectedTicket = useMemo(() => {
    if (activeTicketQuery.data) return activeTicketQuery.data;
    if (!selectedTicketId) return null;
    return unclaimedTickets.find((t) => String(t.id) === selectedTicketId) ?? null;
  }, [activeTicketQuery.data, selectedTicketId, unclaimedTickets]);

  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Tickets' },
  ];

  const handleClaim = (ticketId: number | string) => {
    claimMutation.mutate(ticketId, {
      onSuccess: () => alert('Ticket claimed successfully'),
      onError: (err) => alert(`Claim failed: ${(err as Error).message}`),
    });
  };

  const handleClose = () => {
    if (!selectedTicket) return;
    closeMutation.mutate(selectedTicket.id, {
      onSuccess: () => alert('Ticket closed successfully'),
      onError: (err) => alert(`Close failed: ${(err as Error).message}`),
    });
  };

  const handleSendMessage = () => {
    if (!selectedTicket) return;
    if (!messageText.trim()) return;

    sendMessageMutation.mutate(
      {
        ticketId: selectedTicket.id,
        body: {
          sender_type: 'agent',
          message_text: messageText.trim(),
        },
      },
      {
        onSuccess: () => {
          setMessageText('');
          alert('Message sent');
        },
        onError: (err) => alert(`Send failed: ${(err as Error).message}`),
      }
    );
  };

  return (
    <AdminLayout title="Ticket Management" breadcrumbs={breadcrumbs}>
      <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Unclaimed Tickets</h2>
            </div>

            {unclaimedQuery.isLoading ? (
              <div className="p-6 text-slate-600">Loading tickets...</div>
            ) : unclaimedQuery.error ? (
              <div className="p-6 text-red-600">
                Failed to load tickets: {(unclaimedQuery.error as Error).message}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Ticket</th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Created</th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {unclaimedTickets.map((t) => (
                      <tr
                        key={String(t.id)}
                        className="hover:bg-slate-50 cursor-pointer"
                        onClick={() => setSelectedTicketId(String(t.id))}
                      >
                        <td className="px-6 py-4 text-sm text-slate-800 font-medium">#{t.id}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{t.status || 'unclaimed'}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{t.created_at || '-'}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClaim(t.id);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-blue-800"
                          >
                            Claim
                          </button>
                        </td>
                      </tr>
                    ))}
                    {unclaimedTickets.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-6 text-sm text-slate-500">
                          No unclaimed tickets.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900">Active Ticket Lookup</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Telegram ID"
                value={telegramId}
                onChange={(e) => {
                  setTelegramId(e.target.value);
                  setSearchTriggered(false);
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={isAgent}
                  onChange={(e) => setIsAgent(e.target.checked)}
                />
                Is agent
              </label>
              <button
                onClick={() => setSearchTriggered(true)}
                className="w-full px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-blue-800"
              >
                Find Active Ticket
              </button>
            </div>

            {activeTicketQuery.isFetching && <p className="text-sm text-slate-600">Loading active ticket...</p>}
            {activeTicketQuery.error && (
              <p className="text-sm text-red-600">Active ticket error: {(activeTicketQuery.error as Error).message}</p>
            )}

            {selectedTicket ? (
              <div className="space-y-3 border-t border-slate-200 pt-4">
                <p className="text-sm"><span className="font-semibold">Ticket:</span> #{selectedTicket.id}</p>
                <p className="text-sm"><span className="font-semibold">Status:</span> {selectedTicket.status || '-'}</p>
                <p className="text-sm"><span className="font-semibold">User TG:</span> {String(selectedTicket.user_telegram_id ?? '-')}</p>
                <p className="text-sm"><span className="font-semibold">Agent TG:</span> {String(selectedTicket.agent_telegram_id ?? '-')}</p>

                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Write message..."
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm min-h-[90px]"
                />

                <div className="flex gap-2">
                  <button
                    onClick={handleSendMessage}
                    disabled={sendMessageMutation.isPending}
                    className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60"
                  >
                    Send Message
                  </button>
                  <button
                    onClick={handleClose}
                    disabled={closeMutation.isPending}
                    className="flex-1 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
                  >
                    Close Ticket
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Select a ticket or search an active ticket.</p>
            )}
          </section>
        </div>
      </main>
    </AdminLayout>
  );
}
