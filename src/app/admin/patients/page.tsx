"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Activity,
  AlertTriangle,
  X,
  Check,
  ShieldCheck,
  Download,
} from "lucide-react";
import { RoleShell } from "@/components/layout/role-shell";
import { useAdmin } from "@/components/admin/admin-context";
import { adminNavItems } from "@/lib/admin-nav";
import { Button } from "@/components/ui/button";
import { PatientRecord, PatientReport } from "@/lib/auth";

export default function AdminPatientsPage() {
  const { patients, doctors, reports, addPatient, updatePatient, deletePatient, assignDoctorToPatient } = useAdmin();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState("ALL");
  const [selectedRiskFilter, setSelectedRiskFilter] = useState("ALL");
  const [selectedDiseaseFilter, setSelectedDiseaseFilter] = useState("ALL");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PatientRecord | null>(null);
  const [deletingPatientId, setDeletingPatientId] = useState<string | null>(null);
  const [viewingPatient, setViewingPatient] = useState<PatientRecord | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formAadhaar, setFormAadhaar] = useState("");
  const [formDob, setFormDob] = useState("");
  const [formDoctorId, setFormDoctorId] = useState("");
  const [formDiseaseName, setFormDiseaseName] = useState("Coronary Artery Disease (CAD)");
  const [formRiskCategory, setFormRiskCategory] = useState<"Low" | "Moderate" | "High">("Low");
  const [formEmergencyName, setFormEmergencyName] = useState("");
  const [formEmergencyPhone, setFormEmergencyPhone] = useState("");

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter logic
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patientIdCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.aadhaar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.diseaseInfo.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDoctor =
      selectedDoctorFilter === "ALL" || p.assignedDoctor.id === selectedDoctorFilter;

    const matchesRisk =
      selectedRiskFilter === "ALL" || p.diseaseInfo.riskCategory === selectedRiskFilter;

    const matchesDisease =
      selectedDiseaseFilter === "ALL" || p.diseaseInfo.name === selectedDiseaseFilter;

    return matchesSearch && matchesDoctor && matchesRisk && matchesDisease;
  });

  const openCreateModal = () => {
    setFormName("");
    setFormEmail("");
    setFormAadhaar("");
    setFormDob("1990-01-01");
    setFormDoctorId(doctors[0]?.id || "");
    setFormDiseaseName("Coronary Artery Disease (CAD)");
    setFormRiskCategory("Low");
    setFormEmergencyName("");
    setFormEmergencyPhone("");
    setFormError("");
    setFormSuccess("");
    setIsCreateModalOpen(true);
  };

  const openEditModal = (p: PatientRecord) => {
    setEditingPatient(p);
    setFormName(p.name);
    setFormEmail(p.email);
    setFormAadhaar(p.aadhaar);
    setFormDob(p.dob);
    setFormDoctorId(p.assignedDoctor.id);
    setFormDiseaseName(p.diseaseInfo.name);
    setFormRiskCategory(p.diseaseInfo.riskCategory);
    setFormEmergencyName(p.emergencyContact.name);
    setFormEmergencyPhone(p.emergencyContact.phone);
    setFormError("");
    setFormSuccess("");
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formAadhaar.trim()) {
      setFormError("Please fill in all required patient fields.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    setTimeout(() => {
      try {
        addPatient({
          name: formName,
          email: formEmail,
          aadhaar: formAadhaar,
          dob: formDob,
          assignedDoctor: doctors.find((d) => d.id === formDoctorId) || doctors[0],
          emergencyContact: {
            name: formEmergencyName || "Emergency Contact",
            relation: "Family",
            phone: formEmergencyPhone || "+91 98765 00000",
          },
          diseaseInfo: {
            name: formDiseaseName,
            stage: "Active Clinical Care",
            riskCategory: formRiskCategory,
            summary: "Enrolled in hospital remote patient monitoring.",
          },
        });

        setFormSuccess("Patient record created successfully!");
        setTimeout(() => {
          setIsCreateModalOpen(false);
          setFormSuccess("");
        }, 800);
      } catch (err) {
        console.error("Failed to create patient:", err);
        setFormError("Failed to create patient record.");
      } finally {
        setIsSubmitting(false);
      }
    }, 400);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;
    if (!formName.trim() || !formEmail.trim()) {
      setFormError("Please enter valid patient name and email.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    setTimeout(() => {
      try {
        updatePatient(editingPatient.id, {
          name: formName,
          email: formEmail,
          aadhaar: formAadhaar,
          dob: formDob,
          emergencyContact: {
            ...editingPatient.emergencyContact,
            name: formEmergencyName,
            phone: formEmergencyPhone,
          },
          diseaseInfo: {
            ...editingPatient.diseaseInfo,
            name: formDiseaseName,
            riskCategory: formRiskCategory,
          },
        });

        if (formDoctorId && formDoctorId !== editingPatient.assignedDoctor.id) {
          assignDoctorToPatient(editingPatient.id, formDoctorId);
        }

        setFormSuccess("Patient record updated successfully!");
        setTimeout(() => {
          setEditingPatient(null);
          setFormSuccess("");
        }, 800);
      } catch (err) {
        console.error("Failed to update patient:", err);
        setFormError("Failed to update patient record.");
      } finally {
        setIsSubmitting(false);
      }
    }, 400);
  };

  const handleDeleteConfirm = (id: string) => {
    deletePatient(id);
    setDeletingPatientId(null);
  };

  const handleDownloadReport = (rep: PatientReport) => {
    const element = document.createElement("a");
    const file = new Blob([
      `PULSE CARE CLINICAL REPORT\n\nTitle: ${rep.title}\nCategory: ${rep.category}\nDate: ${rep.date}\nDoctor: ${rep.doctorName}\n\nClinical Summary:\n${rep.summary}\n\nDigitally signed by St. Jude Health Network.`
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
      title="Patient Lifecycle Management"
      description="Complete CRUD control over patient enrollments, physician assignments, clinical profiles, and report repositories."
      navItems={adminNavItems}
    >
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Enrolled Patients ({filteredPatients.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage patient demographics, assign attending cardiologists, and inspect clinical recovery records.
            </p>
          </div>

          <Button
            onClick={openCreateModal}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2 text-xs shrink-0"
          >
            <Plus className="h-4 w-4" /> Enroll New Patient
          </Button>
        </div>

        {/* Filters & Search Bar */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, ID, aadhaar, or disease..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200/80 bg-white pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          {/* Doctor Filter */}
          <select
            value={selectedDoctorFilter}
            onChange={(e) => setSelectedDoctorFilter(e.target.value)}
            className="rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          >
            <option value="ALL">All Attending Doctors</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.department})
              </option>
            ))}
          </select>

          {/* Risk Filter */}
          <select
            value={selectedRiskFilter}
            onChange={(e) => setSelectedRiskFilter(e.target.value)}
            className="rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          >
            <option value="ALL">All Risk Categories</option>
            <option value="Low">Low Risk</option>
            <option value="Moderate">Moderate Risk</option>
            <option value="High">High Risk</option>
          </select>

          {/* Disease Filter */}
          <select
            value={selectedDiseaseFilter}
            onChange={(e) => setSelectedDiseaseFilter(e.target.value)}
            className="rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          >
            <option value="ALL">All Primary Conditions</option>
            <option value="Coronary Artery Disease (CAD)">Coronary Artery Disease (CAD)</option>
            <option value="Ischemic Heart Disease">Ischemic Heart Disease</option>
            <option value="Hypertension">Hypertension</option>
            <option value="Type 2 Diabetes">Type 2 Diabetes</option>
            <option value="Post-Surgical Recovery">Post-Surgical Recovery</option>
          </select>
        </div>

        {/* Patients Data Table */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Patient Name & ID</th>
                  <th className="p-4">Condition & Risk</th>
                  <th className="p-4">Assigned Doctor</th>
                  <th className="p-4">Recovery Score</th>
                  <th className="p-4">Check-in Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{p.name}</div>
                      <div className="text-[11px] text-slate-500">
                        ID: <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{p.patientIdCode}</span> • Aadhaar: {p.aadhaar}
                      </div>
                    </td>

                    <td className="p-4 space-y-1">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{p.diseaseInfo.name}</div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.diseaseInfo.riskCategory === "High"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : p.diseaseInfo.riskCategory === "Moderate"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        }`}
                      >
                        {p.diseaseInfo.riskCategory} Risk
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={p.assignedDoctor.id}
                          onChange={(e) => assignDoctorToPatient(p.id, e.target.value)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white font-medium"
                        >
                          {doctors.map((doc) => (
                            <option key={doc.id} value={doc.id}>
                              {doc.name} ({doc.department})
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{p.recoveryStatus.completionScore}%</div>
                      <div className="text-[11px] text-slate-500">{p.recoveryStatus.streakDays}-day Streak</div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          p.recoveryStatus.checkInStatus === "Completed"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : p.recoveryStatus.checkInStatus === "Pending"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        }`}
                      >
                        {p.recoveryStatus.checkInStatus === "Completed" ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Activity className="h-3 w-3" />
                        )}
                        {p.recoveryStatus.checkInStatus}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingPatient(p)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                          title="View Full Patient Profile & History"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 dark:border-slate-800 dark:text-blue-400 dark:hover:bg-blue-950/40"
                          title="Edit Patient Info"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingPatientId(p.id)}
                          className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 dark:border-slate-800 dark:text-rose-400 dark:hover:bg-rose-950/40"
                          title="Delete Patient Record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 text-sm">
                      No patient records match the specified search or filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create / Edit Patient Modal */}
        {(isCreateModalOpen || editingPatient) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
            <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 space-y-4 relative my-8">
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingPatient(null);
                }}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingPatient ? `Edit Patient Profile: ${editingPatient.name}` : "Enroll New Hospital Patient"}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingPatient
                    ? "Update clinical classification, assigned doctor, and emergency demographics."
                    : "Register new patient into hospital EHR database and assign attending doctor."}
                </p>
              </div>

              {formError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-300">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {formSuccess}
                </div>
              )}

              <form onSubmit={editingPatient ? handleEditSubmit : handleCreateSubmit} className="space-y-4 text-xs">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Roy"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. vikram@pulsecare.dev"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Aadhaar Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="9876 5432 1098"
                      value={formAadhaar}
                      onChange={(e) => setFormAadhaar(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Date of Birth</label>
                    <input
                      type="date"
                      value={formDob}
                      onChange={(e) => setFormDob(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Assigned Primary Doctor</label>
                    <select
                      value={formDoctorId}
                      onChange={(e) => setFormDoctorId(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    >
                      {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.title})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Risk Assessment Category</label>
                    <select
                      value={formRiskCategory}
                      onChange={(e) => setFormRiskCategory(e.target.value as "Low" | "Moderate" | "High")}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white font-semibold"
                    >
                      <option value="Low">Low Risk</option>
                      <option value="Moderate">Moderate Risk</option>
                      <option value="High">High Risk</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Primary Diagnosis / Disease Condition</label>
                  <input
                    type="text"
                    placeholder="e.g. Coronary Artery Disease (CAD)"
                    value={formDiseaseName}
                    onChange={(e) => setFormDiseaseName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Emergency Contact Person</label>
                    <input
                      type="text"
                      placeholder="Name of Emergency Contact"
                      value={formEmergencyName}
                      onChange={(e) => setFormEmergencyName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Emergency Contact Phone</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={formEmergencyPhone}
                      onChange={(e) => setFormEmergencyPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setEditingPatient(null);
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : editingPatient
                      ? "Update Patient Record"
                      : "Create Patient Profile"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingPatientId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 space-y-4">
              <div className="flex items-center gap-3 text-rose-600">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="text-base font-bold">Confirm Deletion</h3>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                Are you sure you want to delete this patient record? This action will remove their clinical history, daily check-ins, and doctor assignments.
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setDeletingPatientId(null)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-rose-600 text-white hover:bg-rose-700"
                  onClick={() => handleDeleteConfirm(deletingPatientId)}
                >
                  Delete Patient
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Complete Patient Profile & Recovery History Modal */}
        {viewingPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
            <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 space-y-6 relative my-8 max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setViewingPatient(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-1 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified Hospital EHR Record
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {viewingPatient.name} ({viewingPatient.patientIdCode})
                </h2>
                <p className="text-xs text-slate-500">
                  Aadhaar: <span className="font-mono">{viewingPatient.aadhaar}</span> • DOB: {viewingPatient.dob} • Email: {viewingPatient.email}
                </p>
              </div>

              {/* Patient Vitals & Clinical Overview */}
              <div className="grid gap-4 sm:grid-cols-3 text-xs">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50 space-y-1">
                  <p className="text-slate-500 font-medium">Condition & Risk</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{viewingPatient.diseaseInfo.name}</p>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold">{viewingPatient.diseaseInfo.riskCategory} Risk Category</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50 space-y-1">
                  <p className="text-slate-500 font-medium">Attending Specialist</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{viewingPatient.assignedDoctor.name}</p>
                  <p className="text-slate-500">{viewingPatient.assignedDoctor.department}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50 space-y-1">
                  <p className="text-slate-500 font-medium">Recovery Trajectory</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{viewingPatient.recoveryStatus.completionScore}% Compliance Score</p>
                  <p className="text-emerald-600 font-semibold">{viewingPatient.recoveryStatus.streakDays}-day Check-in Streak</p>
                </div>
              </div>

              {/* Recovery Check-in History */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  Recent Check-in Logs & Symptoms
                </h3>

                <div className="space-y-2">
                  {viewingPatient.previousCheckIns.map((ci, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40 text-xs flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{ci.date} - Pain Scale: {ci.painScale}/10</p>
                        <p className="text-slate-600 dark:text-slate-300">Symptoms: {ci.symptomsLogged.join(", ") || "None"}</p>
                        <p className="text-[11px] text-slate-400">&quot;{ci.notes}&quot;</p>
                      </div>
                      <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Completed
                      </span>
                    </div>
                  ))}
                  {viewingPatient.previousCheckIns.length === 0 && (
                    <p className="text-xs text-slate-500">No check-in history logged yet.</p>
                  )}
                </div>
              </div>

              {/* Patient Clinical Reports */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                  Uploaded Medical Documents ({reports.filter((r) => r.patientId === viewingPatient.id).length})
                </h3>

                <div className="space-y-2">
                  {reports.filter((r) => r.patientId === viewingPatient.id).map((rep) => (
                    <div key={rep.id} className="rounded-xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-800 text-xs flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {rep.category}
                        </span>
                        <p className="font-bold text-slate-900 dark:text-white text-xs">{rep.title}</p>
                        <p className="text-slate-500 text-[11px]">{rep.date} • Auth: {rep.doctorName}</p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs gap-1 rounded-xl"
                        onClick={() => handleDownloadReport(rep)}
                      >
                        <Download className="h-3.5 w-3.5" /> Download
                      </Button>
                    </div>
                  ))}
                  {reports.filter((r) => r.patientId === viewingPatient.id).length === 0 && (
                    <p className="text-xs text-slate-500">No clinical reports uploaded for this patient.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" size="sm" onClick={() => setViewingPatient(null)}>
                  Close Profile
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleShell>
  );
}
