import { UserRow } from './UserRow';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  employeeId: string;
  avatar?: string;
}

interface UsersTableProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
  onPageChange: (page: number) => void;
  onGenerateOtp?: (id: string) => void;
  onDeactivateUser?: (id: string) => void;
  showDeactivateAction?: boolean;
  deactivateActionTitle?: string;
}

export function UsersTable({
  users,
  currentPage,
  totalPages,
  totalResults,
  onPageChange,
  onGenerateOtp,
  onDeactivateUser,
  showDeactivateAction = true,
  deactivateActionTitle = 'Deactivate',
}: UsersTableProps) {
  const startResult = totalResults === 0 ? 0 : (currentPage - 1) * 10 + 1;
  const endResult = Math.min(currentPage * 10, totalResults);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onGenerateOtp={onGenerateOtp}
                onDeactivateUser={onDeactivateUser}
                showDeactivateAction={showDeactivateAction}
                deactivateActionTitle={deactivateActionTitle}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing <span className="font-medium">{startResult}</span> to{' '}
          <span className="font-medium">{endResult}</span> of{' '}
          <span className="font-medium">{totalResults}</span> results
        </p>

        <div className="flex items-center space-x-2">
          <button
            className={`px-3 py-1 border border-slate-200 rounded text-sm font-medium ${
              currentPage === 1 ? 'text-slate-400 cursor-not-allowed' : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>
          <button
            className={`px-3 py-1 border border-slate-200 rounded text-sm font-medium ${
              currentPage === totalPages || totalPages === 0
                ? 'text-slate-400 cursor-not-allowed'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
