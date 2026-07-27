"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AdminStoreData,
  ClinicalDocument,
  DiseaseTemplate,
  AuditLog,
  RoleConfig,
  getInitialAdminStore,
  saveAdminStore,
} from "@/lib/admin-store";
import { PatientRecord, DoctorRecord, PatientReport } from "@/lib/auth";

interface AdminContextType {
  patients: PatientRecord[];
  doctors: DoctorRecord[];
  reports: ClinicalDocument[];
  templates: DiseaseTemplate[];
  auditLogs: AuditLog[];
  roles: RoleConfig[];

  // Patient Actions
  addPatient: (patient: Partial<PatientRecord>) => PatientRecord;
  updatePatient: (id: string, updates: Partial<PatientRecord>) => void;
  deletePatient: (id: string) => void;
  assignDoctorToPatient: (patientId: string, doctorId: string) => void;

  // Doctor Actions
  addDoctor: (doctor: Partial<DoctorRecord>) => DoctorRecord;
  updateDoctor: (id: string, updates: Partial<DoctorRecord>) => void;
  deleteDoctor: (id: string) => void;
  assignPatientsToDoctor: (doctorId: string, patientIds: string[]) => void;

  // Report Actions
  addReport: (report: Omit<ClinicalDocument, "id">) => ClinicalDocument;
  deleteReport: (id: string) => void;

  // Template Actions
  addTemplate: (template: Omit<DiseaseTemplate, "id" | "createdAt" | "updatedAt">) => DiseaseTemplate;
  updateTemplate: (id: string, updates: Partial<DiseaseTemplate>) => void;
  deleteTemplate: (id: string) => void;
  toggleTemplateStatus: (id: string) => void;

  // Audit Actions
  addAuditLog: (log: Omit<AuditLog, "id" | "timestamp">) => void;

