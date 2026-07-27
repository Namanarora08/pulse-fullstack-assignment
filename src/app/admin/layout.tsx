"use client";

import React from "react";
import { useAuth } from "@/components/auth/auth-context";
import { AdminProvider } from "@/components/admin/admin-context";
import { ShieldAlert, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { role, isAuthenticated, isLoading } = useAuth();

  // If loading session state, show loading indicator
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Verifying Admin Clearance...</p>
        </div>
      </div>
    );
  }

  // Route protection: If not logged in as admin, show access restricted prompt or login option
  if (!isAuthenticated || role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <ShieldAlert className="h-7 w-7" />
          </div>
          
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Clearance Required</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You are currently logged in as <strong>{role || "Guest"}</strong>. Administrative governance portal access is restricted to hospital administrators.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link href="/login">
              <Button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2 text-xs">
                <KeyRound className="h-4 w-4" />
                Sign In as Administrator
              </Button>
            </Link>

            <Link href={role === "patient" ? "/patient" : role === "doctor" ? "/doctor" : "/login"}>
              <Button variant="outline" className="w-full rounded-xl text-xs">
                Return to {role === "patient" ? "Patient Portal" : role === "doctor" ? "Doctor Portal" : "Home"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <AdminProvider>{children}</AdminProvider>;
}
