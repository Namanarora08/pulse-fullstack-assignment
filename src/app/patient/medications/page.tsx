"use client";

import Link from "next/link";
import {
  Pill,
  FileText,
  Sun,
  SunMedium,
  Moon,
  Check,
} from "lucide-react";
import { RoleShell } from "@/components/layout/role-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";
import { PatientRecord } from "@/lib/auth";
import { patientNavItems } from "@/lib/patient-nav";

export default function PatientMedicationsPage() {
  const { user, updatePatientData } = useAuth();
  const patient = (user as PatientRecord) || null;

  const medications = patient?.medicationPlan || [];
  const doctor = patient?.assignedDoctor?.name || "Dr. Sarah Jenkins";

  const toggleDose = (medId: string, slot: "morning" | "afternoon" | "night") => {
    updatePatientData((prev) => {
      const updatedPlan = (prev.medicationPlan || []).map((m) => {
        if (m.id === medId) {
          if (slot === "morning") return { ...m, morningCompleted: !m.morningCompleted };
          if (slot === "afternoon") return { ...m, afternoonCompleted: !m.afternoonCompleted };
          if (slot === "night") return { ...m, nightCompleted: !m.nightCompleted };
        }
        return m;
      });
      return {
        ...prev,
        medicationPlan: updatedPlan,
      };
    });
  };

  return (
    <RoleShell
      role="patient"
      title="Medication Schedule & Adherence"
      description="Track daily prescriptions, dose timings, and doctor guidelines."
      navItems={patientNavItems}
    >
      <div className="space-y-6">
        {/* Header Summary */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/60 dark:text-purple-300">
              <Pill className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              Active Cardiac Care Prescriptions
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Daily Medication Plan
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prescribed by <strong>{doctor}</strong>. Click doses below to log adherence.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-xl">
              <Link href="/patient/reports">
                <FileText className="mr-2 h-4 w-4" />
                View Full Prescription PDF
              </Link>
            </Button>
          </div>
        </div>

        {/* Medications List */}
        <div className="space-y-4">
          {medications.map((med) => (
            <div
              key={med.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-100 dark:bg-purple-950/60 p-2 text-purple-600 dark:text-purple-300">
                    <Pill className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {med.name} <span className="text-purple-600 dark:text-purple-400 font-semibold">({med.dosage})</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Timing Schedule: {med.timing}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <span>Instructions: <strong>{med.instructions}</strong></span>
                </div>
              </div>

              {/* Time Slots (Morning / Afternoon / Night) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* Morning Slot */}
                <button
                  type="button"
                  onClick={() => toggleDose(med.id, "morning")}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                    med.morningCompleted
                      ? "border-emerald-500 bg-emerald-50/60 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
                      : "border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-amber-500" />
                    <div>
                      <p className="font-bold text-xs">Morning Dose</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">8:00 AM</p>
                    </div>
                  </div>
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center border ${
                    med.morningCompleted ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 dark:border-slate-600"
                  }`}>
                    {med.morningCompleted && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </button>

                {/* Afternoon Slot */}
                <button
                  type="button"
                  onClick={() => toggleDose(med.id, "afternoon")}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                    med.afternoonCompleted
                      ? "border-emerald-500 bg-emerald-50/60 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
                      : "border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <SunMedium className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="font-bold text-xs">Afternoon Dose</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">1:30 PM</p>
                    </div>
                  </div>
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center border ${
                    med.afternoonCompleted ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 dark:border-slate-600"
                  }`}>
                    {med.afternoonCompleted && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </button>

                {/* Night Slot */}
                <button
                  type="button"
                  onClick={() => toggleDose(med.id, "night")}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                    med.nightCompleted
                      ? "border-emerald-500 bg-emerald-50/60 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
                      : "border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-indigo-500" />
                    <div>
                      <p className="font-bold text-xs">Night Dose</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">8:00 PM</p>
                    </div>
                  </div>
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center border ${
                    med.nightCompleted ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 dark:border-slate-600"
                  }`}>
                    {med.nightCompleted && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RoleShell>
  );
}
