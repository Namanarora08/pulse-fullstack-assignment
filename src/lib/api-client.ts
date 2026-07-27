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
