/**
 * Typed HTTP layer for the Thikana REST API (`/api/v1`).
 *
 * INTEGRATION POINT: while the Laravel backend is not reachable, the service
 * modules fall back to the isolated mock layer (src/services/mock). Set
 * `VITE_THIKANA_API_URL` to switch every service to real endpoints.
 */

export const API_BASE_URL = import.meta.env["VITE_THIKANA_API_URL"] ?? "";
export const USING_MOCK_API = API_BASE_URL === "";

export class ApiError extends Error {
  readonly status: number;
  readonly details?: Record<string, string[]> | undefined;

  constructor(status: number, message: string, details?: Record<string, string[]> | undefined) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | undefined;
  body?: unknown;
  signal?: AbortSignal | undefined;
  query?: Record<string, string | number | boolean | undefined> | undefined;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(`${API_BASE_URL}/api/v1${path}`, window.location.origin);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const fetchOptions: RequestInit = {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
    ...(options.signal !== undefined ? { signal: options.signal } : {}),
  };

  const response = await fetch(buildUrl(path, options.query), fetchOptions);

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    let details: Record<string, string[]> | undefined;
    try {
      const payload = (await response.json()) as { message?: string; errors?: Record<string, string[]> };
      if (payload.message) message = payload.message;
      details = payload.errors;
    } catch {
      // Response body was not JSON; keep the generic message.
    }
    throw new ApiError(response.status, message, details);
  }

  return (await response.json()) as T;
}

/** Small delay so mock-backed screens still exercise their loading states. */
export function mockDelay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
