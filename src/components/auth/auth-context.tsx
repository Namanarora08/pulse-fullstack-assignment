"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthSession, PatientRecord, DoctorRecord, AdminRecord, UserRole, SESSION_COOKIE_NAME } from "@/lib/auth";
import { safeFetchJson } from "@/lib/api-client";

interface AuthContextType {
  session: AuthSession | null;
  role: UserRole | null;
  user: PatientRecord | DoctorRecord | AdminRecord | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role: UserRole, payload: Record<string, unknown>) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updatePatientData: (updater: (prev: PatientRecord) => PatientRecord) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "pulse_auth_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session from localStorage / cookie on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AuthSession;
        setSession(parsed);
        // Ensure cookie is in sync with localStorage for middleware
        document.cookie = `${SESSION_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(parsed))}; path=/; max-age=604800; SameSite=Lax`;
      }
    } catch {
      // Fallback ignore error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (role: UserRole, payload: Record<string, unknown>) => {
    try {
      const res = await safeFetchJson<{ success?: boolean; error?: string; session?: AuthSession }>("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, ...payload }),
      });

      if (!res.ok || !res.data || !res.data.success || !res.data.session) {
        return { success: false, error: res.data?.error || res.error || "Authentication failed" };
      }

      const newSession: AuthSession = res.data.session;
      setSession(newSession);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSession));
      document.cookie = `${SESSION_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(newSession))}; path=/; max-age=604800; SameSite=Lax`;

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error during login";
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
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
      router.push("/login");
    }
  };

  const updatePatientData = (updater: (prev: PatientRecord) => PatientRecord) => {
    setSession((prevSession) => {
      if (!prevSession || prevSession.role !== "patient") return prevSession;
      const currentPatient = prevSession.user as PatientRecord;
      const updatedPatient = updater(currentPatient);
      const newSession: AuthSession = {
        ...prevSession,
        user: updatedPatient,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSession));
      return newSession;
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
        updatePatientData,
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
