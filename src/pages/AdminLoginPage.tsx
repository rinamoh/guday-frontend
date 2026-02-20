import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminLogin } from '../features/admin/auth/mutations';

type FormState = {
  username: string;
  password: string;
  remember: boolean;
};

export function AdminLoginPage() {
  const navigate = useNavigate();
  const loginMutation = useAdminLogin();

  const [form, setForm] = useState<FormState>({
    username: '',
    password: '',
    remember: true,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function onChangeUsername(value: string) {
    setForm((prev) => ({ ...prev, username: value }));
  }

  function onChangePassword(value: string) {
    setForm((prev) => ({ ...prev, password: value }));
  }

  function onToggleRemember(value: boolean) {
    setForm((prev) => ({ ...prev, remember: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!form.username.trim() || !form.password.trim()) {
      setErrorMessage('Please enter your username and password.');
      return;
    }

    loginMutation.mutate(
      { username: form.username, password: form.password },
      {
        onSuccess: () => {
          navigate('/admin/dashboard', { replace: true });
        },
        onError: (err: any) => {
          setErrorMessage(err?.message || 'Admin login failed. Please try again.');
        },
      }
    );
  }

  return (
    <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200">
          <div className="p-8 sm:p-10">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center mb-6">
                <span className="text-primary text-4xl font-extrabold tracking-tight">Guday</span>
              </div>

              <h2 className="text-2xl font-bold text-primary">Admin Sign In</h2>
              <p className="mt-2 text-sm text-slate-500">
                Access the administrative dashboard securely
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label
                  className="block text-sm font-semibold text-slate-700 mb-2"
                  htmlFor="admin-username"
                >
                  Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <span className="material-symbols-outlined text-xl">person</span>
                  </span>
                  <input
                    id="admin-username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    placeholder="your-admin-username"
                    value={form.username}
                    onChange={(e) => onChangeUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-semibold text-slate-700 mb-2"
                  htmlFor="admin-password"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <span className="material-symbols-outlined text-xl">lock</span>
                  </span>
                  <input
                    id="admin-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => onChangePassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="admin-remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => onToggleRemember(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded"
                />
                <label htmlFor="admin-remember-me" className="ml-2 block text-sm text-slate-600">
                  Remember me for 30 days
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors uppercase tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loginMutation.isPending ? 'Signing In...' : 'Admin Sign In'}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-600">
                Need user login instead?{' '}
                <Link to="/login" className="font-bold text-primary hover:text-blue-700">
                  Go to User Login
                </Link>
              </p>
            </div>
          </div>

          <div className="bg-slate-50 px-8 py-4 border-t border-slate-200" />
        </div>
      </div>
    </main>
  );
}