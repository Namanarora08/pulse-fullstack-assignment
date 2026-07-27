"use client";

import { useState } from "react";
import {
  Shield,
  Users,
  Stethoscope,
  ShieldAlert,
} from "lucide-react";
import { RoleShell } from "@/components/layout/role-shell";
import { useAdmin } from "@/components/admin/admin-context";
import { adminNavItems } from "@/lib/admin-nav";

export default function AdminRolesPage() {
  const { roles, updateRolePermission } = useAdmin();
  const [successMsg, setSuccessMsg] = useState("");

  const permissionLabels: Record<string, string> = {
    viewMedicalRecords: "View Patient Medical Records & Vitals",
    editPatientPlans: "Edit Patient Treatment Plans & Prescriptions",
    uploadReports: "Upload Clinical Reports & Test Results",
    manageTemplates: "Manage Disease Question Templates & Protocols",
    auditAccess: "Access System Audit & Compliance Logs",
    manageUsers: "Manage System Users & Role Permissions",
  };

  const handleToggle = (roleName: "patient" | "doctor" | "admin", permKey: string, currentValue: boolean) => {
    updateRolePermission(roleName, permKey, !currentValue);
    setSuccessMsg(`Updated permission '${permissionLabels[permKey] || permKey}' for ${roleName.toUpperCase()}`);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  return (
    <RoleShell
      role="admin"
      title="Role & Access Control Governance"
      description="Define granular platform access permissions across Patient, Doctor, and Administrator system roles."
      navItems={adminNavItems}
    >
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              System Roles & Access Rules ({roles.length} Roles)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Role-based access control (RBAC) rules enforced across API routes and portal views.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
            <Shield className="h-4 w-4" /> RBAC Policy Active
          </div>
        </div>

        {successMsg && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-300">
            {successMsg}
          </div>
        )}

        {/* Roles Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {roles.map((r) => {
            const Icon = r.role === "admin" ? ShieldAlert : r.role === "doctor" ? Stethoscope : Users;

            return (
              <div
                key={r.role}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-xl p-3 ${
                          r.role === "admin"
                            ? "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300"
                            : r.role === "doctor"
                            ? "bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300"
                            : "bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base capitalize">
                          {r.displayName}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono">
                          {r.userCount} active users
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Permissions List */}
                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <p className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                      Configured Permissions
                    </p>

                    <div className="space-y-2">
                      {Object.entries(r.permissions).map(([permKey, isAllowed]) => (
                        <div
                          key={permKey}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs"
                        >
                          <span className="text-slate-700 dark:text-slate-300 font-medium text-[11px] pr-2">
                            {permissionLabels[permKey] || permKey}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleToggle(r.role, permKey, isAllowed)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors shrink-0 ${
                              isAllowed
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {isAllowed ? "Allowed" : "Denied"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                  Route Protection: <strong className="text-slate-700 dark:text-slate-300">/app/{r.role}{"/*"}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </RoleShell>
  );
}
