"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ArrowLeft, HeartPulse, Shield, Stethoscope } from "lucide-react";

import { AnimatedBackground } from "@/components/auth/animated-background";
import { PatientAuthForm } from "@/components/auth/patient-auth-form";
import { DoctorAuthForm } from "@/components/auth/doctor-auth-form";
import { AdminAuthForm } from "@/components/auth/admin-auth-form";
import { RoleType } from "@/components/auth/role-selection-cards";
import { ThemeToggle } from "@/components/ui/theme-toggle";

function LoginContent() {
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") as RoleType) || "patient";
  const [activeRole, setActiveRole] = useState<RoleType>(initialRole);

  useEffect(() => {
    const r = searchParams.get("role") as RoleType;
    if (r && ["patient", "doctor", "admin"].includes(r)) {
      setActiveRole(r);
    }
  }, [searchParams]);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <AnimatedBackground />

      {/* Top Header */}
      <header className="relative z-40 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-slate-900 dark:text-white hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-4 w-4 text-slate-500" />
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
              <Activity className="h-4 w-4" />
            </span>
            <span className="text-lg">Pulse <span className="text-xs font-normal text-blue-600 dark:text-blue-400">Portal</span></span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="relative z-10 my-auto mx-auto w-full max-w-xl px-4 py-8 sm:px-6">
        {/* Role Selection Segmented Control */}
        <div className="mb-6 flex rounded-2xl border border-slate-200/80 bg-white/80 p-1.5 shadow-md backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
          <button
            type="button"
            onClick={() => setActiveRole("patient")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
              activeRole === "patient"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <HeartPulse className="h-4 w-4" />
            Patient
          </button>
          <button
            type="button"
            onClick={() => setActiveRole("doctor")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
              activeRole === "doctor"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/25"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Stethoscope className="h-4 w-4" />
            Doctor
          </button>
          <button
            type="button"
            onClick={() => setActiveRole("admin")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
              activeRole === "admin"
                ? "bg-slate-900 text-white shadow-md dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Shield className="h-4 w-4" />
            Admin
          </button>
        </div>

        {/* Animated Form Container */}
        <AnimatePresence mode="wait">
          {activeRole === "patient" && (
            <motion.div
              key="patient-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <PatientAuthForm />
            </motion.div>
          )}

          {activeRole === "doctor" && (
            <motion.div
              key="doctor-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <DoctorAuthForm />
            </motion.div>
          )}

          {activeRole === "admin" && (
            <motion.div
              key="admin-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <AdminAuthForm />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/60 bg-white/40 py-4 text-center text-xs text-slate-500 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/40 dark:text-slate-400">
        <p>© 2026 Pulse Healthcare Systems • HIPAA & NABH Compliant Clinical Gateway</p>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center text-sm font-medium text-slate-500">Loading Portal...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
