import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// If you already created these in src/api/auth.ts from the previous plan:
import { login, saveAuthToken } from "../api/auth";

type FormState = {
  username: string;
  password: string;
  remember: boolean;
};

export function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    username: "",
    password: "",
    remember: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    // Basic frontend validation (safe + minimal)
    if (!form.username.trim() || !form.password.trim()) {
      setErrorMessage("Please enter your username and password.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await login({
        username: form.username,
        password: form.password,
      });

      if (res.success && res.data?.token) {
        // Store token for API calls
        saveAuthToken(res.data.token);

        // Optional: Store user info
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // Redirect to public home (NOT admin)
        navigate("/", { replace: true });
      } else {
        throw new Error("Login failed: Invalid response");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="p-8 sm:p-10">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center mb-6">
                <span className="text-primary text-4xl font-extrabold tracking-tight">
                  Guday
                </span>
              </div>

              <h2 className="text-2xl font-bold text-primary dark:text-blue-400">
                Sign In to Your Account
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Access official government services information securely
              </p>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <form className="space-y-6" onSubmit={onSubmit}>
              {/* Username */}
              <div>
                <label
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                  htmlFor="username"
                >
                  Username
                </label>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <span className="material-symbols-outlined text-xl">
                      person
                    </span>
                  </span>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    placeholder="your-username"
                    value={form.username}
                    onChange={(e) => onChangeUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                    htmlFor="password"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <span className="material-symbols-outlined text-xl">
                      lock
                    </span>
                  </span>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => onChangePassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                  />
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => onToggleRemember(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-slate-300 dark:border-slate-700 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-slate-600 dark:text-slate-400"
                >
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors uppercase tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Need admin access?{" "}
                <Link
                  to="/admin/login"
                  className="font-bold text-primary hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Go to Admin Login
                </Link>
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center space-x-4" />
        </div>
      </div>
    </main>
  );
}