"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";

import { RoleShell } from "@/components/layout/role-shell";
import { doctorNavItems } from "@/lib/doctor-nav";
import { safeFetchJson } from "@/lib/api-client";

interface PatientRow {
  id: string;
  name: string;
  email?: string;
  status?: string;
  condition?: string;
  checkIns?: Array<{ completed: boolean; date: string }>;
  score?: number;
  lastCheckIn?: string;
}

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatients() {
      try {
        setLoading(true);
        const url = searchQuery
          ? `/api/doctor/patients?q=${encodeURIComponent(searchQuery)}`
          : "/api/doctor/patients";
        const res = await safeFetchJson<{ data?: PatientRow[] }>(url);
        if (res.ok && res.data) {
          setPatients(res.data.data || []);
        }
      } catch (err) {
        console.error("Error loading patient list:", err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadPatients, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getStatusIcon = (status?: string) => {
    if (status === "Deteriorating" || status === "Watch")
      return <AlertTriangle className="h-3.5 w-3.5" />;
    if (status === "Improving") return <TrendingUp className="h-3.5 w-3.5" />;
    if (status === "Stable") return <Minus className="h-3.5 w-3.5" />;
    return <TrendingDown className="h-3.5 w-3.5" />;
  };

  const getStatusColor = (status?: string) => {
    if (status === "Deteriorating" || status === "Watch")
      return "text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60";
    if (status === "Improving")
      return "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60";
    if (status === "Stable")
      return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/60";
    return "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60";
  };

  const getRiskBadge = (status?: string) => {
    if (status === "Deteriorating" || status === "Watch") return "High Risk";
    if (status === "Improving") return "Improving";
    if (status === "Stable") return "Stable";
    return "Monitoring";
  };

  return (
    <RoleShell
      role="doctor"
      title="Patient Roster"
      description="Monitor assigned patient records, current risk status, and check-in history."
      navItems={doctorNavItems}
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="flex h-12 items-center gap-2.5 rounded-2xl border border-slate-800/50 bg-slate-900/80 px-4 shadow-lg shadow-black/20 backdrop-blur-xl transition-all focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20">
          <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search patients by name, email or condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-500"
          />
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl border border-slate-800/50 bg-slate-800/30"
              />
            ))}
          </div>
        ) : patients.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {patients.map((patient, idx) => {
              const latestCheckIn = patient.checkIns?.[0];
              const checkInLabel = latestCheckIn
                ? latestCheckIn.completed
                  ? "Completed today"
                  : "Pending check-in"
                : "No check-ins";

              const isWatch =
                patient.status === "Watch" ||
                patient.status === "Deteriorating";

              return (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative rounded-2xl border border-slate-800/50 bg-slate-900/80 p-5 shadow-lg shadow-black/20 backdrop-blur-xl transition-all hover:border-slate-700/50 hover:shadow-xl"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-bold text-white">
                          {patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">
                            {patient.name}
                          </h3>
                          <p className="text-[11px] text-slate-400">
                            {patient.condition || "General Monitoring"}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`rounded-xl p-2 ${getStatusColor(patient.status)}`}
                      >
                        {getStatusIcon(patient.status)}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-slate-800/50 p-2.5">
                        <p className="text-[10px] text-slate-400">
                          Recovery Score
                        </p>
                        <p className="text-lg font-black text-white">
                          {patient.score || 85}%
                        </p>
                      </div>
                      <div className="rounded-xl bg-slate-800/50 p-2.5">
                        <p className="text-[10px] text-slate-400">
                          Last Check-in
                        </p>
                        <p className="flex items-center gap-1 text-xs font-bold text-white">
                          <Clock className="h-3 w-3" />{" "}
                          {patient.lastCheckIn || "Today"}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          isWatch
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        }`}
                      >
                        {getRiskBadge(patient.status)}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {checkInLabel}
                      </span>
                    </div>

                    {/* Action */}
                    <Link
                      href={`/doctor/patients/${patient.id}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-purple-500"
                    >
                      View Details <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-800/50 bg-slate-900/30 p-12 text-center">
            <p className="text-sm font-semibold text-slate-300">
              No patients found
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your search terms or filter parameters.
            </p>
          </div>
        )}
      </div>
    </RoleShell>
  );
}
