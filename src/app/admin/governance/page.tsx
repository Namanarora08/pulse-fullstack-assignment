"use client";

import { useState } from "react";
import {
  Search,
  Download,
  Key,
  UserCheck,
  FileText,
  Server,
} from "lucide-react";
import { RoleShell } from "@/components/layout/role-shell";
import { useAdmin } from "@/components/admin/admin-context";
import { adminNavItems } from "@/lib/admin-nav";
import { Button } from "@/components/ui/button";

export default function AdminGovernanceAuditPage() {
  const { auditLogs } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const categories = [
    "Recent Logins",
    "Data Changes",
    "Patient Updates",
    "Doctor Activity",
    "Admin Activity",
    "File Uploads",
    "System Events",
  ];

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "ALL" || log.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleExportAuditTrail = () => {
    const csvContent = [
      ["Timestamp", "Actor Name", "Role", "Category", "Action", "Target", "Details", "IP Address"],
      ...filteredLogs.map((l) => [
        l.timestamp,
        l.actorName,
        l.actorRole,
        l.category,
        l.action,
        l.target,
        `"${l.details.replace(/"/g, '""')}"`,
        l.ipAddress || "127.0.0.1",
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const element = document.createElement("a");
    const file = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    element.href = URL.createObjectURL(file);
    element.download = `Hospital_System_Audit_Trail_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <RoleShell
      role="admin"
      title="System Audit Log"
      description="Track logins, changes, and system events."
      navItems={adminNavItems}
    >
      <div className="space-y-6">
        {/* Header Control Bar */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Audit Log ({filteredLogs.length} events)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              See all system activity and changes.
            </p>
          </div>

          <Button
            onClick={handleExportAuditTrail}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2 text-xs shrink-0"
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit action, user, or target..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200/80 bg-white pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          >
            <option value="ALL">All Audit Event Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Category Summary Tabs */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-1">
            <span className="text-slate-500 font-semibold flex items-center gap-1.5"><Key className="h-3.5 w-3.5 text-blue-600" /> Recent Logins</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {auditLogs.filter((l) => l.category === "Recent Logins").length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-1">
            <span className="text-slate-500 font-semibold flex items-center gap-1.5"><UserCheck className="h-3.5 w-3.5 text-emerald-600" /> Clinical Updates</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {auditLogs.filter((l) => l.category === "Patient Updates" || l.category === "Doctor Activity").length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-1">
            <span className="text-slate-500 font-semibold flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-purple-600" /> Clinical Uploads</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {auditLogs.filter((l) => l.category === "File Uploads").length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-1">
            <span className="text-slate-500 font-semibold flex items-center gap-1.5"><Server className="h-3.5 w-3.5 text-amber-600" /> System Events</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {auditLogs.filter((l) => l.category === "System Events" || l.category === "Admin Activity").length}
            </p>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Timestamp & IP</th>
                  <th className="p-4">Actor / User</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Action Executed</th>
                  <th className="p-4">Target Entity</th>
                  <th className="p-4">Details</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{log.timestamp}</div>
                      <div className="text-[10px] text-slate-400">{log.ipAddress || "192.168.1.100"}</div>
                    </td>

                    <td className="p-4 font-sans">
                      <div className="font-bold text-slate-900 dark:text-white">{log.actorName}</div>
                      <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {log.actorRole}
                      </span>
                    </td>

                    <td className="p-4 font-sans">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {log.category}
                      </span>
                    </td>

                    <td className="p-4 font-sans font-bold text-slate-900 dark:text-white">
                      {log.action}
                    </td>

                    <td className="p-4 font-sans text-slate-700 dark:text-slate-300">
                      {log.target}
                    </td>

                    <td className="p-4 font-sans text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {log.details}
                    </td>
                  </tr>
                ))}

                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 font-sans text-sm">
                      No audit events found matching specified filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleShell>
  );
}
