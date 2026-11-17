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
  { value: "resident", label: "Resident", desc: "Report & track issues" },
  { value: "staff", label: "Staff", desc: "Resolve assigned tasks" },
  { value: "admin", label: "Admin", desc: "Manage societies & SLA" },
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
        /* ignore optional society suggestions failure */
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
    <div className="grid min-h-screen bg-slate-50 lg:grid-cols-2">
      {/* Brand Panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.3),_transparent_55%)]"
          aria-hidden="true"
        />

        <Link to="/" className="relative z-10 flex items-center gap-3">
          <Logo className="size-9" />
          <div>
            <p className="text-base font-bold tracking-tight text-white">CivicPulse</p>
            <p className="text-xs text-slate-400">Society Issue Resolution</p>
          </div>
        </Link>

        <div className="relative z-10 max-w-md">
          <h1 className="text-3xl font-bold leading-tight tracking-tight">
            Bring calm, structured maintenance to your residential community.
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Join your society as a Resident, Maintenance Staff member, or Administrator to start
            reporting, assigning, and resolving issues with full accountability.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {ROLE_OPTIONS.map((r) => (
              <div
                key={r.value}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5"
              >
                <p className="text-sm font-semibold text-white">{r.label}</p>
                <p className="mt-1 text-xs text-slate-400">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} CivicPulse · Priority-aware community workflows
        </p>
      </div>

      {/* Signup Form */}
      <div className="flex flex-col justify-center px-4 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Link to="/" className="flex items-center gap-2.5">
              <Logo className="size-8" />
              <span className="text-base font-bold text-slate-900">CivicPulse</span>
            </Link>
            <Link to="/" className="text-xs font-semibold text-indigo-600 hover:underline">
              Back to home
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h2>
              <p className="mt-1.5 text-sm text-slate-500">
                Choose your role and get connected to your society workspace.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              >
                <Icon name="alert" className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4" noValidate>
              {/* Role selector cards */}
              <div>
                <span className="mb-2 block text-sm font-medium text-slate-700">Account role</span>
                <div className="grid grid-cols-3 gap-2.5">
                  {ROLE_OPTIONS.map((opt) => {
                    const active = role === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setRole(opt.value)}
                        className={`rounded-xl border px-3 py-2.5 text-left transition ${
                          active
                            ? "border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <p className={`text-xs font-bold ${active ? "text-indigo-700" : "text-slate-900"}`}>
                          {opt.label}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500">{opt.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="signup-name" className="mb-1.5 block text-sm font-medium text-slate-700">
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
                    className="block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>

                <div>
                  <label htmlFor="signup-email" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email address
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@society.com"
                    className="block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-password" className="mb-1.5 block text-sm font-medium text-slate-700">
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
                    placeholder="At least 8 characters"
                    className="block w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-3.5 pr-11 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <Icon name={showPassword ? "eyeOff" : "eye"} className="size-4" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Minimum 8 characters.{" "}
                  {password.length > 0 && (
                    <span className={password.length >= 8 ? "font-medium text-emerald-600" : "text-amber-600"}>
                      ({password.length}/8)
                    </span>
                  )}
                </p>
              </div>

              {(role === "resident" || role === "staff") && (
                <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                  {role === "resident" && (
                    <div>
                      <label htmlFor="signup-flat" className="mb-1.5 block text-sm font-medium text-slate-700">
                        Flat / Unit number
                      </label>
                      <input
                        id="signup-flat"
                        type="text"
                        value={flatNumber}
                        onChange={(e) => setFlatNumber(e.target.value)}
                        placeholder="e.g. B-402"
                        className="block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="signup-society" className="mb-1.5 block text-sm font-medium text-slate-700">
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
                      className="block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
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
                    <p className="mt-1.5 text-xs text-slate-500">
                      {publicSocieties.length > 0
                        ? "Pick a registered society from suggestions or type any code/name."
                        : "Enter your society name, code, or ID. Your account will be created even if linked later."}
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <Spinner className="size-4" />}
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
