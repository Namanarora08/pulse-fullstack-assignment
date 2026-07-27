"use client";

import {
  Activity,
  ClipboardList,
  LayoutDashboard,
  Sparkles,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import { RoleShell } from "@/components/layout/role-shell";

const doctorNavItems = [
  { href: "/doctor", label: "Overview", icon: LayoutDashboard },
  { href: "/doctor/patients", label: "Patient Queue", icon: UsersRound, badge: "4 Review" },
  { href: "/doctor/questions", label: "Question Engine", icon: ClipboardList },
  { href: "/doctor/analytics", label: "Recovery Trends", icon: Activity },
];

export default function DoctorPage() {
  return (
    <RoleShell
      role="doctor"
      title="Doctor Dashboard Coming Next"
      description="Clinical overview workspace. Ready for patient review queues, risk analysis, and question template customization."
      navItems={doctorNavItems}
    >
      <div className="space-y-6">
        {/* Clean Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/60 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Doctor Workspace Active
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Welcome, Dr. Sarah Jenkins
            </h2>
            <p className="max-w-xl text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:text-sm">
              Review daily patient submissions, assess clinical recovery scores, and manage question templates for your cardiology panel.
            </p>
          </div>
        </div>

        {/* Clinical Stats Preview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Assigned Patients</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">28</p>
            <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">Cardiology & Post-Surgical</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Today&apos;s Check-ins</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">22 / 28</p>
            <p className="mt-1 text-[11px] text-blue-600 dark:text-blue-400">78.5% submission rate</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">High Risk Alerts</p>
            <p className="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400">1</p>
            <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">Requires follow-up review</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Avg Panel Adherence</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">94.2%</p>
            <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">High engagement</p>
          </div>
        </div>

        {/* Integration Slot */}
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-100/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/30">
          <Stethoscope className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          <h3 className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-300">
            Doctor Clinical Summary & Patient Queue Module Slot
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            This workspace area is reserved for clinical summaries, upcoming follow-ups, and interactive patient questionnaires.
          </p>
        </div>
      </div>
    </RoleShell>
  );
}
