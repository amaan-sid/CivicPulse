const BASE_URL = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");

export type FieldError = { field: string; message: string };

export class ApiError extends Error {
  readonly status: number;
  readonly details: FieldError[];

  constructor(status: number, message: string, details: FieldError[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  signal?: AbortSignal;
};

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, signal } = options;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  const qs = params.toString();

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}${qs ? `?${qs}` : ""}`, {
      method,
      signal,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new ApiError(0, "Unable to reach the server. Check your connection and try again.");
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = payload?.error ?? {};
    throw new ApiError(response.status, error.message ?? `Request failed (${response.status})`, error.details);
  }

  return payload as T;
}

export const apiClient = { request };
