import { UserRole } from "@/lib/auth";
import { errorResponse } from "@/lib/api/responses";
import { requireRole } from "@/lib/server-auth";
import type { SessionPayload } from "@/lib/session";

type GuardResult =
  | { session: SessionPayload; response: null }
  | { session: null; response: ReturnType<typeof errorResponse> };

// Guards an API route: resolves the verified session or the response to return.
export async function guardRoute(roles: UserRole[]): Promise<GuardResult> {
  const session = await requireRole(roles);
  if (session) return { session, response: null };

  const anySession = await requireRole(["patient", "doctor", "admin"]);
  return {
    session: null,
    response: errorResponse(
      anySession ? "Forbidden" : "Authentication required",
      { status: anySession ? 403 : 401 }
    )
  };
}
