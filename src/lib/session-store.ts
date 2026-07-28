import { FullSession } from "@/lib/auth";

// In-memory session storage for demo (would be DB in production)
export const sessionStore = new Map<string, FullSession>();
