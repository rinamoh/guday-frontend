import { AdminLayout } from '../layouts/AdminLayout';
import { SearchAndFilters } from '../components/admin/SearchAndFilters';
import { UsersTable } from '../components/admin/UsersTable';
import { UsersPageHeaderActions } from '../components/admin/UsersPageHeaderActions';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminUsers } from '../features/admin/user/queries';
import { useGenerateAdminUserOtp } from '../features/admin/user/mutation';

interface UiUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  employeeId: string;
  avatar?: string;
}

const ITEMS_PER_PAGE = 10;

function mapRole(user: any): string {
  const roles = user?.roles;
  if (Array.isArray(roles) && roles.length > 0) {
    const first = roles[0];
    if (typeof first === 'string') return first;
    if (first && typeof first === 'object' && typeof first.name === 'string') return first.name;
  }
  return 'User';
}

export function AdminUserManagementPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  const usersQuery = useAdminUsers();
  const otpMutation = useGenerateAdminUserOtp();

  const allUsers: UiUser[] = useMemo(() => {
    const raw = usersQuery.data ?? [];
    return raw.map((u: any) => ({
      id: String(u.id),
      name: u.full_name || u.username || `User ${u.id}`,
      email: u.email || '-',
      role: mapRole(u),
      status: u.is_active === false ? 'Inactive' : 'Active',
      employeeId: `USR-${u.id}`,
      avatar: undefined,
    }));
  }, [usersQuery.data]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allUsers.filter((u) => {
      const matchQ =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.employeeId.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || u.status === statusFilter;
      return matchQ && matchStatus;
    });
  }, [allUsers, searchQuery, statusFilter]);

  const totalResults = filteredUsers.length;
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(1, totalPages || 1));

  const pagedUsers = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, safePage]);

  const handleAddUser = () => navigate('/admin/user-management/new');

  const handleGenerateOtp = (id: string) => {
    otpMutation.mutate(id, {
      onSuccess: () => alert('User OTP generated successfully'),
      onError: (err) => alert(`Failed to generate user OTP: ${(err as Error).message}`),
    });
  };

  const handleExport = () => {
    const rows = [
      ['ID', 'Name', 'Email', 'Role', 'Status'],
      ...filteredUsers.map((u) => [u.id, u.name, u.email, u.role, u.status]),
    ];
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'User Management' },
  ];

  return (
    <AdminLayout
      title="User Management"
      breadcrumbs={breadcrumbs}
      actions={<UsersPageHeaderActions onAddUser={handleAddUser} buttonLabel="Add New User" />}
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
            searchPlaceholder="Search users by name, email or ID..."
          />

          {usersQuery.isLoading ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-slate-600">
              Loading users...
            </div>
          ) : usersQuery.error ? (
            <div className="bg-white rounded-xl border border-red-200 p-8 text-red-600">
              Failed to load users: {(usersQuery.error as Error).message}
            </div>
          ) : (
            <UsersTable
              users={pagedUsers}
              currentPage={safePage}
              totalPages={totalPages}
              totalResults={totalResults}
              onPageChange={setCurrentPage}
              onGenerateOtp={handleGenerateOtp}
              showDeactivateAction={false}
            />
          )}
        </div>
      </main>
    </AdminLayout>
  );
}
