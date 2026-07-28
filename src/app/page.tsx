"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  HeartPulse,
  Stethoscope,
  Zap,
  BarChart3,
  Bell,
  Lock
} from "lucide-react";

import { AnimatedBackground } from "@/components/auth/animated-background";
import {
  RoleSelectionCards,
  RoleType
} from "@/components/auth/role-selection-cards";
import { Button } from "@/components/ui/button";

/* ── Fade-up variants ───────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: "easeOut" as const }
});

/* ── Feature tiles ──────────────────────────────────────────────────── */
const features = [
  {
    icon: HeartPulse,
    title: "Daily Recovery Check-ins",
    desc: "Swipeable card questionnaires that feel natural. Patients complete them in under 60 seconds.",
    color: "#34D399"
  },
  {
    icon: Stethoscope,
    title: "Real-Time Clinical Oversight",
    desc: "Doctors monitor every patient's recovery trajectory with risk alerts and trend analytics.",
    color: "#818CF8"
  },
  {
    icon: BarChart3,
    title: "Recovery Intelligence",
    desc: "GitHub-style heatmaps, activity rings, and compliance scores surface the signal in the noise.",
    color: "#60A5FA"
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    desc: "Medication schedules, check-in prompts, and escalation alerts — automated and intelligent.",
    color: "#FBBF24"
  },
  {
    icon: Lock,
    title: "HIPAA Compliant",
    desc: "256-bit encryption, Aadhaar-backed identity, and complete audit trails built in from day one.",
    color: "#A1A1AA"
  },
  {
    icon: Zap,
    title: "Instant Sync",
    desc: "EHR-connected. Patient data syncs across care teams the moment it's submitted.",
    color: "#34D399"
  }
];

const trustBadges = [
  "256-bit encrypted",
  "UIDAI Aadhaar verified",
  "Hospital EHR synced",
  "NABH compliant"
];

export default function Home() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleType | undefined>(
    undefined
  );

  const handleSelectRole = (role: RoleType) => {
    setSelectedRole(role);
    router.push(`/login?role=${role}`);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground">
      <AnimatedBackground />

      {/* ── Nav ───────────────────────────────────────────────────── */}
      <header
        className="glass sticky top-0 z-40 w-full"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-recovery/20 bg-recovery/10">
              <Activity className="h-4 w-4 text-recovery" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Pulse
            </span>
          </Link>

          <div className="hidden items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 sm:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-recovery/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-recovery" />
            </span>
            <span className="text-xs text-text-muted">
              Clinical Discharge Gateway
            </span>
          </div>

          <Button asChild variant="secondary" size="sm">
            <Link href="/login">
              Sign in <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <main className="relative z-10">
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 lg:pb-24 lg:pt-28">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left — copy */}
            <div className="space-y-8">
              <motion.div {...fadeUp(0.1)}>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-text-secondary">
                  <Zap className="h-3 w-3 text-recovery" />
                  Post-Discharge Intelligence Platform
                </span>
              </motion.div>

              <motion.div {...fadeUp(0.18)} className="space-y-4">
                <h1 className="text-5xl font-bold leading-[1.05] tracking-tighter text-foreground lg:text-6xl xl:text-7xl">
                  Recovery,{" "}
                  <span className="gradient-text-green">connected.</span>
                </h1>
                <p className="max-w-md text-base leading-relaxed text-text-secondary">
                  Patients stay seamlessly connected with their clinical team
                  after discharge — through intelligent check-ins, medication
                  tracking, and automated recovery insights.
                </p>
              </motion.div>

              <motion.div
                {...fadeUp(0.26)}
                className="flex flex-wrap items-center gap-4"
              >
                <Button
                  asChild
                  size="lg"
                  variant="recovery"
                  className="rounded-xl px-6"
                >
                  <Link href="/login">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/login?role=doctor">Doctor Login</Link>
                </Button>
              </motion.div>

              <motion.div
                {...fadeUp(0.32)}
                className="flex flex-wrap items-center gap-5"
              >
                {trustBadges.map((b) => (
                  <div
                    key={b}
                    className="flex items-center gap-1.5 text-xs text-text-muted"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-recovery/70" />
                    {b}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — role selector card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <div
                className="rounded-3xl p-7"
                style={{
                  background: "#111113",
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow:
                    "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)"
                }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    Access your portal
                  </h2>
                  <p className="mt-1 text-sm text-text-muted">
                    Select your role to continue.
                  </p>
                </div>

                <RoleSelectionCards
                  selectedRole={selectedRole}
                  onSelectRole={handleSelectRole}
                />

                <p className="mt-6 text-center text-xs text-text-muted">
                  Need help?{" "}
                  <span className="text-text-secondary">
                    Call 1800-PULSE-CARE
                  </span>
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Features grid ─────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              Everything your care team needs
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-text-muted">
              One platform. Three roles. Complete post-discharge care.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  whileHover={{ y: -3 }}
                  className="transition-apple group rounded-2xl p-6"
                  style={{
                    background: "#111113",
                    border: "1px solid rgba(255,255,255,0.06)"
                  }}
                >
                  <div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      background: `${f.color}14`,
                      border: `1px solid ${f.color}28`,
                      color: f.color
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold text-foreground">
                    {f.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-text-muted">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Stats band ────────────────────────────────────────── */}
        <section className="border-t border-white/[0.05] py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { value: "98.4%", label: "Average adherence rate" },
                { value: "< 60s", label: "Daily check-in time" },
                { value: "14 days", label: "Average streak length" },
                { value: "99.9%", label: "Platform uptime" }
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="text-center"
                >
                  <p className="metric-number text-3xl font-bold tracking-tighter text-foreground">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-recovery/10">
              <Activity className="h-3.5 w-3.5 text-recovery" />
            </div>
            <span className="text-xs font-medium text-text-muted">
              Pulse Healthcare Systems
            </span>
          </div>
          <p className="text-xs text-text-muted">
            © 2026 · HIPAA & NABH Compliant
          </p>
        </div>
      </footer>
    </div>
  );
}
