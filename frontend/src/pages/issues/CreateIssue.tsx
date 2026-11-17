import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import { Icon } from "../../components/ui/Icon";
import { Spinner } from "../../components/ui/Button";

const CATEGORIES = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electricity", label: "Electricity" },
  { value: "lift", label: "Lift / Elevator" },
  { value: "security", label: "Security" },
  { value: "cleanliness", label: "Cleanliness" },
  { value: "water", label: "Water Supply" },
];

const SEVERITIES: Array<{ value: "low" | "medium" | "high"; label: string; hint: string; ring: string }> = [
  { value: "low", label: "Low", hint: "Minor inconvenience · 48h SLA", ring: "border-emerald-500 bg-emerald-50/70 text-emerald-800" },
  { value: "medium", label: "Medium", hint: "Disruptive · 24h SLA", ring: "border-amber-500 bg-amber-50/70 text-amber-800" },
  { value: "high", label: "High", hint: "Urgent / safety risk · 12h SLA", ring: "border-rose-500 bg-rose-50/70 text-rose-800" },
];

function CreateIssue() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("plumbing");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (title.trim().length < 4) {
      setError("Please provide a clear title (at least 4 characters).");
      return;
    }
    if (description.trim().length < 10) {
      setError("Please describe the issue in at least 10 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post("/issues", {
        title: title.trim(),
        description: description.trim(),
        category,
        severity,
      });

      const created = res.data?.issue ?? res.data;
      if (res.data?.message) {
        setSuccess(res.data.message);
      }

      if (created?._id) {
        navigate(`/issues/${created._id}`);
      } else {
        navigate("/issues");
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to submit issue. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link
          to="/issues"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600"
        >
          <Icon name="chevronLeft" className="size-3.5" />
          Back to issues
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Report a New Issue</h1>
        <p className="mt-1 text-sm text-slate-500">
          Duplicate issues in the same category automatically merge and increase priority score.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              <Icon name="alert" className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
            >
              <Icon name="check" className="mt-0.5 size-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="issue-title" className="mb-1.5 block text-sm font-semibold text-slate-800">
                Issue Title
              </label>
              <input
                id="issue-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Water leakage near Tower B 3rd floor corridor"
                className="block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>

            <div>
              <label htmlFor="issue-category" className="mb-1.5 block text-sm font-semibold text-slate-800">
                Category
              </label>
              <select
                id="issue-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="mb-2 block text-sm font-semibold text-slate-800">Severity Level</span>
              <div className="grid gap-3 sm:grid-cols-3">
                {SEVERITIES.map((s) => {
                  const selected = severity === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setSeverity(s.value)}
                      className={`rounded-xl border p-3 text-left transition ${
                        selected
                          ? `${s.ring} ring-1`
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <p className="text-sm font-bold">{s.label}</p>
                      <p className="mt-0.5 text-xs opacity-80">{s.hint}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="issue-description" className="mb-1.5 block text-sm font-semibold text-slate-800">
                Description
              </label>
              <textarea
                id="issue-description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include the exact location, when the problem started, and any immediate safety impact…"
                className="block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <Link
                to="/issues"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {submitting && <Spinner className="size-4" />}
                {submitting ? "Submitting…" : "Submit Issue"}
              </button>
            </div>
          </form>
        </Card>

        <div className="space-y-4">
          <Card>
            <h2 className="text-sm font-bold text-slate-900">How Automatic Triage Works</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              CivicPulse assigns a priority score using your chosen category, total resident reports,
              and SLA urgency. If another resident already reported the same problem, your report
              automatically increments the counter and elevates its priority.
            </p>
          </Card>

          <Card>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tips for Faster Resolution
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <Icon name="check" className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                Include block, floor, or nearest flat number.
              </li>
              <li className="flex items-start gap-2">
                <Icon name="check" className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                Pick the most accurate category so the right staff team is assigned.
              </li>
              <li className="flex items-start gap-2">
                <Icon name="check" className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                Mark safety hazards (sparks, flooding, stuck lift) as High severity.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CreateIssue;
