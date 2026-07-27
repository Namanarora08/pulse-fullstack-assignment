/**
 * Pulls a human readable message out of an error payload
 * (`{ error: { message } }`, `{ error: string }` or `{ message }`).
 */
function extractErrorMessage(payload: unknown, status: number): string {
  if (payload && typeof payload === "object") {
    const { error, message } = payload as { error?: unknown; message?: unknown };
    if (typeof error === "string" && error) return error;
    if (error && typeof error === "object") {
      const nested = (error as { message?: unknown }).message;
      if (typeof nested === "string" && nested) return nested;
    }
    if (typeof message === "string" && message) return message;
  }

  return `Request failed with status ${status}`;
}

/**
 * Helper function to safely fetch JSON from API routes.
 * Prevents "Unexpected token '<', ... is not valid JSON" errors if the server responds with HTML (404, 500, or redirects).
 */
export async function safeFetchJson<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data: T | null; error?: string }> {
  try {
    const res = await fetch(input, init);
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const json = await res.json();
      return {
        ok: res.ok,
        status: res.status,
        data: json as T,
        error: res.ok ? undefined : extractErrorMessage(json, res.status),
      };
    } else {
      const text = await res.text();
      return {
        ok: false,
        status: res.status,
        data: null,
        error: `Non-JSON response (${res.status}): ${text.slice(0, 100)}`,
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error";
    return {
      ok: false,
      status: 500,
      data: null,
      error: msg,
    };
  }
}
