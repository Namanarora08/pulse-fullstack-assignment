"use client";

import {
  User,
  Stethoscope,
  PhoneCall,
  AlertTriangle,
  FileText,
  Mail,
  Heart,
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
    department: "Cardiology & Vascular Institute",
  };

  const emergency = patient?.emergencyContact || {
    name: "Priya Sharma",
    relation: "Spouse",
    phone: "+91 98765 43210",
  };

  const history = patient?.medicalHistory || {
    condition: "Post-Coronary Stent Placement",
    hospital: "St. Jude Heart Institute",
    dischargeDate: "2026-07-12",
    notes: "Drug-eluting stent in LAD. Stable recovery.",
    allergies: ["Penicillin", "Sulfa drugs"],
  };

  const disease = patient?.diseaseInfo || {
    name: "Coronary Artery Disease (CAD)",
    stage: "Post-Surgical Recovery (Phase 2)",
    riskCategory: "Low",
    summary: "Cardiac recovery protocol following stent intervention.",
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
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Patient Demographics & Identification</h2>
              <p className="text-xs text-slate-500">Aadhaar verified healthcare identification</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
            <div className="space-y-1">
              <p className="text-slate-500 font-medium">Full Name</p>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-500 font-medium">Patient Unique ID Code</p>
              <p className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">{patientCode}</p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-500 font-medium">Aadhaar Number</p>
              <p className="font-mono font-bold text-slate-900 dark:text-white text-sm">{aadhaar}</p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-500 font-medium">Date of Birth</p>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{dob}</p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-500 font-medium">Registered Email Address</p>
              <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{email}</p>
            </div>
          </div>
        </div>

        {/* Clinical Disease & Medical History */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Disease Information */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <Heart className="h-5 w-5 text-red-500" />
              <h3 className="font-bold text-slate-900 dark:text-white">Primary Diagnosis & Condition</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-slate-500 font-medium">Diagnosis</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{disease.name}</p>
              </div>

              <div>
                <p className="text-slate-500 font-medium">Current Recovery Stage</p>
                <p className="font-semibold text-blue-600 dark:text-blue-400">{disease.stage}</p>
              </div>

              <div>
                <p className="text-slate-500 font-medium">Risk Category Assessment</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {disease.riskCategory} Risk
                </span>
              </div>

              <div>
                <p className="text-slate-500 font-medium">Clinical Summary</p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">{disease.summary}</p>
              </div>
            </div>
          </div>

          {/* Medical History & Allergies */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <FileText className="h-5 w-5 text-purple-600" />
              <h3 className="font-bold text-slate-900 dark:text-white">Surgical History & Allergies</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-slate-500 font-medium">Primary Surgical Event</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{history.condition}</p>
              </div>

              <div>
                <p className="text-slate-500 font-medium">Hospital & Discharge Date</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{history.hospital} ({history.dischargeDate})</p>
              </div>

              <div>
                <p className="text-slate-500 font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Known Allergies
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {history.allergies.map((allergy, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200/60">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-slate-500 font-medium">Discharge Notes</p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">{history.notes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Doctor & Emergency Contact */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Assigned Doctor */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <Stethoscope className="h-5 w-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 dark:text-white">Assigned Primary Cardiologist</h3>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-900 dark:text-white text-base">{doctor.name}</p>
              <p className="text-slate-600 dark:text-slate-400">{doctor.title} • {doctor.department}</p>
              <p className="text-blue-600 dark:text-blue-400 flex items-center gap-1.5 pt-1">
                <Mail className="h-3.5 w-3.5" /> {doctor.email}
              </p>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <PhoneCall className="h-5 w-5 text-red-500" />
              <h3 className="font-bold text-slate-900 dark:text-white">Emergency Contact Contact Person</h3>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-900 dark:text-white text-base">{emergency.name} ({emergency.relation})</p>
              <p className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">{emergency.phone}</p>
              <p className="text-slate-500 text-[11px]">Primary point of contact during urgent medical incidents.</p>
            </div>
          </div>
        </div>
      </div>
    </RoleShell>
  );
}
