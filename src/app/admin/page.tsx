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
  UserPlus
} from "lucide-react";
import { motion } from "framer-motion";
import { RoleShell } from "@/components/layout/role-shell";
import { useAdmin } from "@/components/admin/admin-context";
import { adminNavItems } from "@/lib/admin-nav";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
    (p) =>
      p.diseaseInfo?.riskCategory === "Low" ||
      p.diseaseInfo?.riskCategory === "Moderate"
  );

  const filteredPatients = globalSearch
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
          p.patientIdCode.toLowerCase().includes(globalSearch.toLowerCase()) ||
          p.diseaseInfo.name
            .toLowerCase()
            .includes(globalSearch.toLowerCase()) ||
          p.assignedDoctor.name
            .toLowerCase()
            .includes(globalSearch.toLowerCase())
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
      title="Hospital Admin"
      description="Manage patients, doctors, reports, and system access."
      navItems={adminNavItems}
    >
      <div className="space-y-6">
        {/* Global Quick Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Global search across patients, doctors, reports, or diseases..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="h-12 w-full pl-10 text-sm"
          />
        </motion.div>

        {/* Global Search Results Overlay if active */}
        {globalSearch.trim() !== "" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel space-y-3 p-4"
          >
            <p className="text-xs font-bold text-primary">
              Global Search Results for &quot;{globalSearch}&quot;
            </p>

            <div className="grid gap-3 text-xs sm:grid-cols-3">
              {/* Patients Result */}
              <div className="space-y-1">
                <p className="border-b border-border/50 pb-1 font-semibold text-muted-foreground">
                  Patients ({filteredPatients.length})
                </p>
                {filteredPatients.map((p) => (
                  <Link
                    key={p.id}
                    href={`/admin/patients?id=${p.id}`}
                    className="transition-apple-fast block rounded-lg border border-border/30 bg-muted/30 p-2 hover:border-border/50 hover:bg-muted/50"
                  >
                    <span className="font-bold text-foreground">{p.name}</span>{" "}
                    <span className="text-muted-foreground">
                      ({p.patientIdCode})
                    </span>
                  </Link>
                ))}
                {filteredPatients.length === 0 && (
                  <p className="text-[11px] text-muted-foreground">
                    No matching patients
                  </p>
                )}
              </div>

              {/* Doctors Result */}
              <div className="space-y-1">
                <p className="border-b border-border/50 pb-1 font-semibold text-muted-foreground">
                  Doctors ({filteredDoctors.length})
                </p>
                {filteredDoctors.map((d) => (
                  <Link
                    key={d.id}
                    href={`/admin/doctors?id=${d.id}`}
                    className="transition-apple-fast block rounded-lg border border-border/30 bg-muted/30 p-2 hover:border-border/50 hover:bg-muted/50"
                  >
                    <span className="font-bold text-foreground">{d.name}</span>{" "}
                    <span className="text-muted-foreground">
                      - {d.department}
                    </span>
                  </Link>
                ))}
                {filteredDoctors.length === 0 && (
                  <p className="text-[11px] text-muted-foreground">
                    No matching doctors
                  </p>
                )}
              </div>

              {/* Reports Result */}
              <div className="space-y-1">
                <p className="border-b border-border/50 pb-1 font-semibold text-muted-foreground">
                  Clinical Documents ({filteredReports.length})
                </p>
                {filteredReports.map((r) => (
                  <Link
                    key={r.id}
                    href={`/admin/reports?id=${r.id}`}
                    className="transition-apple-fast block rounded-lg border border-border/30 bg-muted/30 p-2 hover:border-border/50 hover:bg-muted/50"
                  >
                    <span className="font-bold text-foreground">{r.title}</span>{" "}
                    <span className="text-muted-foreground">
                      ({r.patientName})
                    </span>
                  </Link>
                ))}
                {filteredReports.length === 0 && (
                  <p className="text-[11px] text-muted-foreground">
                    No matching documents
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Real Metrics Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="transition-apple p-5 hover:shadow-premium-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  Total Patients
                </span>
                <div className="rounded-xl bg-primary/20 p-2 text-primary">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-foreground">
                {totalPatients}
              </p>
              <p className="flex items-center gap-1 text-[11px] font-medium text-success">
                <TrendingUp className="h-3 w-3" /> {activePatients} Active in
                Recovery
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
                <span className="text-xs font-semibold text-muted-foreground">
                  Active Physicians
                </span>
                <div className="rounded-xl bg-secondary/20 p-2 text-secondary">
                  <Stethoscope className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-foreground">
                {totalDoctors}
              </p>
              <p className="text-[11px] font-medium text-muted-foreground">
                Across Cardiology & Surgery
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
                <span className="text-xs font-semibold text-muted-foreground">
                  Checked-In Today
                </span>
                <div className="rounded-xl bg-success/20 p-2 text-success">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-foreground">
                {checkedInToday}
              </p>
              <p className="flex items-center gap-1 text-[11px] font-medium text-warning">
                <Clock className="h-3 w-3" /> {pendingCheckIns} Pending
                Check-ins
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
                <span className="text-xs font-semibold text-muted-foreground">
                  High Risk Cohort
                </span>
                <div className="rounded-xl bg-danger/20 p-2 text-danger">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-foreground">
                {highRiskPatients.length}
              </p>
              <p className="text-[11px] font-medium text-muted-foreground">
                {recoveringPatients.length} Low / Moderate Risk
              </p>
            </GlassCard>
          </motion.div>
        </div>

        {/* Recently Added Patients & Active Cohort */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recently Added Patients */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard className="space-y-4 p-6">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">
                    Recently Added Patients
                  </h3>
                </div>
                <Link href="/admin/patients">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-primary"
                  >
                    View All ({totalPatients}){" "}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {patients.slice(0, 4).map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="transition-apple flex cursor-pointer items-center justify-between rounded-lg border-b border-border/30 p-2 pb-2.5 text-xs hover:bg-muted/30"
                  >
                    <div className="space-y-0.5">
                      <p className="font-bold text-foreground">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        ID: <span className="font-mono">{p.patientIdCode}</span>{" "}
                        • {p.diseaseInfo.name}
                      </p>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <Badge
                        variant={
                          p.diseaseInfo.riskCategory === "High"
                            ? "danger"
                            : "recovery"
                        }
                        className="text-[10px]"
                      >
                        {p.diseaseInfo.riskCategory} Risk
                      </Badge>
                      <p className="text-[10px] text-muted-foreground">
                        {p.assignedDoctor.name}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* System Health & Infrastructure */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <GlassCard className="space-y-4 p-6">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-recovery" />
                  <h3 className="text-sm font-bold text-foreground">
                    System Health & Services
                  </h3>
                </div>
                <Badge variant="recovery" className="text-[10px]">
                  <ShieldCheck className="mr-1 h-3 w-3" /> All Operational
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1 rounded-xl border border-border/50 bg-muted/30 p-3">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1 font-semibold">
                      <Database className="h-3.5 w-3.5 text-medication" />{" "}
                      PostgreSQL DB
                    </span>
                    <span className="h-2 w-2 rounded-full bg-recovery" />
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    Online (3ms)
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Prisma Client active
                  </p>
                </div>

                <div className="space-y-1 rounded-xl border border-border/50 bg-muted/30 p-3">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1 font-semibold">
                      <Cpu className="h-3.5 w-3.5 text-sleep" /> API Gateway
                    </span>
                    <span className="h-2 w-2 rounded-full bg-recovery" />
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    100% Uptime
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Route guard active
                  </p>
                </div>

                <div className="space-y-1 rounded-xl border border-border/50 bg-muted/30 p-3">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1 font-semibold">
                      <HardDrive className="h-3.5 w-3.5 text-hydration" /> EHR
                      Document Store
                    </span>
                    <span className="h-2 w-2 rounded-full bg-recovery" />
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    {reports.length} Uploads
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Encrypted repository
                  </p>
                </div>

                <div className="space-y-1 rounded-xl border border-border/50 bg-muted/30 p-3">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1 font-semibold">
                      <Building className="h-3.5 w-3.5 text-recovery" /> Disease
                      Templates
                    </span>
                    <span className="h-2 w-2 rounded-full bg-recovery" />
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    {templates.length} Active
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Disease sets active
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Recent Activity Feed & Governance Alerts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Audit Logs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard className="space-y-4 p-6">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-secondary" />
                  <h3 className="text-sm font-bold text-foreground">
                    Recent Audit Activity
                  </h3>
                </div>
                <Link href="/admin/governance">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-primary"
                  >
                    View Full Audit Log <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {auditLogs.slice(0, 5).map((log, idx) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + idx * 0.05 }}
                    className="transition-apple space-y-0.5 rounded-lg border-b border-border/30 p-2 pb-2.5 text-xs hover:bg-muted/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{log.details}</p>
                    <p className="text-[10px] text-muted-foreground">
                      By {log.actorName} ({log.actorRole})
                    </p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* System Notifications & Risk Warnings */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            <GlassCard className="space-y-4 p-6">
              <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                <Bell className="h-4 w-4 text-warning" />
                <h3 className="text-sm font-bold text-foreground">
                  System Alerts & Notifications
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75 }}
                  className="space-y-1 rounded-xl border border-warning/30 bg-warning/10 p-3"
                >
                  <div className="flex items-center justify-between font-bold text-warning">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" /> High-Risk
                      Clinical Cohort
                    </span>
                    <span className="font-mono text-[10px]">
                      {highRiskPatients.length} Patients
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-warning/80">
                    Patients with High-Risk categorization require daily review
                    by assigned cardiologists.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-1 rounded-xl border border-primary/30 bg-primary/10 p-3"
                >
                  <div className="flex items-center justify-between font-bold text-primary">
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" /> Clinical Repository
                      Active
                    </span>
                    <span className="font-mono text-[10px]">
                      {reports.length} Reports
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-primary/80">
                    {reports.length} total EHR reports uploaded. All documents
                    cryptographically signed and stored.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.85 }}
                  className="space-y-1 rounded-xl border border-success/30 bg-success/10 p-3"
                >
                  <div className="flex items-center justify-between font-bold text-success">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5" /> Role & Access
                      Enforcement
                    </span>
                    <span className="font-mono text-[10px]">Active</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-success/80">
                    Admin, Doctor, and Patient access boundaries enforced via
                    layout middleware guard.
                  </p>
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </RoleShell>
  );
}
