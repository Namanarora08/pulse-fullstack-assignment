"use client";

import { RoleShell } from "@/components/layout/role-shell";
import { doctorNavItems } from "@/lib/doctor-nav";

export default function DoctorAnalyticsPage() {
  return (
    <RoleShell
      role="doctor"
      title="Patient Analytics"
      description="View recovery trends, risk analysis, and clinical metrics across your patient panel."
      navItems={doctorNavItems}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
            Recovery Trends Dashboard
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Analytics visualization will be implemented with database
            integration. This section will display patient recovery scores,
            symptom trends, and adherence metrics.
          </p>
        </div>
      </div>
    </RoleShell>
  );
}
