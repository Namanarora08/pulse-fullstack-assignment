"use client";

import { useState } from "react";
import {
  Stethoscope,
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  Building,
  Mail,
  X,
  AlertTriangle,
  UserCheck,
  Award,
} from "lucide-react";
import { RoleShell } from "@/components/layout/role-shell";
import { useAdmin } from "@/components/admin/admin-context";
import { adminNavItems } from "@/lib/admin-nav";
import { Button } from "@/components/ui/button";
import { DoctorRecord } from "@/lib/auth";

export default function AdminDoctorsPage() {
  const { doctors, patients, addDoctor, updateDoctor, deleteDoctor, assignPatientsToDoctor } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<DoctorRecord | null>(null);
  const [deletingDoctorId, setDeletingDoctorId] = useState<string | null>(null);
  const [assigningDoctor, setAssigningDoctor] = useState<DoctorRecord | null>(null);
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);

  // Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDepartment, setFormDepartment] = useState("");
  const [formHospital, setFormHospital] = useState("");

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Department list
  const departments = Array.from(new Set(doctors.map((d) => d.department)));

  const filteredDoctors = doctors.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.hospital.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === "ALL" || d.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  const openCreateModal = () => {
    setFormName("");
    setFormEmail("");
    setFormTitle("Attending Physician");
    setFormDepartment("Cardiology & Vascular Institute");
    setFormHospital("St. Jude Heart Institute");
    setFormError("");
    setFormSuccess("");
    setIsCreateModalOpen(true);
  };

  const openEditModal = (d: DoctorRecord) => {
    setEditingDoctor(d);
    setFormName(d.name);
    setFormEmail(d.email);
    setFormTitle(d.title);
    setFormDepartment(d.department);
    setFormHospital(d.hospital);
    setFormError("");
    setFormSuccess("");
  };

  const openAssignModal = (d: DoctorRecord) => {
    setAssigningDoctor(d);
    // Pre-select patient IDs currently assigned
    const assignedIds = patients
      .filter((p) => p.assignedDoctor.id === d.id || d.assignedPatientIds.includes(p.id))
      .map((p) => p.id);
    setSelectedPatientIds(assignedIds);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      setFormError("Please fill in doctor name and email.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    setTimeout(() => {
      try {
        addDoctor({
          name: formName,
          email: formEmail,
          title: formTitle,
          department: formDepartment,
          hospital: formHospital,
        });

        setFormSuccess("Physician record registered successfully!");
        setTimeout(() => {
          setIsCreateModalOpen(false);
          setFormSuccess("");
        }, 800);
      } catch (err) {
        console.error("Failed to register physician:", err);
        setFormError("Failed to register physician record.");
      } finally {
        setIsSubmitting(false);
      }
    }, 400);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;
    if (!formName.trim() || !formEmail.trim()) {
      setFormError("Please fill in doctor name and email.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    setTimeout(() => {
      try {
        updateDoctor(editingDoctor.id, {
          name: formName,
          email: formEmail,
          title: formTitle,
          department: formDepartment,
          hospital: formHospital,
        });

        setFormSuccess("Physician record updated successfully!");
        setTimeout(() => {
          setEditingDoctor(null);
          setFormSuccess("");
        }, 800);
      } catch (err) {
        console.error("Failed to update physician:", err);
        setFormError("Failed to update physician record.");
      } finally {
        setIsSubmitting(false);
      }
    }, 400);
  };

  const handleSaveAssignments = () => {
    if (!assigningDoctor) return;
    assignPatientsToDoctor(assigningDoctor.id, selectedPatientIds);
    setAssigningDoctor(null);
  };

  const togglePatientAssignment = (pId: string) => {
    setSelectedPatientIds((prev) =>
      prev.includes(pId) ? prev.filter((id) => id !== pId) : [...prev, pId]
    );
  };

  return (
    <RoleShell
      role="admin"
      title="Doctor Specialist Management"
      description="Manage hospital attending physicians, specialties, department allocations, and patient roster assignments."
      navItems={adminNavItems}
    >
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Medical Specialists Registry ({filteredDoctors.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage clinical team members, departments, and active patient loads.
            </p>
          </div>

          <Button
            onClick={openCreateModal}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2 text-xs shrink-0"
          >
            <Plus className="h-4 w-4" /> Add Doctor Specialist
          </Button>
        </div>

        {/* Filters */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search doctor name, department, or hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200/80 bg-white pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          >
            <option value="ALL">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Doctors Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredDoctors.map((doc) => {
            const assignedPatientsCount = patients.filter(
              (p) => p.assignedDoctor.id === doc.id || doc.assignedPatientIds.includes(p.id)
            ).length;

            return (
              <div
                key={doc.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300 shrink-0">
                        <Stethoscope className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">
                          {doc.name}
                        </h3>
                        <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                          {doc.title}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300 shrink-0">
                      <Users className="h-3.5 w-3.5" />
                      {assignedPatientsCount} Patients
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <p className="flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 text-slate-400" />
                      <strong>Department:</strong> {doc.department}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-slate-400" />
                      <strong>Facility:</strong> {doc.hospital}
                    </p>
                    <p className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                      <Mail className="h-3.5 w-3.5" />
                      {doc.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl text-xs gap-1.5"
                    onClick={() => openAssignModal(doc)}
                  >
                    <UserCheck className="h-3.5 w-3.5" /> Assign Patients
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs text-blue-600 hover:bg-blue-50"
                    onClick={() => openEditModal(doc)}
                  >
                    <Edit className="h-3.5 w-3.5" /> Edit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs text-rose-600 hover:bg-rose-50"
                    onClick={() => setDeletingDoctorId(doc.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}

          {filteredDoctors.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 text-sm">
              No doctor specialists match the search query.
            </div>
          )}
        </div>

        {/* Create / Edit Doctor Modal */}
        {(isCreateModalOpen || editingDoctor) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 space-y-4 relative">
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingDoctor(null);
                }}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingDoctor ? `Edit Specialist: ${editingDoctor.name}` : "Add Physician Specialist"}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure doctor credentials and department assignments.
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

              <form onSubmit={editingDoctor ? handleEditSubmit : handleCreateSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Doctor Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Nambiar"
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
                    placeholder="dr.nambiar@pulsecare.dev"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Title / Clinical Role</label>
                  <input
                    type="text"
                    placeholder="Chief of Cardiology / Senior Consultant"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Department</label>
                    <input
                      type="text"
                      placeholder="Cardiology & Vascular Institute"
                      value={formDepartment}
                      onChange={(e) => setFormDepartment(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Hospital Facility</label>
                    <input
                      type="text"
                      placeholder="St. Jude Heart Institute"
                      value={formHospital}
                      onChange={(e) => setFormHospital(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setEditingDoctor(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white hover:bg-blue-700">
                    {isSubmitting ? "Saving..." : editingDoctor ? "Save Changes" : "Register Specialist"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assign Patients Modal */}
        {assigningDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 space-y-4 relative max-h-[85vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setAssigningDoctor(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Assign Patients to {assigningDoctor.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Select which patients are under {assigningDoctor.name}&apos;s clinical care trajectory.
                </p>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto border border-slate-100 rounded-xl p-2 dark:border-slate-800">
                {patients.map((p) => {
                  const isChecked = selectedPatientIds.includes(p.id);
                  return (
                    <label
                      key={p.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer text-xs transition-colors ${
                        isChecked
                          ? "border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/40"
                          : "border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 dark:text-white">{p.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {p.patientIdCode} • {p.diseaseInfo.name}
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => togglePatientAssignment(p.id)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  );
                })}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" size="sm" onClick={() => setAssigningDoctor(null)}>
                  Cancel
                </Button>
                <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleSaveAssignments}>
                  Save Roster
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {deletingDoctorId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 space-y-4">
              <div className="flex items-center gap-3 text-rose-600">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="text-base font-bold">Confirm Specialist Removal</h3>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                Are you sure you want to remove this doctor from the active registry?
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setDeletingDoctorId(null)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-rose-600 text-white hover:bg-rose-700"
                  onClick={() => {
                    deleteDoctor(deletingDoctorId);
                    setDeletingDoctorId(null);
                  }}
                >
                  Delete Doctor
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleShell>
  );
}
