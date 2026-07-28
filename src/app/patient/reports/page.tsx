"use client";

import { useState } from "react";
import {
  Download,
  Eye,
  Search,
  FileCheck,
  X,
  Calendar,
} from "lucide-react";
import { RoleShell } from "@/components/layout/role-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";
import { PatientRecord, PatientReport } from "@/lib/auth";
import { patientNavItems } from "@/lib/patient-nav";

export default function PatientReportsPage() {
  const { user } = useAuth();
  const patient = (user as PatientRecord) || null;

  const reports = patient?.reports || [];
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [previewReport, setPreviewReport] = useState<PatientReport | null>(null);

  const categories = ["All", "Blood", "Lab", "Prescription", "Scan", "Discharge Summary"];

  const filteredReports = reports.filter((rep) => {
    const matchesCategory = selectedCategory === "All" || rep.category === selectedCategory;
    const matchesSearch =
      rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (report: PatientReport) => {
    const element = document.createElement("a");
    const file = new Blob([
      `PULSE CARE CLINICAL REPORT\n\nTitle: ${report.title}\nCategory: ${report.category}\nDate: ${report.date}\nDoctor: ${report.doctorName}\n\nClinical Summary:\n${report.summary}\n\nDigitally signed by St. Jude Health Network.`
    ], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${report.title.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <RoleShell
      role="patient"
      title="Medical Reports"
      description="Your lab results, prescriptions, and scan reports."
      navItems={patientNavItems}
    >
      <div className="space-y-6">
        {/* Header Summary */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300">
              <FileCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Your Records
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Reports ({reports.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              All your medical documents in one place.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports by title or clinical notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200/80 bg-white pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border shrink-0 transition-all ${
                  selectedCategory === cat
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredReports.map((rep) => (
            <div
              key={rep.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md">
                    {rep.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {rep.date}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                  {rep.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {rep.summary}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2 dark:border-slate-800">
                  <span>Authorized: <strong>{rep.doctorName}</strong></span>
                  <span>Size: {rep.size}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl text-xs"
                  onClick={() => setPreviewReport(rep)}
                >
                  <Eye className="mr-1.5 h-3.5 w-3.5" /> Preview
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 rounded-xl text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleDownload(rep)}
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Download
                </Button>
              </div>
            </div>
          ))}

          {filteredReports.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
              No medical reports match your search filter.
            </div>
          )}
        </div>

        {/* Preview Modal */}
        {previewReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 space-y-4 relative">
              <button
                type="button"
                onClick={() => setPreviewReport(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                  {previewReport.category} REPORT PREVIEW
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {previewReport.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Date: {previewReport.date} • Doctor: {previewReport.doctorName}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-200 space-y-2 border border-slate-200/80 dark:border-slate-700">
                <p className="font-semibold text-slate-900 dark:text-white">Diagnostic & Clinical Findings:</p>
                <p className="leading-relaxed">{previewReport.summary}</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setPreviewReport(null)}>
                  Close
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => {
                    handleDownload(previewReport);
                    setPreviewReport(null);
                  }}
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Download Copy
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleShell>
  );
}