  // Role Actions
  updateRolePermission: (roleName: "patient" | "doctor" | "admin", permissionKey: string, value: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<AdminStoreData>(() => getInitialAdminStore());

  useEffect(() => {
    saveAdminStore(store);
  }, [store]);

  // Helper log function
  const logAction = (
    actorName: string,
    actorRole: "Admin" | "Doctor" | "Patient" | "System",
    action: string,
    category: "Recent Logins" | "Data Changes" | "Patient Updates" | "Doctor Activity" | "Admin Activity" | "File Uploads" | "System Events",
    target: string,
    details: string
  ) => {
    const newLog: AuditLog = {
      id: "log-" + Date.now(),
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      actorName,
      actorRole,
      action,
      category,
      target,
      details,
      ipAddress: "192.168.1.100",
    };
    setStore((prev) => ({
      ...prev,
      auditLogs: [newLog, ...prev.auditLogs],
    }));
  };

  // Patient CRUD
  const addPatient = (payload: Partial<PatientRecord>): PatientRecord => {
    const newId = "pat-" + Math.random().toString(36).substring(2, 7) + "-" + Math.floor(10000 + Math.random() * 90000);
    const code = "P-" + Math.floor(10000 + Math.random() * 90000);
    
    // Find assigned doctor
    const doc = store.doctors.find((d) => d.id === payload.assignedDoctor?.id) || store.doctors[0] || {
      id: "doc-sarah-jenkins",
      name: "Dr. Sarah Jenkins",
      title: "Chief of Cardiology",
      email: "dr.smith@stjudehealth.org",
      department: "Cardiology & Vascular Institute",
    };

    const newPatient: PatientRecord = {
      id: newId,
      name: payload.name || "New Patient",
      email: payload.email || `patient.${code.toLowerCase()}@pulsecare.dev`,
      aadhaar: payload.aadhaar || "9999 8888 7777",
      dob: payload.dob || "1990-01-01",
      patientIdCode: code,
      emergencyContact: payload.emergencyContact || {
        name: "Emergency Contact",
        relation: "Family",
        phone: "+91 98765 00000",
      },
      assignedDoctor: {
        id: doc.id,
        name: doc.name,
        title: doc.title,
        email: doc.email,
        department: doc.department,
      },
      medicalHistory: payload.medicalHistory || {
        condition: "General Clinical Observation",
        hospital: "St. Jude Health Institute",
        dischargeDate: new Date().toISOString().split("T")[0],
        notes: "Enrolled in digital care trajectory.",
        allergies: ["None Known"],
      },
      diseaseInfo: payload.diseaseInfo || {
        name: "Coronary Artery Disease (CAD)",
        stage: "Post-Discharge Recovery",
        riskCategory: "Low",
        summary: "Standard post-acute cardiac tracking protocol.",
      },
      medicationPlan: payload.medicationPlan || [],
      dietPlan: payload.dietPlan || {
        type: "Standard Heart-Healthy Recovery Diet",
        dailyCalories: "2,000 kcal",
        sodiumLimit: "< 2,000 mg / day",
        hydrationTarget: "2.5 Liters daily",
        recommendations: ["Maintain regular hydration", "Avoid high-salt foods"],
        meals: [],
      },
      vitals: payload.vitals || {
        sleepHours: 7.0,
        sleepQuality: "Normal",
        waterIntakeLiters: 1.5,
        waterTargetLiters: 2.5,
        stepsCount: 3500,
        heartRateBpm: 72,
      },
      badgeInfo: payload.badgeInfo || {
        level: "Bronze",
        points: 100,
        targetPoints: 300,
        legend: "Level Legend: Bronze (0-299 pts) • Silver (300-599 pts) • Gold (600-899 pts) • Platinum (900+ pts)",
      },
      reports: payload.reports || [],
      timeline: payload.timeline || [
        {
          id: "tl-init",
          stage: "Enrollment",
          title: "Enrolled in Hospital Care System",
          date: new Date().toISOString().split("T")[0],
          description: "Patient profile registered by hospital administrator.",
          completed: true,
        },
      ],
      notifications: payload.notifications || [],
      recoveryStatus: payload.recoveryStatus || {
        streakDays: 1,
        completionScore: 80,
        readinessRating: "Active Monitoring",
        lastCheckIn: "Today",
        checkInStatus: "Pending",
        nextReminder: "Today at 8:00 PM",
      },
      previousCheckIns: payload.previousCheckIns || [],
    };

    setStore((prev) => {
      const updatedDoctors = prev.doctors.map((d) => {
        if (d.id === doc.id && !d.assignedPatientIds.includes(newId)) {
          return { ...d, assignedPatientIds: [...d.assignedPatientIds, newId] };
        }
        return d;
      });

      return {
        ...prev,
        patients: [newPatient, ...prev.patients],
        doctors: updatedDoctors,
      };
    });

    logAction("Admin Operations", "Admin", "Created Patient Record", "Patient Updates", newPatient.name, `Enrolled ${newPatient.name} (${newPatient.patientIdCode}) assigned to ${doc.name}.`);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<PatientRecord>) => {
    setStore((prev) => ({
      ...prev,
      patients: prev.patients.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
    logAction("Admin Operations", "Admin", "Updated Patient Info", "Patient Updates", id, `Modified patient profile fields.`);
  };

  const deletePatient = (id: string) => {
    const target = store.patients.find((p) => p.id === id);
    setStore((prev) => ({
      ...prev,
      patients: prev.patients.filter((p) => p.id !== id),
      reports: prev.reports.filter((r) => r.patientId !== id),
      doctors: prev.doctors.map((d) => ({
        ...d,
        assignedPatientIds: d.assignedPatientIds.filter((pId) => pId !== id),
      })),
    }));
    logAction("Admin Operations", "Admin", "Deleted Patient Record", "Patient Updates", target?.name || id, `Removed patient record and associated assignments.`);
  };

  const assignDoctorToPatient = (patientId: string, doctorId: string) => {
    const doc = store.doctors.find((d) => d.id === doctorId);
    if (!doc) return;

    setStore((prev) => {
      const updatedPatients = prev.patients.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            assignedDoctor: {
              id: doc.id,
              name: doc.name,
              title: doc.title,
              email: doc.email,
              department: doc.department,
            },
          };
        }
        return p;
      });

      const updatedDoctors = prev.doctors.map((d) => {
        const hasPatient = d.assignedPatientIds.includes(patientId);
        if (d.id === doctorId && !hasPatient) {
          return { ...d, assignedPatientIds: [...d.assignedPatientIds, patientId] };
        }
        if (d.id !== doctorId && hasPatient) {
          return { ...d, assignedPatientIds: d.assignedPatientIds.filter((pId) => pId !== patientId) };
        }
        return d;
      });

      return { ...prev, patients: updatedPatients, doctors: updatedDoctors };
    });

    logAction("Admin Operations", "Admin", "Reassigned Doctor", "Doctor Activity", patientId, `Reassigned patient care team to ${doc.name}.`);
  };

