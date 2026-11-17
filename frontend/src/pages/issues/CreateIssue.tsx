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

const SEVERITIES: Array<{ value: "low" | "medium" | "high"; label: string; hint: string }> = [
  { value: "low", label: "Low", hint: "Minor · 48h SLA" },
  { value: "medium", label: "Medium", hint: "Disruptive · 24h SLA" },
  { value: "high", label: "High", hint: "Urgent · 12h SLA" },
];

function CreateIssue() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("plumbing");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

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
          className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900"
        >
          <Icon name="chevronLeft" className="size-3.5" />
          Back to issues
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">Report an issue</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Duplicate reports in the same category merge automatically and raise priority.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700"
            >
              <Icon name="alert" className="mt-0.5 size-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="issue-title" className="mb-1.5 block text-xs font-medium text-zinc-700">
                Title
              </label>
              <input
                id="issue-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Water leakage near Tower B 3rd floor corridor"
                className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label htmlFor="issue-category" className="mb-1.5 block text-xs font-medium text-zinc-700">
                Category
              </label>
              <select
                id="issue-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="mb-1.5 block text-xs font-medium text-zinc-700">Severity</span>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {SEVERITIES.map((s) => {
                  const selected = severity === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setSeverity(s.value)}
                      className={`rounded-lg border px-3.5 py-2.5 text-left transition ${
                        selected
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300"
                      }`}
                    >
                      <p className="text-xs font-semibold">{s.label}</p>
                      <p className={`mt-0.5 text-[11px] ${selected ? "text-zinc-300" : "text-zinc-500"}`}>
                        {s.hint}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="issue-description" className="mb-1.5 block text-xs font-medium text-zinc-700">
                Description
              </label>
              <textarea
                id="issue-description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include the exact location, when it started, and any safety concerns…"
                className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-zinc-100 pt-4">
              <Link
                to="/issues"
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
              >
                {submitting && <Spinner className="size-4" />}
                {submitting ? "Submitting…" : "Submit issue"}
              </button>
            </div>
          </form>
        </Card>

        <aside className="space-y-4">
          <Card>
            <h2 className="text-sm font-semibold text-zinc-900">Automatic triage</h2>
            <p className="mt-2 text-xs leading-5 text-zinc-600">
              Each issue receives a priority score based on category, report count, and SLA
              urgency. Matching open reports merge automatically so urgent problems escalate faster.
            </p>
          </Card>

          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Guidelines
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-zinc-600">
              <li>• Mention exact tower, floor, or nearest unit.</li>
              <li>• Choose the category matching the maintenance team.</li>
              <li>• Mark safety risks as High severity.</li>
            </ul>
          </Card>
        </aside>
      </div>
    </DashboardLayout>
  );
}

export default CreateIssue;
