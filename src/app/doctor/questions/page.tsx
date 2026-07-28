"use client";

import { RoleShell } from "@/components/layout/role-shell";
import { doctorNavItems } from "@/lib/doctor-nav";

export default function DoctorQuestionsPage() {
  return (
    <RoleShell
      role="doctor"
      title="Question Management"
      description="Configure and manage daily check-in question templates for your patients."
      navItems={doctorNavItems}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
            Question Templates
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Question management interface will be implemented with database
            integration. This section will allow doctors to create, edit, and
            assign question templates to patients.
          </p>
        </div>
      </div>
    </RoleShell>
  );
}
