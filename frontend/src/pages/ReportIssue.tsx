import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { issuesAPI } from "../features/issues/issuesAPI";
import type { CreateIssueInput, IssueCategory } from "../features/issues/types";
import { ApiError } from "../services/apiClient";
import { CATEGORY_LABELS, IMPACT_OPTIONS } from "../utils/constants";
import { validateIssue, type FormErrors } from "../utils/validators";
import PageHeader from "../components/PageHeader";
import { Button, ButtonLink } from "../components/ui/Button";
import { Alert, Card } from "../components/ui/Feedback";
import { CharCount, Field, Select, TextArea, TextInput } from "../components/ui/Field";

type FormState = Omit<CreateIssueInput, "category"> & { category: IssueCategory | "" };

const INITIAL: FormState = {
  title: "",
  description: "",
  category: "",
  impact: "individual",
  location: "",
  reporterName: "",
};

const FIELD_ORDER: (keyof FormState)[] = ["title", "category", "location", "impact", "description", "reporterName"];

const SLA_TABLE = [
  { label: "Critical", time: "4 hours", dot: "bg-red-600" },
  { label: "High", time: "24 hours", dot: "bg-orange-500" },
  { label: "Medium", time: "3 days", dot: "bg-amber-400" },
  { label: "Low", time: "7 days", dot: "bg-zinc-400" },
];

export default function ReportIssue() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key as keyof FormErrors]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const focusFirstError = (errs: FormErrors) => {
    const first = FIELD_ORDER.find((k) => errs[k as keyof FormErrors]);
    if (first) document.getElementById(`field-${first}`)?.focus();
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const errs: FormErrors = validateIssue({ ...form, category: form.category || "other" });
    if (!form.category) errs.category = "Choose the category that fits best.";
    if (Object.keys(errs).length) {
      setErrors(errs);
      focusFirstError(errs);
      return;
    }

    setSubmitting(true);
    try {
      const issue = await issuesAPI.create({
        ...form,
        category: form.category as IssueCategory,
        reporterName: form.reporterName?.trim() || undefined,
      });
      navigate(`/issues/${issue.id}`, { state: { created: true } });
    } catch (err) {
      setSubmitting(false);
      if (err instanceof ApiError && err.details.length) {
        const serverErrors = Object.fromEntries(err.details.map((d) => [d.field, d.message])) as FormErrors;
        setErrors(serverErrors);
        focusFirstError(serverErrors);
      } else {
        setFormError((err as Error).message);
      }
    }
  };

  return (
    <>
      <PageHeader title="Report an issue" description="Describe the problem clearly so the right team can act on it quickly." />

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <form onSubmit={onSubmit} noValidate>
            <div className="space-y-6 p-6">
              {formError && <Alert onDismiss={() => setFormError(null)}>{formError}</Alert>}

              <Field id="field-title" label="Title" error={errors.title} aside={<CharCount value={form.title} max={120} />}>
                <TextInput
                  id="field-title"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Broken street light outside Block C"
                  invalid={!!errors.title}
                  maxLength={140}
                  autoFocus
                />
              </Field>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field id="field-category" label="Category" error={errors.category}>
                  <Select
                    id="field-category"
                    value={form.category}
                    onChange={(e) => set("category", e.target.value as IssueCategory)}
                    invalid={!!errors.category}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field id="field-location" label="Location" error={errors.location}>
                  <TextInput
                    id="field-location"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    placeholder="e.g. Hostel B, 2nd floor"
                    invalid={!!errors.location}
                    maxLength={120}
                  />
                </Field>
              </div>

              <fieldset>
                <legend className="mb-1.5 text-sm font-medium text-zinc-900">Who is affected?</legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {IMPACT_OPTIONS.map((option) => {
                    const checked = form.impact === option.value;
                    return (
                      <label
                        key={option.value}
                        className={`cursor-pointer rounded-md border px-4 py-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-900 ${
                          checked ? "border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900" : "border-zinc-300 bg-white hover:border-zinc-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="impact"
                          value={option.value}
                          checked={checked}
                          onChange={() => set("impact", option.value)}
                          className="sr-only"
                          id={option.value === "individual" ? "field-impact" : undefined}
                        />
                        <span className="block text-sm font-medium text-zinc-900">{option.label}</span>
                        <span className="mt-0.5 block text-xs text-zinc-500">{option.description}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <Field
                id="field-description"
                label="Description"
                error={errors.description}
                hint="Include what you saw, when it started, and any safety concerns."
                aside={<CharCount value={form.description} max={2000} />}
              >
                <TextArea
                  id="field-description"
                  rows={5}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  invalid={!!errors.description}
                />
              </Field>

              <Field id="field-reporterName" label="Your name" optional error={errors.reporterName} hint="Leave blank to report anonymously.">
                <TextInput
                  id="field-reporterName"
                  value={form.reporterName}
                  onChange={(e) => set("reporterName", e.target.value)}
                  invalid={!!errors.reporterName}
                  maxLength={60}
                  autoComplete="name"
                />
              </Field>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-zinc-200 bg-zinc-50/60 px-6 py-4">
              <ButtonLink to="/" variant="ghost">
                Cancel
              </ButtonLink>
              <Button type="submit" loading={submitting}>
                {submitting ? "Submitting…" : "Submit issue"}
              </Button>
            </div>
          </form>
        </Card>

        <aside className="space-y-6 text-sm">
          <div>
            <h2 className="font-semibold text-zinc-900">How priority works</h2>
            <p className="mt-2 leading-relaxed text-zinc-600">
              Every issue gets a severity score from 0 to 100 based on its category, how many people are affected, and
              community upvotes. The score sets its priority and response deadline.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500">Response targets</h3>
            <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white">
              {SLA_TABLE.map((row) => (
                <li key={row.label} className="flex items-center justify-between px-4 py-2.5">
                  <span className="inline-flex items-center gap-2 text-zinc-700">
                    <span className={`size-2 rounded-full ${row.dot}`} />
                    {row.label}
                  </span>
                  <span className="tabular-nums text-zinc-500">{row.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
