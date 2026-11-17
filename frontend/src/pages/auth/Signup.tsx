import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setUser } from "../../features/auth/authSlice";
import type { UserRole } from "../../types/user";
import type { Society } from "../../types/society";
import { Icon, Logo } from "../../components/ui/Icon";
import { Spinner } from "../../components/ui/Button";

const ROLE_OPTIONS: Array<{ value: UserRole; label: string; desc: string }> = [
  { value: "resident", label: "Resident", desc: "Report & track" },
  { value: "staff", label: "Staff", desc: "Resolve tasks" },
  { value: "admin", label: "Admin", desc: "Manage societies" },
];

function Signup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("resident");
  const [flatNumber, setFlatNumber] = useState("");
  const [society, setSociety] = useState("");
  const [publicSocieties, setPublicSocieties] = useState<Society[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get<Society[]>("/society/public")
      .then((res) => setPublicSocieties(Array.isArray(res.data) ? res.data : []))
      .catch(() => {
        /* optional suggestions */
      });
  }, []);

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Name, email, and password are required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (role === "resident" && !flatNumber.trim()) {
      setError("Flat number is required for resident accounts.");
      return;
    }

    if ((role === "resident" || role === "staff") && !society.trim()) {
      setError("Please select or enter a society name, code, or ID.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/signup", {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        flatNumber: flatNumber.trim(),
        society: society.trim(),
      });

      if (res.data?.user) {
        dispatch(setUser(res.data.user));
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Signup failed. Please review your details and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-zinc-50 px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link to="/" className="mb-4 inline-flex items-center gap-2.5">
            <Logo className="size-8" />
            <span className="text-base font-semibold tracking-tight text-zinc-900">CivicPulse</span>
          </Link>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Create your account</h1>
          <p className="mt-1 text-sm text-zinc-500">Choose your role to join your society workspace.</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Account details</span>
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

          <form onSubmit={handleSignup} className="space-y-4" noValidate>
            <div>
              <span className="mb-1.5 block text-xs font-medium text-zinc-700">Role</span>
              <div className="grid grid-cols-3 gap-2">
                {ROLE_OPTIONS.map((opt) => {
                  const active = role === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRole(opt.value)}
                      className={`rounded-lg border px-2.5 py-2 text-left transition ${
                        active
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300"
                      }`}
                    >
                      <p className="text-xs font-semibold">{opt.label}</p>
                      <p className={`mt-0.5 text-[11px] ${active ? "text-zinc-300" : "text-zinc-500"}`}>
                        {opt.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="signup-name" className="mb-1.5 block text-xs font-medium text-zinc-700">
                  Full name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Priya Sharma"
                  className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label htmlFor="signup-email" className="mb-1.5 block text-xs font-medium text-zinc-700">
                  Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@society.com"
                  className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-password" className="mb-1.5 block text-xs font-medium text-zinc-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
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

            {(role === "resident" || role === "staff") && (
              <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50/70 p-3.5">
                {role === "resident" && (
                  <div>
                    <label htmlFor="signup-flat" className="mb-1.5 block text-xs font-medium text-zinc-700">
                      Flat / Unit number
                    </label>
                    <input
                      id="signup-flat"
                      type="text"
                      value={flatNumber}
                      onChange={(e) => setFlatNumber(e.target.value)}
                      placeholder="e.g. B-402"
                      className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="signup-society" className="mb-1.5 block text-xs font-medium text-zinc-700">
                    Society name, code, or ID
                  </label>
                  <input
                    id="signup-society"
                    type="text"
                    list="public-societies-list"
                    value={society}
                    onChange={(e) => setSociety(e.target.value)}
                    placeholder={
                      publicSocieties.length > 0
                        ? `e.g. ${publicSocieties[0].code || publicSocieties[0].name}`
                        : "Enter society code or name"
                    }
                    className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                  {publicSocieties.length > 0 && (
                    <datalist id="public-societies-list">
                      {publicSocieties.map((s) => (
                        <option key={s._id} value={s.code || s.name}>
                          {s.name} ({s.city})
                        </option>
                      ))}
                    </datalist>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <Spinner className="size-4" />}
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-zinc-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-zinc-900 underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
