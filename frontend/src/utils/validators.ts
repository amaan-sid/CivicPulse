import type { CreateIssueInput } from "../features/issues/types";

export type FormErrors = Partial<Record<keyof CreateIssueInput, string>>;

/** Mirrors the API's validation rules so users get instant feedback. */
export function validateIssue(input: CreateIssueInput): FormErrors {
  const errors: FormErrors = {};
  const title = input.title.trim();
  const description = input.description.trim();

  if (title.length < 5) errors.title = "Use at least 5 characters.";
  else if (title.length > 120) errors.title = "Keep it under 120 characters.";

  if (!input.location.trim()) errors.location = "Tell us where the issue is.";

  if (description.length < 10) errors.description = "Add a few more details (at least 10 characters).";
  else if (description.length > 2000) errors.description = "Keep it under 2000 characters.";

  if ((input.reporterName ?? "").trim().length > 60) errors.reporterName = "Keep it under 60 characters.";

  return errors;
}
