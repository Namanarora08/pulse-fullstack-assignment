"use client";

import {
  User,
  Stethoscope,
  PhoneCall,
  AlertTriangle,
  FileText,
  Mail,
  Heart
} from "lucide-react";
import { RoleShell } from "@/components/layout/role-shell";
import { useAuth } from "@/components/auth/auth-context";
import { PatientRecord } from "@/lib/auth";
import { patientNavItems } from "@/lib/patient-nav";

export default function PatientProfilePage() {
  const { user } = useAuth();
  const patient = (user as PatientRecord) || null;

  const name = patient?.name || "Rahul Sharma";
  const email = patient?.email || "rahul.sharma@pulsecare.dev";
  const aadhaar = patient?.aadhaar || "9876 5432 1098";
  const dob = patient?.dob || "1988-05-14";
  const patientCode = patient?.patientIdCode || "P-88201";

  const doctor = patient?.assignedDoctor || {
    name: "Dr. Sarah Jenkins",
    title: "Chief of Cardiology",
    email: "dr.smith@stjudehealth.org",
    department: "Cardiology & Vascular Institute"
  };

  const emergency = patient?.emergencyContact || {
    name: "Priya Sharma",
    relation: "Spouse",
    phone: "+91 98765 43210"
  };

  const history = patient?.medicalHistory || {
    condition: "Post-Coronary Stent Placement",
    hospital: "St. Jude Heart Institute",
    dischargeDate: "2026-07-12",
    notes: "Drug-eluting stent in LAD. Stable recovery.",
    allergies: ["Penicillin", "Sulfa drugs"]
  };

  const disease = patient?.diseaseInfo || {
    name: "Coronary Artery Disease (CAD)",
    stage: "Post-Surgical Recovery (Phase 2)",
    riskCategory: "Low",
    summary: "Cardiac recovery protocol following stent intervention."
  };

  return (
    <RoleShell
      role="patient"
      title="Patient Health Profile"
      description="Personal demographics, verified clinical history, allergies, and care team directory."
      navItems={patientNavItems}
    >
      <div className="space-y-6">
        {/* Patient Personal Information Card */}
        <div className="space-y-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3 dark:border-slate-800">
            <div className="rounded-xl bg-blue-950/60 p-2.5 text-blue-300">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Patient Demographics & Identification
              </h2>
              <p className="text-xs text-slate-400">
                Aadhaar verified healthcare identification
              </p>
            </div>
          </div>

          <div className="grid gap-4 text-xs sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <p className="font-medium text-slate-400">Full Name</p>
              <p className="text-sm font-bold text-white">{name}</p>
            </div>

            <div className="space-y-1">
              <p className="font-medium text-slate-400">
                Patient Unique ID Code
              </p>
              <p className="font-mono text-sm font-bold text-blue-400">
                {patientCode}
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-medium text-slate-400">Aadhaar Number</p>
              <p className="font-mono text-sm font-bold text-white">
                {aadhaar}
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-medium text-slate-400">Date of Birth</p>
              <p className="text-sm font-bold text-white">{dob}</p>
            </div>

            <div className="space-y-1">
              <p className="font-medium text-slate-400">
                Registered Email Address
              </p>
              <p className="truncate text-sm font-bold text-white">{email}</p>
            </div>
          </div>
        </div>

        {/* Clinical Disease & Medical History */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Disease Information */}
          <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <Heart className="h-5 w-5 text-red-500" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                Primary Diagnosis & Condition
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="font-medium text-slate-500">Diagnosis</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {disease.name}
                </p>
              </div>

              <div>
                <p className="font-medium text-slate-500">
                  Current Recovery Stage
                </p>
                <p className="font-semibold text-blue-600 dark:text-blue-400">
                  {disease.stage}
                </p>
              </div>

              <div>
                <p className="font-medium text-slate-500">
                  Risk Category Assessment
                </p>
                <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {disease.riskCategory} Risk
                </span>
              </div>

              <div>
                <p className="font-medium text-slate-500">Clinical Summary</p>
                <p className="mt-0.5 leading-relaxed text-slate-700 dark:text-slate-300">
                  {disease.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Medical History & Allergies */}
          <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <FileText className="h-5 w-5 text-purple-600" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                Surgical History & Allergies
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="font-medium text-slate-500">
                  Primary Surgical Event
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {history.condition}
                </p>
              </div>

              <div>
                <p className="font-medium text-slate-500">
                  Hospital & Discharge Date
                </p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {history.hospital} ({history.dischargeDate})
                </p>
              </div>

              <div>
                <p className="flex items-center gap-1 font-medium text-amber-600 text-slate-500 dark:text-amber-400">
                  <AlertTriangle className="h-3.5 w-3.5" /> Known Allergies
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {history.allergies.map((allergy, i) => (
                    <span
                      key={i}
                      className="rounded-md border border-amber-200/60 bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium text-slate-500">Discharge Notes</p>
                <p className="mt-0.5 leading-relaxed text-slate-700 dark:text-slate-300">
                  {history.notes}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Doctor & Emergency Contact */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Assigned Doctor */}
          <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <Stethoscope className="h-5 w-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                Assigned Primary Cardiologist
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-base font-bold text-slate-900 dark:text-white">
                {doctor.name}
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                {doctor.title} • {doctor.department}
              </p>
              <p className="flex items-center gap-1.5 pt-1 text-blue-600 dark:text-blue-400">
                <Mail className="h-3.5 w-3.5" /> {doctor.email}
              </p>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <PhoneCall className="h-5 w-5 text-red-500" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                Emergency Contact Contact Person
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-base font-bold text-slate-900 dark:text-white">
                {emergency.name} ({emergency.relation})
              </p>
              <p className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                {emergency.phone}
              </p>
              <p className="text-[11px] text-slate-500">
                Primary point of contact during urgent medical incidents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </RoleShell>
  );
}
