"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Apple,
  Droplets,
  Award,
  ChevronRight,
  Flame,
  ArrowUpRight,
} from "lucide-react";

import { RecoveryRings } from "@/components/healthcare/recovery-rings";
import { RecoveryHeatmap } from "@/components/healthcare/recovery-heatmap";
import { RoleShell } from "@/components/layout/role-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";
import { PatientRecord } from "@/lib/auth";
import { patientNavItems } from "@/lib/patient-nav";

export default function PatientPage() {
  const { user } = useAuth();
  const patient = (user as PatientRecord) || null;

  const name = patient?.name || "Rahul Sharma";
  const doctorName = patient?.assignedDoctor?.name || "Dr. Sarah Jenkins";
  const doctorDept = patient?.assignedDoctor?.department || "Cardiology & Vascular Institute";

  const isCheckedIn = patient?.recoveryStatus?.checkInStatus === "Completed";
  const score = patient?.recoveryStatus?.completionScore || 92;
  const streakDays = patient?.recoveryStatus?.streakDays || 14;
  const lastCheckIn = patient?.recoveryStatus?.lastCheckIn || "Today at 8:15 PM";
  const checkInStatus = patient?.recoveryStatus?.checkInStatus || "Pending";

  const medicationPlan = patient?.medicationPlan || [];
  const takenMeds = medicationPlan.filter((m) => m.morningCompleted || m.afternoonCompleted || m.nightCompleted).length || 2;
  const totalMeds = medicationPlan.length || 3;

  const currentWater = patient?.vitals?.waterIntakeLiters || 1.75;
  const targetWater = patient?.vitals?.waterTargetLiters || 2.5;

  const totalReports = patient?.reports?.length || 5;

  return (
    <RoleShell
      role="patient"
      title={`Welcome back, ${name.split(" ")[0]}`}
      description="Here is your personal post-discharge recovery overview and daily clinical goals."
      navItems={patientNavItems}
    >
      <div className="space-y-6">
        {/* Top Hero Banner: Apple Health & Fitness Style */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
        >
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            {/* Left Column: Concentric Recovery Rings & Score */}
            <div className="flex flex-col sm:flex-row items-center gap-6 lg:col-span-7">
              <RecoveryRings
                score={score}
                medsAdherence={95}
                waterPercent={80}
                size={170}
              />

              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-0.5 text-xs font-bold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Optimal Recovery Zone
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                  {score}% Health Index
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                  Your vital trends, symptom logs, and medication adherence are performing above clinical post-discharge targets.
                </p>

                {/* Ring Indicators Legend */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-[11px] font-semibold">
                  <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Recovery
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Meds Adherence
                  </span>
                  <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" /> Vitals & Water
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Today's Primary Check-in Action */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-800/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${isCheckedIn ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300"}`}>
                    {isCheckedIn ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Daily Check-In</p>
                    <p className="text-[10px] text-slate-500">{lastCheckIn}</p>
                  </div>
                </div>

                <Badge variant={isCheckedIn ? "success" : "warning"}>
                  {checkInStatus}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isCheckedIn
                  ? "Daily check-in completed. Your clinical logs have been reviewed by your cardiologist."
                  : "Complete today's interactive card questionnaire to record your daily symptoms and maintain your streak."}
              </p>

              <Button
                asChild
                className={`w-full rounded-xl font-bold text-xs shadow-sm ${
                  isCheckedIn
                    ? "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                }`}
              >
                <Link href="/patient/check-in">
                  {isCheckedIn ? "Review / Edit Daily Answers" : "Start Daily Check-In"}
                  <ChevronRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* GitHub-style Contribution Calendar & Stats Grid */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Recovery Heatmap */}
          <div className="lg:col-span-8 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <RecoveryHeatmap />
          </div>

          {/* Recovery Level & Streak Widget */}
          <div className="lg:col-span-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Achievement Streak
                </span>
                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-black text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  <Flame className="h-3.5 w-3.5 text-amber-500" /> {streakDays} Days
                </span>
              </div>

              <p className="text-2xl font-black text-slate-900 dark:text-white">
                Gold Recovery Tier
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                You have maintained consistent daily health logs for {streakDays} consecutive days!
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-3.5 dark:border-blue-900/60 dark:bg-blue-950/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-xs font-bold text-blue-900 dark:text-blue-200">840 Wellness Points</p>
                  <p className="text-[10px] text-blue-700 dark:text-blue-300">+20 pts earned today</p>
                </div>
              </div>
              <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Core Vitals & Summary Cards Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Medications */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Medications</span>
              <div className="rounded-xl bg-purple-100 p-2 text-purple-600 dark:bg-purple-950 dark:text-purple-300">
                <Pill className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-xl font-black text-slate-900 dark:text-white">
                {takenMeds} / {totalMeds} Taken
              </p>
              <p className="text-[11px] text-slate-500 font-medium">Next: Aspirin 75mg at 8:00 PM</p>
            </div>
            <Link
              href="/patient/medications"
              className="inline-flex items-center text-[11px] font-bold text-blue-600 hover:underline"
            >
              View Schedule <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          </div>

          {/* Card 2: Diet & Water */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Diet & Hydration</span>
              <div className="rounded-xl bg-cyan-100 p-2 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-300">
                <Droplets className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-xl font-black text-slate-900 dark:text-white">
                {currentWater}L / {targetWater}L Water
              </p>
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <Apple className="h-3 w-3" /> Low-Sodium Diet On Track
              </p>
            </div>
            <Link
              href="/patient/diet"
              className="inline-flex items-center text-[11px] font-bold text-blue-600 hover:underline"
            >
              Diet Plan <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          </div>

          {/* Card 3: Assigned Physician */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Cardiologist</span>
              <div className="rounded-xl bg-blue-100 p-2 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                <Stethoscope className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {doctorName}
              </p>
              <p className="text-[11px] text-slate-500">{doctorDept}</p>
            </div>
            <Link
              href="/patient/timeline"
              className="inline-flex items-center text-[11px] font-bold text-blue-600 hover:underline"
            >
              Consultation Log <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          </div>

          {/* Card 4: Clinical Reports */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">EHR Reports</span>
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-xl font-black text-slate-900 dark:text-white">
                {totalReports} Verified
              </p>
              <p className="text-[11px] text-slate-500">Discharge summary & labs synced</p>
            </div>
            <Link
              href="/patient/reports"
              className="inline-flex items-center text-[11px] font-bold text-blue-600 hover:underline"
            >
              View Documents <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </RoleShell>
  );
}
