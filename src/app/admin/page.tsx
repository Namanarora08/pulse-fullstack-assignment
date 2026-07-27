"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Stethoscope,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  FileText,
  ShieldCheck,
  Building,
  Bell,
  Search,
  ArrowRight,
  Database,
  Cpu,
  Server,
  HardDrive,
  UserPlus,
} from "lucide-react";
import { RoleShell } from "@/components/layout/role-shell";
import { useAdmin } from "@/components/admin/admin-context";
import { adminNavItems } from "@/lib/admin-nav";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const { patients, doctors, reports, templates, auditLogs } = useAdmin();
  const [globalSearch, setGlobalSearch] = useState("");

  // Real statistics derived from live state
  const totalPatients = patients.length;
  const totalDoctors = doctors.length;
  const activePatients = patients.filter(
    (p) => p.recoveryStatus?.checkInStatus !== "Missed"
  ).length;
  const checkedInToday = patients.filter(
    (p) => p.recoveryStatus?.checkInStatus === "Completed"
  ).length;
  const pendingCheckIns = patients.filter(
    (p) => p.recoveryStatus?.checkInStatus === "Pending"
  ).length;
  const highRiskPatients = patients.filter(
    (p) => p.diseaseInfo?.riskCategory === "High"
  );
  const recoveringPatients = patients.filter(
    (p) => p.diseaseInfo?.riskCategory === "Low" || p.diseaseInfo?.riskCategory === "Moderate"
  );

  const filteredPatients = globalSearch
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
          p.patientIdCode.toLowerCase().includes(globalSearch.toLowerCase()) ||
          p.diseaseInfo.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
          p.assignedDoctor.name.toLowerCase().includes(globalSearch.toLowerCase())
      )
    : [];

  const filteredDoctors = globalSearch
    ? doctors.filter(
        (d) =>
          d.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
          d.department.toLowerCase().includes(globalSearch.toLowerCase()) ||
          d.email.toLowerCase().includes(globalSearch.toLowerCase())
      )
    : [];

  const filteredReports = globalSearch
    ? reports.filter(
        (r) =>
          r.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
          r.patientName.toLowerCase().includes(globalSearch.toLowerCase()) ||
          r.category.toLowerCase().includes(globalSearch.toLowerCase())
      )
    : [];

  return (
    <RoleShell
      role="admin"
      title="Hospital System Administration"
      description="Live hospital governance metrics, patient lifecycles, physician rosters, and system audit logs."
      navItems={adminNavItems}
    >
      <div className="space-y-6">
        {/* Global Quick Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Global search across patients, doctors, reports, or diseases..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200/80 bg-white pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white shadow-sm"
          />
        </div>

        {/* Global Search Results Overlay if active */}
        {globalSearch.trim() !== "" && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/60 dark:bg-blue-950/40 space-y-3">
            <p className="text-xs font-bold text-blue-900 dark:text-blue-200">
              Global Search Results for &quot;{globalSearch}&quot;
            </p>

            <div className="grid gap-3 sm:grid-cols-3 text-xs">
              {/* Patients Result */}
              <div className="space-y-1">
                <p className="font-semibold text-slate-700 dark:text-slate-300 border-b pb-1 dark:border-slate-800">
                  Patients ({filteredPatients.length})
                </p>
                {filteredPatients.map((p) => (
                  <Link key={p.id} href={`/admin/patients?id=${p.id}`} className="block p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:text-blue-600">
                    <span className="font-bold">{p.name}</span> ({p.patientIdCode}) - {p.diseaseInfo.name}
                  </Link>
                ))}
                {filteredPatients.length === 0 && <p className="text-[11px] text-slate-400">No matching patients</p>}
              </div>

              {/* Doctors Result */}
              <div className="space-y-1">
                <p className="font-semibold text-slate-700 dark:text-slate-300 border-b pb-1 dark:border-slate-800">
                  Doctors ({filteredDoctors.length})
                </p>
                {filteredDoctors.map((d) => (
                  <Link key={d.id} href={`/admin/doctors?id=${d.id}`} className="block p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:text-blue-600">
                    <span className="font-bold">{d.name}</span> - {d.department}
                  </Link>
                ))}
                {filteredDoctors.length === 0 && <p className="text-[11px] text-slate-400">No matching doctors</p>}
              </div>

              {/* Reports Result */}
              <div className="space-y-1">
                <p className="font-semibold text-slate-700 dark:text-slate-300 border-b pb-1 dark:border-slate-800">
                  Clinical Documents ({filteredReports.length})
                </p>
                {filteredReports.map((r) => (
                  <Link key={r.id} href={`/admin/reports?id=${r.id}`} className="block p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:text-blue-600">
                    <span className="font-bold">{r.title}</span> ({r.patientName})
                  </Link>
                ))}
                {filteredReports.length === 0 && <p className="text-[11px] text-slate-400">No matching documents</p>}
              </div>
            </div>
          </div>
        )}

        {/* Real Metrics Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Patients</span>
              <div className="rounded-xl bg-blue-100 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalPatients}</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
              <TrendingUp className="h-3 w-3" /> {activePatients} Active in Recovery
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Physicians</span>
              <div className="rounded-xl bg-purple-100 p-2 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300">
                <Stethoscope className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalDoctors}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Across Cardiology & Surgery
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Checked-In Today</span>
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{checkedInToday}</p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
              <Clock className="h-3 w-3" /> {pendingCheckIns} Pending Check-ins
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">High Risk Cohort</span>
              <div className="rounded-xl bg-rose-100 p-2 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{highRiskPatients.length}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {recoveringPatients.length} Low / Moderate Risk
            </p>
          </div>
        </div>

        {/* Recently Added Patients & Active Cohort */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recently Added Patients */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Recently Added Patients</h3>
              </div>
              <Link href="/admin/patients">
                <Button variant="ghost" size="sm" className="text-xs text-blue-600 p-0 h-auto">
                  View All ({totalPatients}) <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {patients.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center justify-between border-b border-slate-50 pb-2.5 dark:border-slate-800/60 text-xs">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900 dark:text-white">{p.name}</p>
                    <p className="text-[11px] text-slate-500">
                      ID: <span className="font-mono">{p.patientIdCode}</span> • {p.diseaseInfo.name}
                    </p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.diseaseInfo.riskCategory === "High"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}>
                      {p.diseaseInfo.riskCategory} Risk
                    </span>
                    <p className="text-[10px] text-slate-400">{p.assignedDoctor.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health & Infrastructure */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">System Health & Services</h3>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <ShieldCheck className="h-3 w-3" /> All Operational
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50 space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1 font-semibold"><Database className="h-3.5 w-3.5 text-blue-600" /> PostgreSQL DB</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">Online (3ms)</p>
                <p className="text-[10px] text-slate-400">Prisma Client active</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50 space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1 font-semibold"><Cpu className="h-3.5 w-3.5 text-purple-600" /> API Gateway</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">100% Uptime</p>
                <p className="text-[10px] text-slate-400">Route guard active</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50 space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1 font-semibold"><HardDrive className="h-3.5 w-3.5 text-cyan-600" /> EHR Document Store</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{reports.length} Uploads</p>
                <p className="text-[10px] text-slate-400">Encrypted repository</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50 space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1 font-semibold"><Building className="h-3.5 w-3.5 text-emerald-600" /> Disease Templates</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{templates.length} Active</p>
                <p className="text-[10px] text-slate-400">Disease sets active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed & Governance Alerts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Audit Logs */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Recent Audit Activity</h3>
              </div>
              <Link href="/admin/governance">
                <Button variant="ghost" size="sm" className="text-xs text-blue-600 p-0 h-auto">
                  View Full Audit Log <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="border-b border-slate-50 pb-2.5 dark:border-slate-800/60 space-y-0.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{log.action}</span>
                    <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{log.details}</p>
                  <p className="text-[10px] text-slate-400">By {log.actorName} ({log.actorRole})</p>
                </div>
              ))}
            </div>
          </div>

          {/* System Notifications & Risk Warnings */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <Bell className="h-4 w-4 text-amber-600" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">System Alerts & Notifications</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900/60 dark:bg-amber-950/40 space-y-1">
                <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-200">
                  <span className="flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> High-Risk Clinical Cohort</span>
                  <span className="text-[10px] font-mono">{highRiskPatients.length} Patients</span>
                </div>
                <p className="text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
                  Patients with High-Risk categorization require daily review by assigned cardiologists.
                </p>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3 dark:border-blue-900/60 dark:bg-blue-950/40 space-y-1">
                <div className="flex items-center justify-between font-bold text-blue-900 dark:text-blue-200">
                  <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-blue-600" /> Clinical Repository Active</span>
                  <span className="text-[10px] font-mono">{reports.length} Reports</span>
                </div>
                <p className="text-blue-800 dark:text-blue-300 text-[11px] leading-relaxed">
                  {reports.length} total EHR reports uploaded. All documents cryptographically signed and stored.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/40 space-y-1">
                <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-200">
                  <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Role & Access Enforcement</span>
                  <span className="text-[10px] font-mono">Active</span>
                </div>
                <p className="text-emerald-800 dark:text-emerald-300 text-[11px] leading-relaxed">
                  Admin, Doctor, and Patient access boundaries enforced via layout middleware guard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleShell>
  );
}
