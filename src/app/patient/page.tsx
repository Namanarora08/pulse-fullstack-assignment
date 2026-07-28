"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Pill,
  Droplets,
  Flame,
  Award,
  ChevronRight,
  Stethoscope,
  ArrowUpRight,
  Moon,
  Activity,
  Sparkles
} from "lucide-react";

import { RecoveryRings } from "@/components/healthcare/recovery-rings";
import { RecoveryHeatmap } from "@/components/healthcare/recovery-heatmap";
import { RoleShell } from "@/components/layout/role-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";
import { PatientRecord } from "@/lib/auth";
import { patientNavItems } from "@/lib/patient-nav";

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: {
    delay: 0.1 + i * 0.07,
    duration: 0.45,
    ease: "easeOut" as const
  }
});

/* ── Small metric card ─────────────────────────────────────────────── */
function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  href,
  delay = 0
}: {
  label: string;
  value: string;
  sub: string;
  icon: typeof Activity;
  color: string;
  href?: string;
  delay?: number;
}) {
  const inner = (
    <motion.div
      {...stagger(delay)}
      whileHover={{ y: -2 }}
      className="transition-apple group flex cursor-pointer flex-col gap-4 rounded-2xl p-5"
      style={{
        background: "#111113",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
      }}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-text-muted">{label}</span>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{
            background: `${color}12`,
            border: `1px solid ${color}22`,
            color
          }}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div>
        <p className="metric-number text-2xl font-bold leading-none tracking-tighter text-foreground">
          {value}
        </p>
        <p className="mt-1.5 text-xs leading-snug text-text-muted">{sub}</p>
      </div>
      {href && (
        <div
          className="transition-apple-fast flex items-center gap-1 text-[11px] font-medium"
          style={{ color }}
        >
          View details <ArrowUpRight className="h-3 w-3" />
        </div>
      )}
    </motion.div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function PatientPage() {
  const { user } = useAuth();
  const patient = (user as PatientRecord) || null;

  const name = patient?.name || "Rahul Sharma";
  const firstName = name.split(" ")[0];
  const doctorName = patient?.assignedDoctor?.name || "Dr. Sarah Jenkins";
  const doctorDept =
    patient?.assignedDoctor?.department || "Cardiology & Vascular Institute";

  const isCheckedIn = patient?.recoveryStatus?.checkInStatus === "Completed";
  const score = patient?.recoveryStatus?.completionScore || 92;
  const streakDays = patient?.recoveryStatus?.streakDays || 14;
  const lastCheckIn =
    patient?.recoveryStatus?.lastCheckIn || "Today at 8:15 PM";
  const checkInStatus = patient?.recoveryStatus?.checkInStatus || "Pending";

  const medicationPlan = patient?.medicationPlan || [];
  const takenMeds =
    medicationPlan.filter(
      (m) => m.morningCompleted || m.afternoonCompleted || m.nightCompleted
    ).length || 2;
  const totalMeds = medicationPlan.length || 3;

  const currentWater = patient?.vitals?.waterIntakeLiters || 1.75;
  const targetWater = patient?.vitals?.waterTargetLiters || 2.5;
  const waterPct = Math.round((currentWater / targetWater) * 100);

  return (
    <RoleShell
      role="patient"
      title={`Welcome back, ${firstName}`}
      description="Your recovery progress."
      navItems={patientNavItems}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        {/* ── Hero — recovery rings + check-in ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="grid gap-5 rounded-3xl p-6 lg:grid-cols-12 lg:p-8"
          style={{
            background: "#0D0D0F",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.6)"
          }}
        >
          {/* Rings column */}
          <div className="flex flex-col items-center gap-6 sm:flex-row lg:col-span-7">
            <RecoveryRings
              score={score}
              medsAdherence={
                Math.round((takenMeds / Math.max(totalMeds, 1)) * 100) || 95
              }
              waterPercent={waterPct}
              size={188}
            />

            <div className="space-y-4 text-center sm:text-left">
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-recovery/8 inline-flex items-center gap-1.5 rounded-full border border-recovery/20 px-3 py-1 text-xs font-medium text-recovery"
              >
                <CheckCircle2 className="h-3 w-3" />
                Looking good
              </motion.div>

              <div>
                <h2 className="metric-number text-4xl font-bold leading-none tracking-tighter text-foreground">
                  {score}
                  <span className="text-xl font-normal text-text-muted">
                    /100
                  </span>
                </h2>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-secondary">
                  You're on track. Keep up with your meds and check-ins.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium">
                {[
                  { color: "#34D399", label: "Recovery" },
                  { color: "#818CF8", label: "Medications" },
                  { color: "#22D3EE", label: "Hydration" }
                ].map((l) => (
                  <span
                    key={l.label}
                    className="flex items-center gap-1.5"
                    style={{ color: l.color }}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: l.color }}
                    />
                    {l.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Check-in column */}
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-col justify-between space-y-4 rounded-2xl p-5 lg:col-span-5"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)"
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background: isCheckedIn
                      ? "rgba(52,211,153,0.12)"
                      : "rgba(251,191,36,0.12)",
                    color: isCheckedIn ? "#34D399" : "#FBBF24"
                  }}
                >
                  {isCheckedIn ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Clock className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Daily Check-In
                  </p>
                  <p className="text-[11px] text-text-muted">{lastCheckIn}</p>
                </div>
              </div>
              <Badge variant={isCheckedIn ? "recovery" : "warning"}>
                {checkInStatus}
              </Badge>
            </div>

            <p className="text-xs leading-relaxed text-text-secondary">
              {isCheckedIn
                ? "Check-in complete. Your cardiologist has been notified of today's readings."
                : "Complete today's swipeable questionnaire to log symptoms and maintain your streak."}
            </p>

            {/* Streak pill */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0px rgba(251,191,36,0)",
                  "0 0 20px rgba(251,191,36,0.20)",
                  "0 0 0px rgba(251,191,36,0)"
                ]
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="flex items-center gap-2 rounded-xl px-3.5 py-2.5"
              style={{
                background: "rgba(251,191,36,0.08)",
                border: "1px solid rgba(251,191,36,0.20)"
              }}
            >
              <Flame className="h-4 w-4 text-warning" />
              <span className="text-sm font-bold text-warning">
                {streakDays}-day streak
              </span>
              <span className="ml-auto text-[11px] text-text-muted">
                Keep it going!
              </span>
            </motion.div>

            <Button
              asChild
              variant={isCheckedIn ? "secondary" : "recovery"}
              className="w-full"
            >
              <Link href="/patient/check-in">
                {isCheckedIn ? "Review answers" : "Start check-in"}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* ── Heatmap + Achievement ── */}
        <div className="grid gap-5 lg:grid-cols-12">
          <motion.div
            {...stagger(3)}
            className="rounded-3xl p-6 lg:col-span-8"
            style={{
              background: "#0D0D0F",
              border: "1px solid rgba(255,255,255,0.06)"
            }}
          >
            <RecoveryHeatmap />
          </motion.div>

          <motion.div
            {...stagger(4)}
            className="flex flex-col justify-between space-y-5 rounded-3xl p-6 lg:col-span-4"
            style={{
              background: "#0D0D0F",
              border: "1px solid rgba(255,255,255,0.06)"
            }}
          >
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
                Achievement
              </p>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                Gold Recovery
              </p>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                {streakDays} consecutive days of complete health logs.
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="flex items-center justify-between rounded-2xl p-4"
              style={{
                background: "rgba(52,211,153,0.07)",
                border: "1px solid rgba(52,211,153,0.18)"
              }}
            >
              <div className="flex items-center gap-2.5">
                <Award className="h-5 w-5 text-recovery" />
                <div>
                  <p className="text-sm font-bold text-recovery">840 pts</p>
                  <p className="text-[10px] text-recovery/60">+20 today</p>
                </div>
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-recovery/70">
                Gold
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Metric cards ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            delay={5}
            label="Medications"
            icon={Pill}
            color="#818CF8"
            value={`${takenMeds}/${totalMeds}`}
            sub="Next: Aspirin 75mg at 8 PM"
            href="/patient/medications"
          />
          <MetricCard
            delay={6}
            label="Hydration"
            icon={Droplets}
            color="#22D3EE"
            value={`${currentWater}L`}
            sub={`Target: ${targetWater}L · ${waterPct}% complete`}
            href="/patient/diet"
          />
          <MetricCard
            delay={7}
            label="Sleep"
            icon={Moon}
            color="#818CF8"
            value="7h 20m"
            sub="Good quality · REM 22%"
          />
          <MetricCard
            delay={8}
            label="Assigned Doctor"
            icon={Stethoscope}
            color="#34D399"
            value={doctorName.replace("Dr. ", "Dr.")}
            sub={doctorDept}
          />
        </div>
      </div>
    </RoleShell>
  );
}
