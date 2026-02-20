import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { useCreateAdminAgent } from '../features/admin/agent/mutation';

export function AddAgentPage() {
  const navigate = useNavigate();
  const createAgentMutation = useCreateAdminAgent();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    category_id: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Agent Management', href: '/admin/users' },
    { label: 'Add New Agent' },
  ];

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): string | null {
    if (!form.username.trim()) return 'Username is required.';
    if (!form.email.trim()) return 'Email is required.';
    if (!form.password.trim()) return 'Password is required.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    createAgentMutation.mutate(
      {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        category_id: form.category_id.trim() || undefined,
      },
      {
        onSuccess: () => {
          alert('Agent created successfully');
          navigate('/admin/users');
        },
        onError: (err: any) => {
          setErrorMessage(err?.message || 'Failed to create agent.');
        },
      }
    );
  }

  return (
    <AdminLayout title="Add New Agent" breadcrumbs={breadcrumbs}>
      <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Create Agent</h2>

            {errorMessage && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => updateField('username', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="agent_username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="agent@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter temporary password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Re-enter password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category ID <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.category_id}
                  onChange={(e) => updateField('category_id', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="550e8400-e29b-41d4-a716-446655440000"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/users')}
                  className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createAgentMutation.isPending}
                  className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {createAgentMutation.isPending ? 'Creating...' : 'Create Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}