  // Doctor CRUD
  const addDoctor = (payload: Partial<DoctorRecord>): DoctorRecord => {
    const newId = "doc-" + Math.random().toString(36).substring(2, 7);
    const newDoctor: DoctorRecord = {
      id: newId,
      name: payload.name || "Dr. New Specialist",
      email: payload.email || `doctor.${newId}@pulsecare.dev`,
      title: payload.title || "Consultant Specialist",
      department: payload.department || "General Medicine",
      hospital: payload.hospital || "St. Jude Health Institute",
      assignedPatientIds: payload.assignedPatientIds || [],
    };

    setStore((prev) => ({
      ...prev,
      doctors: [newDoctor, ...prev.doctors],
    }));

    logAction("Admin Operations", "Admin", "Registered Doctor Specialist", "Doctor Activity", newDoctor.name, `Created physician account in ${newDoctor.department}.`);
    return newDoctor;
  };

  const updateDoctor = (id: string, updates: Partial<DoctorRecord>) => {
    setStore((prev) => ({
      ...prev,
      doctors: prev.doctors.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
    logAction("Admin Operations", "Admin", "Updated Doctor Info", "Doctor Activity", id, `Updated physician profile and specialty credentials.`);
  };

  const deleteDoctor = (id: string) => {
    const target = store.doctors.find((d) => d.id === id);
    setStore((prev) => ({
      ...prev,
      doctors: prev.doctors.filter((d) => d.id !== id),
    }));
    logAction("Admin Operations", "Admin", "Deleted Doctor Record", "Doctor Activity", target?.name || id, `Removed doctor profile from active registry.`);
  };

  const assignPatientsToDoctor = (doctorId: string, patientIds: string[]) => {
    const doc = store.doctors.find((d) => d.id === doctorId);
    if (!doc) return;

    setStore((prev) => {
      const updatedDoctors = prev.doctors.map((d) => (d.id === doctorId ? { ...d, assignedPatientIds: patientIds } : d));

      const updatedPatients = prev.patients.map((p) => {
        if (patientIds.includes(p.id)) {
          return {
            ...p,
            assignedDoctor: {
              id: doc.id,
              name: doc.name,
              title: doc.title,
              email: doc.email,
              department: doc.department,
            },
          };
        }
        return p;
      });

      return { ...prev, doctors: updatedDoctors, patients: updatedPatients };
    });

    logAction("Admin Operations", "Admin", "Bulk Assigned Patients to Doctor", "Doctor Activity", doc.name, `Assigned ${patientIds.length} patients to ${doc.name}.`);
  };

  // Clinical Upload CRUD
  const addReport = (reportPayload: Omit<ClinicalDocument, "id">): ClinicalDocument => {
    const newReport: ClinicalDocument = {
      ...reportPayload,
      id: "rep-" + Date.now(),
    };

    setStore((prev) => {
      const updatedPatients = prev.patients.map((p) => {
        if (p.id === reportPayload.patientId) {
          const reportSummaryItem: PatientReport = {
            id: newReport.id,
            title: newReport.title,
            category: newReport.category as PatientReport["category"],
            date: newReport.date,
            doctorName: newReport.doctorName,
            size: newReport.size,
            summary: newReport.summary,
          };
          return {
            ...p,
            reports: [reportSummaryItem, ...(p.reports || [])],
          };
        }
        return p;
      });

      return {
        ...prev,
        reports: [newReport, ...prev.reports],
        patients: updatedPatients,
      };
    });

    logAction("Admin Operations", "Admin", "Uploaded Clinical Report", "File Uploads", reportPayload.patientName, `Uploaded '${reportPayload.title}' (${reportPayload.category}) linked to ${reportPayload.patientName}.`);
    return newReport;
  };

  const deleteReport = (id: string) => {
    const rep = store.reports.find((r) => r.id === id);
    setStore((prev) => ({
      ...prev,
      reports: prev.reports.filter((r) => r.id !== id),
      patients: prev.patients.map((p) => ({
        ...p,
        reports: p.reports ? p.reports.filter((r) => r.id !== id) : [],
      })),
    }));
    logAction("Admin Operations", "Admin", "Deleted Clinical Report", "File Uploads", rep?.title || id, `Removed document record from patient repository.`);
  };

  // Disease Template CRUD
  const addTemplate = (templatePayload: Omit<DiseaseTemplate, "id" | "createdAt" | "updatedAt">): DiseaseTemplate => {
    const dateStr = new Date().toISOString().split("T")[0];
    const newTemplate: DiseaseTemplate = {
      ...templatePayload,
      id: "tmpl-" + Math.random().toString(36).substring(2, 8),
      createdAt: dateStr,
      updatedAt: dateStr,
    };

    setStore((prev) => ({
      ...prev,
      templates: [newTemplate, ...prev.templates],
    }));

    logAction("Admin Operations", "Admin", "Created Disease Template", "Admin Activity", newTemplate.title, `Published question template for ${newTemplate.diseaseName}.`);
    return newTemplate;
  };

  const updateTemplate = (id: string, updates: Partial<DiseaseTemplate>) => {
    const dateStr = new Date().toISOString().split("T")[0];
    setStore((prev) => ({
      ...prev,
      templates: prev.templates.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: dateStr } : t)),
    }));
    logAction("Admin Operations", "Admin", "Updated Disease Template", "Admin Activity", id, `Updated disease questionnaire structure.`);
  };

