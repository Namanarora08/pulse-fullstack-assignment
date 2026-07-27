"use client";

import { useState } from "react";
import {
  Search,
  Upload,
  Eye,
  Download,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";
import { RoleShell } from "@/components/layout/role-shell";
import { useAdmin } from "@/components/admin/admin-context";
import { adminNavItems } from "@/lib/admin-nav";
import { Button } from "@/components/ui/button";
import { ClinicalDocument } from "@/lib/admin-store";

export default function AdminClinicalUploadsPage() {
  const { reports, patients, doctors, addReport, deleteReport } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [patientFilter, setPatientFilter] = useState("ALL");

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewingReport, setPreviewingReport] = useState<ClinicalDocument | null>(null);
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<
    "Blood" | "Lab" | "Prescription" | "Medical Images" | "Scan" | "Discharge Summary" | "Other Clinical Documents"
  >("Discharge Summary");
  const [formPatientId, setFormPatientId] = useState("");
  const [formDoctorId, setFormDoctorId] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formSummary, setFormSummary] = useState("");
  const [formFileName, setFormFileName] = useState("");

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters
  const categories = [
    "Discharge Summary",
    "Blood",
    "Lab",
    "Prescription",
    "Medical Images",
    "Scan",
    "Other Clinical Documents",
  ];

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "ALL" || r.category === categoryFilter;
    const matchesPatient = patientFilter === "ALL" || r.patientId === patientFilter;

    return matchesSearch && matchesCategory && matchesPatient;
  });

  const openUploadModal = () => {
    setFormTitle("");
    setFormCategory("Discharge Summary");
    setFormPatientId(patients[0]?.id || "");
    setFormDoctorId(doctors[0]?.id || "");
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormSummary("");
    setFormFileName("");
    setFormError("");
    setFormSuccess("");
    setIsUploadModalOpen(true);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formPatientId || !formSummary.trim()) {
      setFormError("Please fill in document title, patient link, and clinical summary.");
      return;
    }

    const patient = patients.find((p) => p.id === formPatientId);
    const doctor = doctors.find((d) => d.id === formDoctorId) || doctors[0];

    if (!patient) {
      setFormError("Selected patient does not exist.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    setTimeout(() => {
      try {
        addReport({
          title: formTitle,
          category: formCategory,
          date: formDate,
          doctorName: doctor ? doctor.name : "Attending Specialist",
          size: (Math.random() * 4 + 0.8).toFixed(1) + " MB",
          summary: formSummary,
          patientId: patient.id,
          patientName: patient.name,
          doctorId: doctor ? doctor.id : "doc-1",
        });

        setFormSuccess("Clinical report uploaded and attached to EHR successfully!");
        setTimeout(() => {
          setIsUploadModalOpen(false);
          setFormSuccess("");
        }, 800);
      } catch (err) {
        console.error("Failed to save clinical report:", err);
        setFormError("Failed to save clinical report.");
      } finally {
        setIsSubmitting(false);
      }
    }, 400);
  };

  const handleDownloadReport = (rep: ClinicalDocument) => {
    const element = document.createElement("a");
    const file = new Blob([
      `ST. JUDE HEALTH SYSTEM - CLINICAL RECORD\n\nTitle: ${rep.title}\nCategory: ${rep.category}\nDate: ${rep.date}\nPatient: ${rep.patientName} (ID: ${rep.patientId})\nAuthorizing Physician: ${rep.doctorName}\nDocument Size: ${rep.size}\n\nClinical Findings & Assessment Notes:\n${rep.summary}\n\nDigitally Encrypted & Verified by Hospital EHR System.`
    ], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${rep.title.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <RoleShell
      role="admin"
      title="Clinical Document Uploads & Repository"
      description="Centralized hospital repository for uploading, verifying, and managing patient blood work, scan reports, discharge summaries, and prescriptions."
      navItems={adminNavItems}
    >
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Clinical Documents Repository ({filteredReports.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload blood reports, imaging scans, discharge notes, and link them directly to patient records.
            </p>
          </div>

          <Button
            onClick={openUploadModal}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2 text-xs shrink-0"
          >
            <Upload className="h-4 w-4" /> Upload Clinical Document
          </Button>
        </div>

        {/* Filters & Search */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search document title, patient, or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200/80 bg-white pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Patient filter */}
          <select
            value={patientFilter}
            onChange={(e) => setPatientFilter(e.target.value)}
            className="rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          >
            <option value="ALL">All Linked Patients</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.patientIdCode})
              </option>
            ))}
          </select>
        </div>

        {/* Reports Table */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Document Title & Category</th>
                  <th className="p-4">Linked Patient</th>
                  <th className="p-4">Authorizing Physician</th>
                  <th className="p-4">Date & Size</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{rep.title}</div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                        {rep.category}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{rep.patientName}</div>
                      <div className="text-[11px] text-slate-500">Linked Patient Record</div>
                    </td>

                    <td className="p-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{rep.doctorName}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-mono text-slate-700 dark:text-slate-300">{rep.date}</div>
                      <div className="text-[10px] text-slate-400">{rep.size}</div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs p-1.5 h-auto rounded-lg"
                          onClick={() => setPreviewingReport(rep)}
                          title="Preview Clinical Summary"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs p-1.5 h-auto rounded-lg text-blue-600"
                          onClick={() => handleDownloadReport(rep)}
                          title="Download Report File"
                        >
                          <Download className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs p-1.5 h-auto rounded-lg text-rose-600"
                          onClick={() => setDeletingReportId(rep.id)}
                          title="Delete Document"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 text-sm">
                      No clinical reports found matching search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 space-y-4 relative max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Upload Clinical Document
                </h3>
                <p className="text-xs text-slate-500">
                  Attach new clinical test, discharge summary, or diagnostic report to patient record.
                </p>
              </div>

              {formError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
                  {formSuccess}
                </div>
              )}

              <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Document Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12-Lead Electrocardiogram Scan & Report"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Category *</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as "Blood" | "Lab" | "Prescription" | "Medical Images" | "Scan" | "Discharge Summary" | "Other Clinical Documents")}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Report Date</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Linked Patient *</label>
                    <select
                      value={formPatientId}
                      onChange={(e) => setFormPatientId(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white font-medium"
                    >
                      {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.patientIdCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Authorizing Doctor</label>
                    <select
                      value={formDoctorId}
                      onChange={(e) => setFormDoctorId(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white font-medium"
                    >
                      {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.department})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Clinical Summary & Impressions *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter clinical assessment, lab results, diagnosis notes, or discharge observations..."
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* File attachment upload simulation */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Attach File (PDF, DICOM, JPG)</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    <Upload className="mx-auto h-6 w-6 text-slate-400 mb-1" />
                    <p className="text-[11px] text-slate-500">
                      {formFileName ? `Attached: ${formFileName}` : "Click or select file from system (PDF / DICOM)"}
                    </p>
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFormFileName(e.target.files[0].name);
                        }
                      }}
                      className="mt-2 text-[10px] mx-auto block text-slate-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsUploadModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white hover:bg-blue-700">
                    {isSubmitting ? "Uploading..." : "Save & Attach Document"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Document Preview Modal */}
        {previewingReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 space-y-4 relative">
              <button
                type="button"
                onClick={() => setPreviewingReport(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-1 border-b border-slate-100 pb-3 dark:border-slate-800">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  {previewingReport.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {previewingReport.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Linked Patient: <strong>{previewingReport.patientName}</strong> • Date: {previewingReport.date}
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-semibold text-slate-700 dark:text-slate-300">Authorizing Physician:</p>
                <p className="text-slate-600 dark:text-slate-400">{previewingReport.doctorName}</p>

                <p className="font-semibold text-slate-700 dark:text-slate-300 pt-2">Clinical Summary:</p>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-800 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200 leading-relaxed font-mono text-[11px]">
                  {previewingReport.summary}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400">File Size: {previewingReport.size}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadReport(previewingReport)}
                    className="gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" /> Download File
                  </Button>
                  <Button size="sm" onClick={() => setPreviewingReport(null)}>
                    Close Preview
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingReportId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 space-y-4">
              <div className="flex items-center gap-3 text-rose-600">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="text-base font-bold">Confirm Document Removal</h3>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                Are you sure you want to delete this clinical report from the patient record?
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setDeletingReportId(null)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-rose-600 text-white hover:bg-rose-700"
                  onClick={() => {
                    deleteReport(deletingReportId);
                    setDeletingReportId(null);
                  }}
                >
                  Delete Document
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleShell>
  );
}
