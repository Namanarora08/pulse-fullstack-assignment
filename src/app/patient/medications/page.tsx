"use client";

import { motion } from "framer-motion";
import { Pill, Sun, SunMedium, Moon, Check, FileText } from "lucide-react";
import Link from "next/link";
import { RoleShell } from "@/components/layout/role-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/auth-context";
import { PatientRecord } from "@/lib/auth";
import { patientNavItems } from "@/lib/patient-nav";

const slots = [
  {
    key: "morning",
    label: "Morning",
    time: "8:00 AM",
    icon: Sun,
    iconColor: "#FBBF24"
  },
  {
    key: "afternoon",
    label: "Afternoon",
    time: "1:30 PM",
    icon: SunMedium,
    iconColor: "#F97316"
  },
  {
    key: "night",
    label: "Night",
    time: "8:00 PM",
    icon: Moon,
    iconColor: "#818CF8"
  }
] as const;

export default function PatientMedicationsPage() {
  const { user, updatePatientData } = useAuth();
  const patient = (user as PatientRecord) || null;
  const medications = patient?.medicationPlan || [];
  const doctor = patient?.assignedDoctor?.name || "Dr. Sarah Jenkins";

  const takenCount = medications.reduce((acc, m) => {
    let t = 0;
    if (m.morningCompleted) t++;
    if (m.afternoonCompleted) t++;
    if (m.nightCompleted) t++;
    return acc + t;
  }, 0);
  const totalSlots = medications.length * 3;

  const toggleDose = (
    medId: string,
    slot: "morning" | "afternoon" | "night"
  ) => {
    updatePatientData((prev) => ({
      ...prev,
      medicationPlan: (prev.medicationPlan || []).map((m) => {
        if (m.id !== medId) return m;
        if (slot === "morning")
          return { ...m, morningCompleted: !m.morningCompleted };
        if (slot === "afternoon")
          return { ...m, afternoonCompleted: !m.afternoonCompleted };
        return { ...m, nightCompleted: !m.nightCompleted };
      })
    }));
  };

  return (
    <RoleShell
      role="patient"
      title="Medication Schedule"
      description="Track daily prescriptions and dose adherence."
      navItems={patientNavItems}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header summary card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col justify-between gap-5 rounded-3xl p-6 sm:flex-row sm:items-center"
          style={{
            background: "#0D0D0F",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.5)"
          }}
        >
          <div className="space-y-1.5">
            <div className="bg-medication/8 inline-flex items-center gap-1.5 rounded-full border border-medication/20 px-3 py-1 text-xs font-medium text-medication">
              <Pill className="h-3 w-3" /> Active prescriptions
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Daily Medication Plan
            </h2>
            <p className="text-xs text-text-muted">
              Prescribed by{" "}
              <span className="text-text-secondary">{doctor}</span> · tap doses
              to log adherence
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="metric-number text-2xl font-bold tracking-tighter text-foreground">
                {takenCount}
                <span className="text-base text-text-muted">/{totalSlots}</span>
              </p>
              <p className="mt-0.5 text-[10px] text-text-muted">doses taken</p>
            </div>
            <Button asChild variant="secondary" size="sm">
              <Link href="/patient/reports">
                <FileText className="h-3.5 w-3.5" /> Prescription PDF
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Medication cards */}
        <div className="space-y-4">
          {medications.map((med, mi) => {
            const slotValues: Record<string, boolean> = {
              morning: !!med.morningCompleted,
              afternoon: !!med.afternoonCompleted,
              night: !!med.nightCompleted
            };
            const takenDoses = Object.values(slotValues).filter(Boolean).length;

            return (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mi * 0.08, duration: 0.4 }}
                className="space-y-4 rounded-2xl p-5"
                style={{
                  background: "#111113",
                  border: "1px solid rgba(255,255,255,0.07)"
                }}
              >
                {/* Med header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        background: "rgba(129,140,248,0.10)",
                        border: "1px solid rgba(129,140,248,0.20)"
                      }}
                    >
                      <Pill className="h-4.5 w-4.5 text-medication" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {med.name}{" "}
                        <span className="font-medium text-medication">
                          ({med.dosage})
                        </span>
                      </p>
                      <p className="text-xs text-text-muted">{med.timing}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      takenDoses === 3
                        ? "recovery"
                        : takenDoses > 0
                          ? "warning"
                          : "secondary"
                    }
                  >
                    {takenDoses}/3 taken
                  </Badge>
                </div>

                {/* Instructions */}
                <p
                  className="rounded-xl px-3 py-2 text-xs text-text-muted"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.05)"
                  }}
                >
                  {med.instructions}
                </p>

                {/* Dose slots */}
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {slots.map(({ key, label, time, icon: Icon, iconColor }) => {
                    const done = slotValues[key];
                    return (
                      <motion.button
                        key={key}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleDose(med.id, key)}
                        className="transition-apple flex items-center justify-between rounded-2xl p-3.5 text-left"
                        style={{
                          background: done
                            ? "rgba(52,211,153,0.08)"
                            : "rgba(255,255,255,0.025)",
                          border: `1px solid ${done ? "rgba(52,211,153,0.25)" : "rgba(255,255,255,0.06)"}`
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className="h-4 w-4"
                            style={{ color: iconColor }}
                          />
                          <div>
                            <p
                              className="text-xs font-semibold"
                              style={{ color: done ? "#34D399" : "#FAFAFA" }}
                            >
                              {label}
                            </p>
                            <p className="text-[10px] text-text-muted">
                              {time}
                            </p>
                          </div>
                        </div>
                        <div
                          className="transition-apple flex h-5 w-5 items-center justify-center rounded-full"
                          style={{
                            background: done
                              ? "#34D399"
                              : "rgba(255,255,255,0.06)",
                            border: done
                              ? "none"
                              : "1px solid rgba(255,255,255,0.12)"
                          }}
                        >
                          {done && (
                            <Check className="h-2.5 w-2.5 stroke-[3] text-[#09090B]" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}

          {medications.length === 0 && (
            <div
              className="rounded-2xl py-16 text-center"
              style={{
                background: "#111113",
                border: "1px solid rgba(255,255,255,0.06)"
              }}
            >
              <Pill className="mx-auto mb-3 h-8 w-8 text-text-muted" />
              <p className="text-sm text-text-secondary">
                No medications prescribed yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </RoleShell>
  );
}
