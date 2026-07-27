"use client";

import {
  Calendar,
  CheckCircle2,
  Clock,
  Check,
  Activity,
} from "lucide-react";
import { RoleShell } from "@/components/layout/role-shell";
import { useAuth } from "@/components/auth/auth-context";
import { PatientRecord } from "@/lib/auth";
import { patientNavItems } from "@/lib/patient-nav";

export default function PatientTimelinePage() {
  const { user } = useAuth();
  const patient = (user as PatientRecord) || null;

  const timeline = patient?.timeline || [];
  const doctor = patient?.assignedDoctor?.name || "Dr. Sarah Jenkins";

  return (
    <RoleShell
      role="patient"
      title="Recovery Timeline & Milestones"
      description="Clinical care trajectory from hospital admission through active rehabilitation."
      navItems={patientNavItems}
    >
      <div className="space-y-6">
        {/* Header Summary */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300">
              <Activity className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Phase 2 Cardiac Rehabilitation
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Clinical Recovery Pathway
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monitored by <strong>{doctor}</strong>.
            </p>
          </div>
        </div>

        {/* Timeline Sequence */}
        <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 md:ml-8 space-y-8 py-2">
          {timeline.map((item, index) => (
            <div key={item.id} className="relative pl-6 md:pl-8 group">
              {/* Timeline Indicator Dot */}
              <div
                className={`absolute -left-[17px] top-0 h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  item.completed
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-white border-blue-600 text-blue-600 dark:bg-slate-900"
                }`}
              >
                {item.completed ? (
                  <Check className="h-4 w-4 stroke-[3]" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>

              {/* Card Container */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Stage: {item.stage}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {item.date}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      item.completed
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                    }`}
                  >
                    {item.completed ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" /> Stage Completed
                      </>
                    ) : (
                      <>
                        <Clock className="h-3.5 w-3.5" /> Scheduled Milestone
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RoleShell>
  );
}
