"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Users,
  Activity,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Clock,
  HeartPulse
} from "lucide-react";
import { RoleShell } from "@/components/layout/role-shell";
import { doctorNavItems } from "@/lib/doctor-nav";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function DoctorPage() {
  return (
    <RoleShell
      role="doctor"
      title="Your Patients"
      description="See how your patients are doing. View trends and concerns."
      navItems={doctorNavItems}
    >
      <div className="space-y-6">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="glass-panel relative overflow-hidden p-6 sm:p-8"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-recovery/30 bg-recovery/10 px-3 py-1 text-xs font-semibold text-recovery"
            >
              <Sparkles className="h-3.5 w-3.5 text-recovery" />
              Cardiology Panel Active
            </motion.div>
            <div className="space-y-1">
              <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                Welcome, Dr. Sarah Jenkins
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-text-secondary">
                Review daily patient submissions, assess clinical recovery
                scores, and manage question templates for your cardiology panel.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Clinical Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="transition-apple p-5 hover:shadow-premium-lg">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-text-secondary">
                  Assigned Patients
                </p>
                <div className="rounded-xl bg-medication/20 p-2 text-medication">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-extrabold text-foreground">28</p>
              <p className="mt-1 text-[11px] font-medium text-recovery">
                Cardiology & Post-Surgical
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <GlassCard className="transition-apple p-5 hover:shadow-premium-lg">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-text-secondary">
                  Today&apos;s Check-ins
                </p>
                <div className="rounded-xl bg-sleep/20 p-2 text-sleep">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-extrabold text-foreground">
                22 / 28
              </p>
              <p className="mt-1 text-[11px] font-medium text-primary">
                78.5% submission rate
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="transition-apple p-5 hover:shadow-premium-lg">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-text-secondary">
                  High Risk Alerts
                </p>
                <div className="rounded-xl bg-warning/20 p-2 text-warning">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-extrabold text-warning">1</p>
              <p className="mt-1 text-[11px] font-medium text-warning">
                Requires follow-up review
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <GlassCard className="transition-apple p-5 hover:shadow-premium-lg">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-text-secondary">
                  Avg Panel Adherence
                </p>
                <div className="rounded-xl bg-recovery/20 p-2 text-recovery">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-extrabold text-foreground">
                94.2%
              </p>
              <p className="mt-1 text-[11px] font-medium text-success">
                High engagement
              </p>
            </GlassCard>
          </motion.div>
        </div>

        {/* Pending Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-heart/20 p-2 text-heart">
                <HeartPulse className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Pending Reviews
                </h3>
                <p className="text-[11px] text-text-secondary">
                  6 patients awaiting clinical review
                </p>
              </div>
            </div>
            <Link
              href="/doctor/patients"
              className="transition-apple-fast flex items-center gap-1 text-xs font-semibold text-recovery hover:text-recovery/80"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {[
              {
                name: "Rahul Sharma",
                condition: "Post-Coronary Stent",
                status: "Deteriorating",
                time: "2h ago"
              },
              {
                name: "Avery Chen",
                condition: "Hypertension Management",
                status: "Stable",
                time: "4h ago"
              },
              {
                name: "Jordan Lee",
                condition: "Cardiac Rehabilitation",
                status: "Improving",
                time: "5h ago"
              }
            ].map((patient, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.05 }}
                whileHover={{ scale: 1.01 }}
                className="transition-apple flex cursor-pointer items-center justify-between rounded-xl border border-border/50 bg-background-elevated/30 p-3 hover:bg-background-elevated/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-recovery to-medication text-xs font-bold text-background shadow-premium-md">
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      {patient.name}
                    </p>
                    <p className="text-[10px] text-text-secondary">
                      {patient.condition}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      patient.status === "Deteriorating"
                        ? "danger"
                        : patient.status === "Improving"
                          ? "recovery"
                          : "default"
                    }
                  >
                    {patient.status}
                  </Badge>
                  <span className="flex items-center gap-1 text-[10px] text-text-secondary">
                    <Clock className="h-3 w-3" /> {patient.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </RoleShell>
  );
}
