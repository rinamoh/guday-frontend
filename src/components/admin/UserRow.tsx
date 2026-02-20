interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  employeeId: string;
  avatar?: string;
}

interface UserRowProps {
  user: User;
  onGenerateOtp?: (id: string) => void;
  onDeactivateUser?: (id: string) => void;
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Senior Agent':
      return 'bg-blue-50 text-blue-700 border-blue-100';
    case 'Reviewer':
      return 'bg-purple-50 text-purple-700 border-purple-100';
    case 'Admin':
      return 'bg-amber-50 text-amber-700 border-amber-100';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-100';
  }
};

export function UserRow({ user, onGenerateOtp, onDeactivateUser }: UserRowProps) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold overflow-hidden mr-3">
            {user.avatar ? (
              <img alt="Avatar" className="w-full h-full object-cover" src={user.avatar} />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500">ID: {user.employeeId}</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>

      <td className="px-6 py-4">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${getRoleColor(user.role)}`}>
          {user.role}
        </span>
      </td>

      <td className="px-6 py-4">
        <span className={`flex items-center text-xs font-semibold ${user.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}>
          <span className={`w-2 h-2 rounded-full mr-2 ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
          {user.status}
        </span>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end space-x-2">
          <button
            type="button"
            title="Generate OTP"
            onClick={() => onGenerateOtp?.(user.id)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">vpn_key</span>
          </button>
          <button
            type="button"
            title="Deactivate Agent"
            onClick={() => onDeactivateUser?.(user.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">person_off</span>
          </button>
        </div>
      </td>
    </tr>
  );
}
