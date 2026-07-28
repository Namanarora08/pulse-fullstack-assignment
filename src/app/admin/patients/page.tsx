"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Activity,
  AlertTriangle,
  X,
  Check,
  ShieldCheck,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RoleShell } from "@/components/layout/role-shell";
import { useAdmin } from "@/components/admin/admin-context";
import { adminNavItems } from "@/lib/admin-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PatientRecord, PatientReport } from "@/lib/auth";

/* ── Reusable dark input ──────────────────────────────────────────────── */
const inputCls = [
  "w-full rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-text-muted",
  "bg-white/[0.03] border border-white/[0.08] outline-none transition-apple-fast",
  "focus:border-white/[0.18] focus:bg-white/[0.05]"
].join(" ");

const selectCls = [
  "w-full rounded-xl px-3.5 py-2.5 text-sm text-foreground",
  "bg-[#18181B] border border-white/[0.08] outline-none transition-apple-fast",
  "focus:border-white/[0.18]"
].join(" ");

export default function AdminPatientsPage() {
  const {
    patients,
    doctors,
    reports,
    addPatient,
    updatePatient,
    deletePatient,
    assignDoctorToPatient
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState("ALL");
  const [selectedRiskFilter, setSelectedRiskFilter] = useState("ALL");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PatientRecord | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingPatient, setViewingPatient] = useState<PatientRecord | null>(
    null
  );

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formAadhaar, setFormAadhaar] = useState("");
  const [formDob, setFormDob] = useState("1990-01-01");
  const [formDoctorId, setFormDoctorId] = useState(doctors[0]?.id || "");
  const [formDisease, setFormDisease] = useState(
    "Coronary Artery Disease (CAD)"
  );
  const [formRisk, setFormRisk] = useState<"Low" | "Moderate" | "High">("Low");
  const [formEmName, setFormEmName] = useState("");
  const [formEmPhone, setFormEmPhone] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.patientIdCode.toLowerCase().includes(q) ||
        p.diseaseInfo.name.toLowerCase().includes(q)) &&
      (selectedDoctorFilter === "ALL" ||
        p.assignedDoctor.id === selectedDoctorFilter) &&
      (selectedRiskFilter === "ALL" ||
        p.diseaseInfo.riskCategory === selectedRiskFilter)
    );
  });

  const riskVariant = (r: string) =>
    r === "High"
      ? ("danger" as const)
      : r === "Moderate"
        ? ("warning" as const)
        : ("recovery" as const);
  const riskColor = (r: string) =>
    r === "High" ? "#EF4444" : r === "Moderate" ? "#FBBF24" : "#34D399";

  const openCreate = () => {
    setFormName("");
    setFormEmail("");
    setFormAadhaar("");
    setFormDob("1990-01-01");
    setFormDoctorId(doctors[0]?.id || "");
    setFormDisease("Coronary Artery Disease (CAD)");
    setFormRisk("Low");
    setFormEmName("");
    setFormEmPhone("");
    setFormError("");
    setFormSuccess("");
    setIsCreateOpen(true);
  };
  const openEdit = (p: PatientRecord) => {
    setEditingPatient(p);
    setFormName(p.name);
    setFormEmail(p.email);
    setFormAadhaar(p.aadhaar);
    setFormDob(p.dob);
    setFormDoctorId(p.assignedDoctor.id);
    setFormDisease(p.diseaseInfo.name);
    setFormRisk(p.diseaseInfo.riskCategory);
    setFormEmName(p.emergencyContact.name);
    setFormEmPhone(p.emergencyContact.phone);
    setFormError("");
    setFormSuccess("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      setFormError("Name and email are required.");
      return;
    }
    setIsSubmitting(true);
    setFormError("");
    setTimeout(() => {
      try {
        if (editingPatient) {
          updatePatient(editingPatient.id, {
            name: formName,
            email: formEmail,
            aadhaar: formAadhaar,
            dob: formDob,
            emergencyContact: {
              ...editingPatient.emergencyContact,
              name: formEmName,
              phone: formEmPhone
            },
            diseaseInfo: {
              ...editingPatient.diseaseInfo,
              name: formDisease,
              riskCategory: formRisk
            }
          });
          if (formDoctorId !== editingPatient.assignedDoctor.id)
            assignDoctorToPatient(editingPatient.id, formDoctorId);
        } else {
          addPatient({
            name: formName,
            email: formEmail,
            aadhaar: formAadhaar,
            dob: formDob,
            assignedDoctor:
              doctors.find((d) => d.id === formDoctorId) || doctors[0],
            emergencyContact: {
              name: formEmName || "Emergency Contact",
              relation: "Family",
              phone: formEmPhone || "+91 98765 00000"
            },
            diseaseInfo: {
              name: formDisease,
              stage: "Active Clinical Care",
              riskCategory: formRisk,
              summary: "Enrolled via admin portal."
            }
          });
        }
        setFormSuccess(
          editingPatient ? "Patient updated." : "Patient enrolled."
        );
        setTimeout(() => {
          setIsCreateOpen(false);
          setEditingPatient(null);
          setFormSuccess("");
        }, 700);
      } catch {
        setFormError("An error occurred.");
      } finally {
        setIsSubmitting(false);
      }
    }, 350);
  };

  const closeModal = () => {
    setIsCreateOpen(false);
    setEditingPatient(null);
  };
  const isModalOpen = isCreateOpen || !!editingPatient;

  const handleDownload = (rep: PatientReport) => {
    const el = document.createElement("a");
    el.href = URL.createObjectURL(
      new Blob(
        [`PULSE CARE REPORT\n\n${rep.title}\n${rep.date}\n\n${rep.summary}`],
        { type: "text/plain" }
      )
    );
    el.download = `${rep.title.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };

  /* ── Shared modal shell ── */
  const ModalShell = ({
    children,
    title,
    subtitle
  }: {
    children: React.ReactNode;
    title: string;
    subtitle: string;
  }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="relative my-8 w-full max-w-xl space-y-5 rounded-3xl p-7"
        style={{
          background: "#18181B",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8)"
        }}
      >
        <button
          onClick={closeModal}
          className="transition-apple-fast absolute right-5 top-5 rounded-xl p-1.5 text-text-muted hover:bg-white/[0.06] hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="mt-0.5 text-xs text-text-muted">{subtitle}</p>
        </div>
        {children}
      </motion.div>
    </div>
  );

  return (
    <RoleShell
      role="admin"
      title="Patient Lifecycle Management"
      description="Complete CRUD over patient enrollments, clinical profiles, and physician assignments."
      navItems={adminNavItems}
    >
      <div className="mx-auto max-w-6xl space-y-5">
        {/* Controls bar */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search patients…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${inputCls} pl-10`}
            />
          </div>
          <select
            value={selectedDoctorFilter}
            onChange={(e) => setSelectedDoctorFilter(e.target.value)}
            className={selectCls}
            style={{ maxWidth: 200 }}
          >
            <option value="ALL">All Doctors</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <select
            value={selectedRiskFilter}
            onChange={(e) => setSelectedRiskFilter(e.target.value)}
            className={selectCls}
            style={{ maxWidth: 160 }}
          >
            <option value="ALL">All Risks</option>
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
          </select>
          <Button
            onClick={openCreate}
            variant="recovery"
            size="default"
            className="shrink-0"
          >
            <Plus className="h-4 w-4" /> Enroll Patient
          </Button>
        </div>

        {/* Patient row list — premium card style */}
        <div
          className="overflow-hidden rounded-3xl"
          style={{
            background: "#0D0D0F",
            border: "1px solid rgba(255,255,255,0.06)"
          }}
        >
          {/* Header */}
          <div
            className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span>Patient</span>
            <span className="hidden sm:block">Risk</span>
            <span className="hidden md:block">Score</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {filteredPatients.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="transition-apple-fast grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 px-6 py-4 hover:bg-white/[0.02]"
              >
                {/* Patient info */}
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold"
                    style={{
                      background: `${riskColor(p.diseaseInfo.riskCategory)}12`,
                      color: riskColor(p.diseaseInfo.riskCategory)
                    }}
                  >
                    {p.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {p.name}
                    </p>
                    <p className="truncate text-[11px] text-text-muted">
                      <span className="font-mono">{p.patientIdCode}</span> ·{" "}
                      {p.diseaseInfo.name}
                    </p>
                  </div>
                </div>

                {/* Risk */}
                <div className="hidden sm:block">
                  <Badge variant={riskVariant(p.diseaseInfo.riskCategory)}>
                    {p.diseaseInfo.riskCategory}
                  </Badge>
                </div>

                {/* Score */}
                <div className="hidden text-center md:block">
                  <p className="metric-number text-sm font-bold text-foreground">
                    {p.recoveryStatus.completionScore}%
                  </p>
                  <p className="text-[10px] text-text-muted">
                    {p.recoveryStatus.streakDays}d streak
                  </p>
                </div>

                {/* Check-in status */}
                <div>
                  <Badge
                    variant={
                      p.recoveryStatus.checkInStatus === "Completed"
                        ? "recovery"
                        : p.recoveryStatus.checkInStatus === "Pending"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {p.recoveryStatus.checkInStatus === "Completed" ? (
                      <>
                        <Check className="h-2.5 w-2.5" /> Done
                      </>
                    ) : (
                      <>
                        <Activity className="h-2.5 w-2.5" />{" "}
                        {p.recoveryStatus.checkInStatus}
                      </>
                    )}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewingPatient(p)}
                    className="transition-apple-fast flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-white/[0.06] hover:text-foreground"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => openEdit(p)}
                    className="transition-apple-fast flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-medication/10 hover:text-medication"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingId(p.id)}
                    className="transition-apple-fast flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-danger/10 hover:text-danger"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}

            {filteredPatients.length === 0 && (
              <div className="py-16 text-center text-sm text-text-muted">
                No patients match the current filters.
              </div>
            )}
          </div>
        </div>

        {/* ── Create / Edit modal ── */}
        <AnimatePresence>
          {isModalOpen && (
            <ModalShell
              title={
                editingPatient
                  ? `Edit — ${editingPatient.name}`
                  : "Enroll New Patient"
              }
              subtitle={
                editingPatient
                  ? "Update clinical profile and physician assignment."
                  : "Register patient into the EHR and assign attending doctor."
              }
            >
              {formError && (
                <div className="bg-danger/8 rounded-xl border border-danger/20 px-4 py-3 text-xs text-danger">
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="bg-recovery/8 rounded-xl border border-recovery/20 px-4 py-3 text-xs text-recovery">
                  {formSuccess}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Vikramaditya Roy"
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">
                      Aadhaar *
                    </label>
                    <input
                      type="text"
                      required
                      value={formAadhaar}
                      onChange={(e) => setFormAadhaar(e.target.value)}
                      placeholder="9876 5432 1098"
                      className={`${inputCls} font-mono`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formDob}
                      onChange={(e) => setFormDob(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">
                      Assigned Doctor
                    </label>
                    <select
                      value={formDoctorId}
                      onChange={(e) => setFormDoctorId(e.target.value)}
                      className={selectCls}
                    >
                      {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.title})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">
                      Risk Category
                    </label>
                    <select
                      value={formRisk}
                      onChange={(e) =>
                        setFormRisk(
                          e.target.value as "Low" | "Moderate" | "High"
                        )
                      }
                      className={selectCls}
                    >
                      <option value="Low">Low Risk</option>
                      <option value="Moderate">Moderate Risk</option>
                      <option value="High">High Risk</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary">
                    Primary Diagnosis
                  </label>
                  <input
                    type="text"
                    value={formDisease}
                    onChange={(e) => setFormDisease(e.target.value)}
                    placeholder="Coronary Artery Disease (CAD)"
                    className={inputCls}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">
                      Emergency Contact
                    </label>
                    <input
                      type="text"
                      value={formEmName}
                      onChange={(e) => setFormEmName(e.target.value)}
                      placeholder="Contact name"
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">
                      Emergency Phone
                    </label>
                    <input
                      type="text"
                      value={formEmPhone}
                      onChange={(e) => setFormEmPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className={`${inputCls} font-mono`}
                    />
                  </div>
                </div>

                <div
                  className="flex justify-end gap-2.5 pt-2"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <Button type="button" variant="ghost" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="recovery"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Saving…"
                      : editingPatient
                        ? "Update Patient"
                        : "Enroll Patient"}
                  </Button>
                </div>
              </form>
            </ModalShell>
          )}
        </AnimatePresence>

        {/* ── Delete confirmation ── */}
        <AnimatePresence>
          {deletingId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm space-y-4 rounded-3xl p-6"
                style={{
                  background: "#18181B",
                  border: "1px solid rgba(239,68,68,0.20)",
                  boxShadow:
                    "0 24px 64px rgba(0,0,0,0.8), 0 0 32px rgba(239,68,68,0.08)"
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-danger/20 bg-danger/10">
                    <AlertTriangle className="h-5 w-5 text-danger" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Delete patient record?
                    </h3>
                    <p className="text-xs text-text-muted">
                      This removes all clinical history and check-ins.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingId(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      deletePatient(deletingId);
                      setDeletingId(null);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── Patient profile view modal ── */}
        <AnimatePresence>
          {viewingPatient && (
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
                className="relative my-8 w-full max-w-2xl space-y-6 rounded-3xl p-7"
                style={{
                  background: "#18181B",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.8)"
                }}
              >
                <button
                  onClick={() => setViewingPatient(null)}
                  className="transition-apple-fast absolute right-5 top-5 rounded-xl p-1.5 text-text-muted hover:bg-white/[0.06] hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Patient header */}
                <div
                  className="space-y-1"
                  style={{
                    paddingBottom: "1rem",
                    borderBottom: "1px solid rgba(255,255,255,0.06)"
                  }}
                >
                  <div className="bg-medication/8 inline-flex items-center gap-1.5 rounded-full border border-medication/20 px-3 py-1 text-[11px] font-medium text-medication">
                    <ShieldCheck className="h-3 w-3" /> Verified EHR Record
                  </div>
                  <h2 className="text-xl font-bold text-foreground">
                    {viewingPatient.name}
                  </h2>
                  <p className="font-mono text-xs text-text-muted">
                    {viewingPatient.patientIdCode} · {viewingPatient.aadhaar} ·
                    DOB: {viewingPatient.dob}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "Condition",
                      v: viewingPatient.diseaseInfo.name,
                      sub: `${viewingPatient.diseaseInfo.riskCategory} Risk`
                    },
                    {
                      label: "Specialist",
                      v: viewingPatient.assignedDoctor.name,
                      sub: viewingPatient.assignedDoctor.department
                    },
                    {
                      label: "Compliance",
                      v: `${viewingPatient.recoveryStatus.completionScore}%`,
                      sub: `${viewingPatient.recoveryStatus.streakDays}d streak`
                    }
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl p-3.5"
                      style={{
                        background: "rgba(255,255,255,0.025)",
                        border: "1px solid rgba(255,255,255,0.06)"
                      }}
                    >
                      <p className="text-[10px] text-text-muted">{s.label}</p>
                      <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
                        {s.v}
                      </p>
                      <p className="text-[11px] text-text-muted">{s.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Check-in history */}
                {viewingPatient.previousCheckIns.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      Recent Check-ins
                    </p>
                    <div className="space-y-2">
                      {viewingPatient.previousCheckIns
                        .slice(0, 4)
                        .map((ci, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between rounded-xl px-4 py-3 text-xs"
                            style={{
                              background: "rgba(255,255,255,0.025)",
                              border: "1px solid rgba(255,255,255,0.05)"
                            }}
                          >
                            <div>
                              <span className="font-semibold text-foreground">
                                {ci.date}
                              </span>
                              <span className="ml-2 text-text-muted">
                                Pain: {ci.painScale}/10
                              </span>
                            </div>
                            <Badge variant="recovery">
                              <Check className="h-2.5 w-2.5" /> Done
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Reports */}
                {reports.filter((r) => r.patientId === viewingPatient.id)
                  .length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      Clinical Documents
                    </p>
                    <div className="space-y-2">
                      {reports
                        .filter((r) => r.patientId === viewingPatient.id)
                        .map((rep) => (
                          <div
                            key={rep.id}
                            className="flex items-center justify-between rounded-xl px-4 py-3"
                            style={{
                              background: "rgba(255,255,255,0.025)",
                              border: "1px solid rgba(255,255,255,0.05)"
                            }}
                          >
                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-foreground">
                                {rep.title}
                              </p>
                              <p className="text-[11px] text-text-muted">
                                {rep.date} · {rep.doctorName}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleDownload(rep)}
                            >
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div
                  className="flex justify-end"
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    paddingTop: "1rem"
                  }}
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setViewingPatient(null)}
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </RoleShell>
  );
}
