"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ArrowLeft, HeartPulse, Stethoscope } from "lucide-react";

import { AnimatedBackground } from "@/components/auth/animated-background";
import { PatientAuthForm } from "@/components/auth/patient-auth-form";
import { DoctorAuthForm } from "@/components/auth/doctor-auth-form";
import { AdminAuthForm } from "@/components/auth/admin-auth-form";
import { RoleType } from "@/components/auth/role-selection-cards";

const roles: {
  id: RoleType;
  label: string;
  icon: typeof HeartPulse;
  accent: string;
}[] = [
  { id: "patient", label: "Patient", icon: HeartPulse, accent: "#34D399" },
  { id: "doctor", label: "Doctor", icon: Stethoscope, accent: "#818CF8" },
  { id: "admin", label: "Admin", icon: Activity, accent: "#A1A1AA" }
];

function LoginContent() {
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") as RoleType) || "patient";
  const [activeRole, setActiveRole] = useState<RoleType>(initialRole);

  useEffect(() => {
    const r = searchParams.get("role") as RoleType;
    if (r && ["patient", "doctor", "admin"].includes(r)) setActiveRole(r);
  }, [searchParams]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const activeAccent =
    roles.find((r) => r.id === activeRole)?.accent ?? "#34D399";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _activeAccent = activeAccent;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background text-foreground">
      <AnimatedBackground />

      {/* ── Header ── */}
      <header
        className="glass relative z-40 w-full"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="mx-auto flex h-14 max-w-xl items-center justify-between px-6">
          <Link
            href="/"
            className="transition-apple-fast flex items-center gap-2 text-text-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-recovery/20 bg-recovery/10">
              <Activity className="h-3.5 w-3.5 text-recovery" />
            </div>
            <span className="text-sm font-semibold text-foreground">Pulse</span>
          </Link>
          <span className="hidden text-xs text-text-muted sm:block">
            Clinical Portal Access
          </span>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md space-y-5"
        >
          {/* Page title */}
          <div className="space-y-1 pb-1 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="text-sm text-text-muted">
              Sign in to your Pulse portal
            </p>
          </div>

          {/* ── Role tab switcher ── */}
          <div
            className="flex gap-1 rounded-2xl p-1"
            style={{
              background: "#111113",
              border: "1px solid rgba(255,255,255,0.07)"
            }}
          >
            {roles.map((r) => {
              const Icon = r.icon;
              const active = activeRole === r.id;
              return (
                <motion.button
                  key={r.id}
                  type="button"
                  onClick={() => setActiveRole(r.id)}
                  whileTap={{ scale: 0.97 }}
                  className="transition-apple-fast relative flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-medium"
                  style={{
                    color: active ? r.accent : "#71717A"
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="role-tab-bg"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: `${r.accent}10`,
                        border: `1px solid ${r.accent}25`
                      }}
                      transition={{
                        type: "spring",
                        bounce: 0.18,
                        duration: 0.45
                      }}
                    />
                  )}
                  <Icon className="relative h-3.5 w-3.5" />
                  <span className="relative">{r.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* ── Animated form container ── */}
          <AnimatePresence mode="wait">
            {activeRole === "patient" && (
              <motion.div
                key="patient"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
              >
                <PatientAuthForm />
              </motion.div>
            )}
            {activeRole === "doctor" && (
              <motion.div
                key="doctor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
              >
                <DoctorAuthForm />
              </motion.div>
            )}
            {activeRole === "admin" && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
              >
                <AdminAuthForm />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="relative z-10 py-5 text-center text-xs text-text-muted"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        © 2026 Pulse Healthcare Systems · HIPAA & NABH Compliant
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-xs text-text-muted">Loading…</div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
