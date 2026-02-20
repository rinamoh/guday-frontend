import { AdminLayout } from '../layouts/AdminLayout';
import { SearchAndFilters } from '../components/admin/SearchAndFilters';
import { UsersTable } from '../components/admin/UsersTable';
import { UsersPageHeaderActions } from '../components/admin/UsersPageHeaderActions';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAgents } from '../features/admin/agent/queries';
import { useDeactivateAdminAgent, useGenerateAdminAgentOtp } from '../features/admin/agent/mutation';

interface UiAgent {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  employeeId: string;
  avatar?: string;
}

const ITEMS_PER_PAGE = 10;

export function AdminUsersPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  const agentsQuery = useAdminAgents({
    is_active: statusFilter === 'All' ? undefined : statusFilter === 'Active',
  });

  const otpMutation = useGenerateAdminAgentOtp();
  const deactivateMutation = useDeactivateAdminAgent();

  const allAgents: UiAgent[] = useMemo(() => {
    const raw = agentsQuery.data ?? [];
    return raw.map((a) => ({
      id: String(a.id),
      name: a.username || `Agent ${a.id}`,
      email: a.email || '-',
      role: 'Agent',
      status: a.is_active === false ? 'Inactive' : 'Active',
      employeeId: `AGT-${a.id}`,
      avatar: a.avatar_url || undefined,
    }));
  }, [agentsQuery.data]);

  const filteredAgents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allAgents.filter((a) => {
      const matchQ =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.employeeId.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || a.status === statusFilter;
      return matchQ && matchStatus;
    });
  }, [allAgents, searchQuery, statusFilter]);

  const totalResults = filteredAgents.length;
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(1, totalPages || 1));

  const pagedAgents = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredAgents.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAgents, safePage]);

  const handleAddAgent = () => navigate('/admin/users/new');

  const handleGenerateOtp = (id: string) => {
    otpMutation.mutate(id, {
      onSuccess: () => alert('OTP generated successfully'),
      onError: (err) => alert(`Failed to generate OTP: ${(err as Error).message}`),
    });
  };

  const handleDeactivate = (id: string) => {
    if (!window.confirm('Deactivate this agent?')) return;
    deactivateMutation.mutate(id, {
      onSuccess: () => alert('Agent deactivated successfully'),
      onError: (err) => alert(`Failed to deactivate agent: ${(err as Error).message}`),
    });
  };

  const handleExport = () => {
    const rows = [
      ['ID', 'Name', 'Email', 'Role', 'Status'],
      ...filteredAgents.map((u) => [u.id, u.name, u.email, u.role, u.status]),
    ];
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agents.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Agent Management' },
  ];

  return (
    <AdminLayout
      title="Agent Management"
      breadcrumbs={breadcrumbs}
      actions={<UsersPageHeaderActions onAddUser={handleAddAgent} />}
    >
      <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto space-y-6">
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={(v) => {
              setSearchQuery(v);
              setCurrentPage(1);
            }}
            statusFilter={statusFilter}
            onStatusChange={(v) => {
              setStatusFilter(v);
              setCurrentPage(1);
            }}
            onExport={handleExport}
          />

          {agentsQuery.isLoading ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-slate-600">Loading agents...</div>
          ) : agentsQuery.error ? (
            <div className="bg-white rounded-xl border border-red-200 p-8 text-red-600">
              Failed to load agents: {(agentsQuery.error as Error).message}
            </div>
          ) : (
            <UsersTable
              users={pagedAgents}
              currentPage={safePage}
              totalPages={totalPages}
              totalResults={totalResults}
              onPageChange={setCurrentPage}
              onGenerateOtp={handleGenerateOtp}
              onDeactivateUser={handleDeactivate}
            />
          )}
        </div>
      </main>
    </AdminLayout>
  );
}
