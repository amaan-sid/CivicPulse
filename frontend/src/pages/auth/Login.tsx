import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setUser } from "../../features/auth/authSlice";
import { Icon, Logo } from "../../components/ui/Icon";
import { Spinner } from "../../components/ui/Button";

const DEMO_ACCOUNTS = [
  { label: "Admin", email: "admin@civicpulse.local", password: "Password123!" },
  { label: "Staff", email: "staff@civicpulse.local", password: "Password123!" },
  { label: "Resident", email: "resident@civicpulse.local", password: "Password123!" },
];

function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const performLogin = async (loginEmail: string, loginPassword: string) => {
    setError("");
    const trimmedEmail = loginEmail.trim();
    if (!trimmedEmail || !loginPassword) {
      setError("Please enter both your email address and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/login", {
        email: trimmedEmail,
        password: loginPassword,
      });

      dispatch(setUser(res.data.user));
      navigate(redirectTo, { replace: true });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Unable to sign in. Check your credentials and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    void performLogin(email, password);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-zinc-50 px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link to="/" className="mb-4 inline-flex items-center gap-2.5">
            <Logo className="size-8" />
            <span className="text-base font-semibold tracking-tight text-zinc-900">CivicPulse</span>
          </Link>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            Sign in to your account
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Enter your credentials to access your workspace.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Credentials</span>
            <Link
              to="/"
              aria-label="Close and return to home"
              title="Back to home"
              className="-mr-1.5 -mt-1 rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              <Icon name="x" className="size-4" />
            </Link>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700"
            >
              <Icon name="alert" className="mt-0.5 size-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-xs font-medium text-zinc-700">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@society.com"
                className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-1.5 block text-xs font-medium text-zinc-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full rounded-lg border border-zinc-300 bg-white py-2 pl-3 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-400 hover:text-zinc-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Icon name={showPassword ? "eyeOff" : "eye"} className="size-4" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <Spinner className="size-4" />}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {import.meta.env.DEV && (
            <div className="mt-5 border-t border-zinc-100 pt-4">
              <p className="mb-2.5 text-center text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                Quick demo access
              </p>
              <div className="grid grid-cols-3 gap-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.label}
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setEmail(acc.email);
                      setPassword(acc.password);
                      void performLogin(acc.email, acc.password);
                    }}
                    className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50"
                  >
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-zinc-900 underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