  const deleteTemplate = (id: string) => {
    const tmpl = store.templates.find((t) => t.id === id);
    setStore((prev) => ({
      ...prev,
      templates: prev.templates.filter((t) => t.id !== id),
    }));
    logAction("Admin Operations", "Admin", "Deleted Disease Template", "Admin Activity", tmpl?.title || id, `Removed template from active system catalog.`);
  };

  const toggleTemplateStatus = (id: string) => {
    setStore((prev) => ({
      ...prev,
      templates: prev.templates.map((t) => (t.id === id ? { ...t, enabled: !t.enabled, updatedAt: new Date().toISOString().split("T")[0] } : t)),
    }));
    logAction("Admin Operations", "Admin", "Toggled Template Status", "Admin Activity", id, `Changed active availability status.`);
  };

  // Audit Log Action
  const addAuditLog = (logPayload: Omit<AuditLog, "id" | "timestamp">) => {
    logAction(logPayload.actorName, logPayload.actorRole, logPayload.action, logPayload.category, logPayload.target, logPayload.details);
  };

  // Role Permissions
  const updateRolePermission = (roleName: "patient" | "doctor" | "admin", permissionKey: string, value: boolean) => {
    setStore((prev) => ({
      ...prev,
      roles: prev.roles.map((r) => {
        if (r.role === roleName) {
          return {
            ...r,
            permissions: {
              ...r.permissions,
              [permissionKey]: value,
            },
          };
        }
        return r;
      }),
    }));
    logAction("Admin Operations", "Admin", "Updated Access Permissions", "Admin Activity", roleName, `Changed permission '${permissionKey}' to ${value}.`);
  };

  return (
    <AdminContext.Provider
      value={{
        patients: store.patients,
        doctors: store.doctors,
        reports: store.reports,
        templates: store.templates,
        auditLogs: store.auditLogs,
        roles: store.roles,
        addPatient,
        updatePatient,
        deletePatient,
        assignDoctorToPatient,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        assignPatientsToDoctor,
        addReport,
        deleteReport,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        toggleTemplateStatus,
        addAuditLog,
        updateRolePermission,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
