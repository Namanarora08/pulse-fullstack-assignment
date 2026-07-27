"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthSession,
  PatientRecord,
  DoctorRecord,
  AdminRecord,
  UserRole
} from "@/lib/auth";
import { safeFetchJson } from "@/lib/api-client";

interface AuthContextType {
  session: AuthSession | null;
  role: UserRole | null;
  user: PatientRecord | DoctorRecord | AdminRecord | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    role: UserRole,
    payload: Record<string, unknown>
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updatePatientData: (updater: (prev: PatientRecord) => PatientRecord) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Hydrate the session from the server; the session cookie is httpOnly and
  // signed, so it is never readable or writable from the browser.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const res = await safeFetchJson<{
        authenticated?: boolean;
        session?: AuthSession;
      }>("/api/auth/me");
      if (cancelled) return;
      if (res.ok && res.data?.authenticated && res.data.session) {
        setSession(res.data.session);
      }
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (role: UserRole, payload: Record<string, unknown>) => {
    try {
      const res = await safeFetchJson<{
        success?: boolean;
        error?: string;
        session?: AuthSession;
      }>("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, ...payload })
      });

      if (!res.ok || !res.data || !res.data.success || !res.data.session) {
        return {
          success: false,
          error: res.data?.error || res.error || "Authentication failed"
        };
      }

      setSession(res.data.session);

      return { success: true };
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Network error during login";
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors on logout
    } finally {
      setSession(null);
      router.push("/login");
    }
  };

  const updatePatientData = (
    updater: (prev: PatientRecord) => PatientRecord
  ) => {
    setSession((prevSession) => {
      if (!prevSession || prevSession.role !== "patient") return prevSession;
      const currentPatient = prevSession.user as PatientRecord;
      return {
        ...prevSession,
        user: updater(currentPatient)
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        role: session?.role || null,
        user: session?.user || null,
        isAuthenticated: !!session,
        isLoading,
        login,
        logout,
        updatePatientData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
