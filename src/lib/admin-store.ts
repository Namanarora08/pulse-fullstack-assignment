import { DEMO_PATIENTS, DEMO_DOCTORS, PatientRecord, DoctorRecord, PatientReport } from "./auth";

export interface ClinicalDocument extends PatientReport {
  patientId: string;
  patientName: string;
  doctorId: string;
  fileType?: string;
  url?: string;
}

export interface QuestionTemplateItem {
  id: string;
  prompt: string;
  type: "YES_NO" | "SCALE" | "NUMERIC";
  category: "SYMPTOM" | "ADHERENCE";
  minLabel?: string;
  maxLabel?: string;
  minValue?: number;
  maxValue?: number;
  unit?: string;
}

export interface DiseaseTemplate {
  id: string;
  title: string;
  diseaseName: "Diabetes" | "Hypertension" | "Heart Disease" | "Asthma" | "Kidney Disease" | "Cancer Recovery" | "Post Surgery" | string;
  description: string;
  enabled: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  questions: QuestionTemplateItem[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: "Admin" | "Doctor" | "Patient" | "System";
  action: string;
  category: "Recent Logins" | "Data Changes" | "Patient Updates" | "Doctor Activity" | "Admin Activity" | "File Uploads" | "System Events";
  target: string;
  details: string;
  ipAddress?: string;
}

export interface RoleConfig {
  role: "patient" | "doctor" | "admin";
  displayName: string;
  userCount: number;
  permissions: {
    viewMedicalRecords: boolean;
    editPatientPlans: boolean;
    uploadReports: boolean;
    manageTemplates: boolean;
    auditAccess: boolean;
    manageUsers: boolean;
  };
}

const LOCAL_STORAGE_ADMIN_KEY = "pulse_admin_store_v2";

export interface AdminStoreData {
  patients: PatientRecord[];
  doctors: DoctorRecord[];
  reports: ClinicalDocument[];
  templates: DiseaseTemplate[];
  auditLogs: AuditLog[];
  roles: RoleConfig[];
}

export const INITIAL_DISEASE_TEMPLATES: DiseaseTemplate[] = [
  {
    id: "tmpl-cardiac-p2",
    title: "Phase 2 Cardiac Recovery Protocol",
    diseaseName: "Heart Disease",
    description: "Daily symptom tracking, chest pain monitoring, and medication compliance for post-stent & CABG patients.",
    enabled: true,
    usageCount: 42,
    createdAt: "2026-06-01",
    updatedAt: "2026-07-20",
    questions: [
      {
        id: "q1",
        prompt: "Did you experience any chest pressure, tightness, or shortness of breath today?",
        type: "YES_NO",
        category: "SYMPTOM",
      },
      {
        id: "q2",
        prompt: "Rate your overall surgical incision or muscular chest pain level today (0 = No Pain, 10 = Severe Pain)",
        type: "SCALE",
        category: "SYMPTOM",
        minLabel: "No Pain",
        maxLabel: "Severe Pain",
        minValue: 0,
        maxValue: 10,
      },
      {
        id: "q3",
        prompt: "Did you take all prescribed cardiology medications (antiplatelets, statins, beta-blockers) on schedule?",
        type: "YES_NO",
        category: "ADHERENCE",
      },
      {
        id: "q4",
        prompt: "Record your morning Resting Heart Rate reading (BPM)",
        type: "NUMERIC",
        category: "SYMPTOM",
        unit: "BPM",
      },
      {
        id: "q5",
        prompt: "Record your morning Systolic Blood Pressure reading (mmHg)",
        type: "NUMERIC",
        category: "SYMPTOM",
        unit: "mmHg",
      },
    ],
  },
  {
    id: "tmpl-diabetes-type2",
    title: "Type 2 Diabetes Glycemic Control Template",
    diseaseName: "Diabetes",
    description: "Fasting glucose, postprandial blood sugar tracking, insulin adherence, and foot inspection.",
    enabled: true,
    usageCount: 28,
    createdAt: "2026-06-10",
    updatedAt: "2026-07-15",
    questions: [
      {
        id: "dq1",
        prompt: "Did you check your fasting blood glucose before breakfast?",
        type: "YES_NO",
        category: "ADHERENCE",
      },
      {
        id: "dq2",
        prompt: "Record your Fasting Blood Glucose level (mg/dL)",
        type: "NUMERIC",
        category: "SYMPTOM",
        unit: "mg/dL",
      },
      {
        id: "dq3",
        prompt: "Did you experience any symptoms of hypoglycemia (shakiness, sweating, confusion)?",
        type: "YES_NO",
        category: "SYMPTOM",
      },
      {
        id: "dq4",
        prompt: "Rate your energy levels today (1 = Very Low, 5 = High Energy)",
        type: "SCALE",
        category: "SYMPTOM",
        minLabel: "Exhausted",
        maxLabel: "Energetic",
        minValue: 1,
        maxValue: 5,
      },
    ],
  },
  {
    id: "tmpl-hypertension-mgt",
    title: "Essential Hypertension Daily Care Template",
    diseaseName: "Hypertension",
    description: "Dual daily BP logs, sodium restriction adherence, and headache/dizziness symptom tracking.",
    enabled: true,
    usageCount: 35,
    createdAt: "2026-06-15",
    updatedAt: "2026-07-18",
    questions: [
      {
        id: "hq1",
        prompt: "Did you experience morning headaches, visual changes, or unexplained dizziness?",
        type: "YES_NO",
        category: "SYMPTOM",
      },
      {
        id: "hq2",
        prompt: "Record morning Systolic Blood Pressure (mmHg)",
        type: "NUMERIC",
        category: "SYMPTOM",
        unit: "mmHg",
      },
      {
        id: "hq3",
        prompt: "Record morning Diastolic Blood Pressure (mmHg)",
        type: "NUMERIC",
        category: "SYMPTOM",
        unit: "mmHg",
      },
      {
        id: "hq4",
        prompt: "Did you adhere to the prescribed low-sodium (<2000mg/day) diet guidelines?",
        type: "YES_NO",
        category: "ADHERENCE",
      },
    ],
  },
  {
    id: "tmpl-asthma-control",
    title: "Severe Asthma Symptom & Inhaler Tracking",
    diseaseName: "Asthma",
    description: "Peak flow meter readings, rescue inhaler frequency, and nocturnal wheezing logs.",
    enabled: true,
    usageCount: 19,
    createdAt: "2026-06-20",
    updatedAt: "2026-07-12",
    questions: [
      {
        id: "aq1",
        prompt: "Did you wake up during the night due to coughing, wheezing, or tightness?",
        type: "YES_NO",
        category: "SYMPTOM",
      },
      {
        id: "aq2",
        prompt: "Record your Peak Expiratory Flow Rate (L/min)",
        type: "NUMERIC",
        category: "SYMPTOM",
        unit: "L/min",
      },
      {
        id: "aq3",
        prompt: "How many rescue inhaler puffs did you use today?",
        type: "NUMERIC",
        category: "ADHERENCE",
        unit: "puffs",
      },
    ],
  },
  {
    id: "tmpl-kidney-disease",
    title: "Chronic Kidney Disease (CKD) Monitor",
    diseaseName: "Kidney Disease",
    description: "Fluid retention, peripheral edema checks, blood pressure monitoring, and renal diet compliance.",
    enabled: true,
    usageCount: 14,
    createdAt: "2026-06-25",
    updatedAt: "2026-07-10",
    questions: [
      {
        id: "kq1",
        prompt: "Did you notice new swelling (edema) in your feet, ankles, or legs today?",
        type: "YES_NO",
        category: "SYMPTOM",
      },
      {
        id: "kq2",
        prompt: "Record your body weight this morning (kg)",
        type: "NUMERIC",
        category: "SYMPTOM",
        unit: "kg",
      },
      {
        id: "kq3",
        prompt: "Did you stay within your daily fluid intake limit?",
        type: "YES_NO",
        category: "ADHERENCE",
      },
    ],
  },
  {
    id: "tmpl-cancer-recovery",
    title: "Post-Chemotherapy & Oncology Recovery",
    diseaseName: "Cancer Recovery",
    description: "Nausea severity, temperature monitoring for neutropenic fever, and fatigue score.",
    enabled: true,
    usageCount: 22,
    createdAt: "2026-07-01",
    updatedAt: "2026-07-22",
    questions: [
      {
        id: "cq1",
        prompt: "Record morning body temperature (°C)",
        type: "NUMERIC",
        category: "SYMPTOM",
        unit: "°C",
      },
      {
        id: "cq2",
        prompt: "Rate nausea severity today (0 = None, 10 = Severe Nausea)",
        type: "SCALE",
        category: "SYMPTOM",
        minLabel: "None",
        maxLabel: "Severe",
        minValue: 0,
        maxValue: 10,
      },
      {
        id: "cq3",
        prompt: "Did you take anti-emetic medications prior to meals as directed?",
        type: "YES_NO",
        category: "ADHERENCE",
      },
    ],
  },
  {
    id: "tmpl-post-surgery",
    title: "General Post-Surgical Rehabilitation",
    diseaseName: "Post Surgery",
    description: "Wound redness check, drain output, mobility progress, and analgesia intake.",
    enabled: true,
    usageCount: 31,
    createdAt: "2026-07-05",
    updatedAt: "2026-07-25",
    questions: [
      {
        id: "psq1",
        prompt: "Is there any increased redness, warmth, or discharge from your surgical site?",
        type: "YES_NO",
        category: "SYMPTOM",
      },
      {
        id: "psq2",
        prompt: "Rate current pain level at rest (0 = No Pain, 10 = Maximum Pain)",
        type: "SCALE",
        category: "SYMPTOM",
        minLabel: "Comfortable",
        maxLabel: "Unbearable",
        minValue: 0,
        maxValue: 10,
      },
      {
        id: "psq3",
        prompt: "Did you perform your prescribed physical therapy exercises today?",
        type: "YES_NO",
        category: "ADHERENCE",
      },
    ],
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-101",
    timestamp: "2026-07-27 06:45:12",
    actorName: "Admin Operations",
    actorRole: "Admin",
    action: "Uploaded Clinical Report",
    category: "File Uploads",
    target: "Rahul Sharma (P-88201)",
    details: "Uploaded 'Post-Surgical Cardiac Echo Scan Report' (5.2 MB)",
    ipAddress: "192.168.1.100",
  },
  {
    id: "log-102",
    timestamp: "2026-07-27 06:12:00",
    actorName: "Rahul Sharma",
    actorRole: "Patient",
    action: "Daily Check-in Completed",
    category: "Patient Updates",
    target: "Daily Recovery Checklist",
    details: "Logged vitals (HR 68, BP 118/76), 0 pain scale. Streak updated to 14 days.",
    ipAddress: "10.0.4.15",
  },
  {
    id: "log-103",
    timestamp: "2026-07-26 21:04:30",
    actorName: "Dr. Sarah Jenkins",
    actorRole: "Doctor",
    action: "Reviewed Patient Vitals & Notes",
    category: "Doctor Activity",
    target: "Rahul Sharma (P-88201)",
    details: "Added clinical note: 'Maintain low sodium and continue cardiac rehab walking protocol.'",
    ipAddress: "172.16.0.42",
  },
  {
    id: "log-104",
    timestamp: "2026-07-26 18:30:15",
    actorName: "Admin Operations",
    actorRole: "Admin",
    action: "Updated Disease Template",
    category: "Admin Activity",
    target: "Phase 2 Cardiac Recovery Protocol",
    details: "Enabled template and set default usage across cardiology department.",
    ipAddress: "192.168.1.100",
  },
  {
    id: "log-105",
    timestamp: "2026-07-26 14:20:00",
    actorName: "Dr. Amara Okafor",
    actorRole: "Doctor",
    action: "Assigned Patient to Doctor",
    category: "Doctor Activity",
    target: "Jordan Lee (P-77002)",
    details: "Reassigned patient care team to Post-Discharge Care Unit.",
    ipAddress: "172.16.0.88",
  },
  {
    id: "log-106",
    timestamp: "2026-07-26 09:00:11",
    actorName: "System Auth Service",
    actorRole: "System",
    action: "Successful User Authentication",
    category: "Recent Logins",
    target: "admin@stjudehealth.org",
    details: "Session granted with administrative credentials.",
    ipAddress: "192.168.1.100",
  },
  {
    id: "log-107",
    timestamp: "2026-07-25 11:15:00",
    actorName: "System Monitor",
    actorRole: "System",
    action: "Database Backup Completed",
    category: "System Events",
    target: "PostgreSQL Production DB",
    details: "Automated snapshot backup verified successfully.",
    ipAddress: "127.0.0.1",
  },
];

export const INITIAL_ROLES: RoleConfig[] = [
  {
    role: "admin",
    displayName: "System Administrator",
    userCount: 3,
    permissions: {
      viewMedicalRecords: true,
      editPatientPlans: true,
      uploadReports: true,
      manageTemplates: true,
      auditAccess: true,
      manageUsers: true,
    },
  },
  {
    role: "doctor",
    displayName: "Attending Cardiologist / Physician",
    userCount: 42,
    permissions: {
      viewMedicalRecords: true,
      editPatientPlans: true,
      uploadReports: true,
      manageTemplates: true,
      auditAccess: false,
      manageUsers: false,
    },
  },
  {
    role: "patient",
    displayName: "Enrolled Patient",
    userCount: 1248,
    permissions: {
      viewMedicalRecords: true,
      editPatientPlans: false,
      uploadReports: false,
      manageTemplates: false,
      auditAccess: false,
      manageUsers: false,
    },
  },
];

export function getInitialAdminStore(): AdminStoreData {
  if (typeof window === "undefined") {
    return {
      patients: DEMO_PATIENTS,
      doctors: DEMO_DOCTORS,
      reports: [
        {
          id: "rep-1",
          title: "Hospital Discharge Summary & Cardiac Assessment",
          category: "Discharge Summary",
          date: "2026-07-12",
          doctorName: "Dr. Sarah Jenkins",
          size: "2.4 MB",
          summary: "Patient discharged in stable condition following LAD stent placement. Ejection fraction 58%. Hemodynamics normal.",
          patientId: "pat-rahul-88201",
          patientName: "Rahul Sharma",
          doctorId: "doc-sarah-jenkins",
        },
        {
          id: "rep-2",
          title: "Post-Discharge Blood Panel (CBC, Lipid & Troponin)",
          category: "Blood",
          date: "2026-07-20",
          doctorName: "Dr. Sarah Jenkins",
          size: "1.1 MB",
          summary: "Troponin I levels normalized (< 0.01 ng/mL). Total cholesterol 155 mg/dL. LDL 72 mg/dL. Excellent lipid response.",
          patientId: "pat-rahul-88201",
          patientName: "Rahul Sharma",
          doctorId: "doc-sarah-jenkins",
        },
        {
          id: "rep-3",
          title: "ECG 12-Lead Electrocardiogram",
          category: "Lab",
          date: "2026-07-22",
          doctorName: "Dr. Sarah Jenkins",
          size: "3.8 MB",
          summary: "Normal sinus rhythm, HR 66 bpm. No ST-segment elevation or new ischemic changes.",
          patientId: "pat-rahul-88201",
          patientName: "Rahul Sharma",
          doctorId: "doc-sarah-jenkins",
        },
        {
          id: "rep-4",
          title: "Post-Surgical Cardiac Echo Scan Report",
          category: "Scan",
          date: "2026-07-24",
          doctorName: "Dr. Sarah Jenkins",
          size: "5.2 MB",
          summary: "Transthoracic echocardiogram demonstrates normal LV systolic function without wall motion abnormalities.",
          patientId: "pat-rahul-88201",
          patientName: "Rahul Sharma",
          doctorId: "doc-sarah-jenkins",
        },
        {
          id: "rep-5",
          title: "Cardiology Discharge Prescription",
          category: "Prescription",
          date: "2026-07-12",
          doctorName: "Dr. Sarah Jenkins",
          size: "850 KB",
          summary: "Dual antiplatelet therapy prescribed alongside atorvastatin and metoprolol.",
          patientId: "pat-rahul-88201",
          patientName: "Rahul Sharma",
          doctorId: "doc-sarah-jenkins",
        },
        {
          id: "j-rep-1",
          title: "Initial Discharge Summary",
          category: "Discharge Summary",
          date: "2026-07-15",
          doctorName: "Dr. Amara Okafor",
          size: "1.8 MB",
          summary: "Discharged following mild MI treatment.",
          patientId: "pat-jordan-77002",
          patientName: "Jordan Lee",
          doctorId: "doc-amara-okafor",
        },
      ],
      templates: INITIAL_DISEASE_TEMPLATES,
      auditLogs: INITIAL_AUDIT_LOGS,
      roles: INITIAL_ROLES,
    };
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ADMIN_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AdminStoreData;
      if (parsed.patients && parsed.doctors && parsed.reports && parsed.templates) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to read persisted admin store, reseeding defaults:", err);
  }

  const initialStore: AdminStoreData = {
    patients: DEMO_PATIENTS,
    doctors: DEMO_DOCTORS,
    reports: [
      {
        id: "rep-1",
        title: "Hospital Discharge Summary & Cardiac Assessment",
        category: "Discharge Summary",
        date: "2026-07-12",
        doctorName: "Dr. Sarah Jenkins",
        size: "2.4 MB",
        summary: "Patient discharged in stable condition following LAD stent placement. Ejection fraction 58%. Hemodynamics normal.",
        patientId: "pat-rahul-88201",
        patientName: "Rahul Sharma",
        doctorId: "doc-sarah-jenkins",
      },
      {
        id: "rep-2",
        title: "Post-Discharge Blood Panel (CBC, Lipid & Troponin)",
        category: "Blood",
        date: "2026-07-20",
        doctorName: "Dr. Sarah Jenkins",
        size: "1.1 MB",
        summary: "Troponin I levels normalized (< 0.01 ng/mL). Total cholesterol 155 mg/dL. LDL 72 mg/dL. Excellent lipid response.",
        patientId: "pat-rahul-88201",
        patientName: "Rahul Sharma",
        doctorId: "doc-sarah-jenkins",
      },
      {
        id: "rep-3",
        title: "ECG 12-Lead Electrocardiogram",
        category: "Lab",
        date: "2026-07-22",
        doctorName: "Dr. Sarah Jenkins",
        size: "3.8 MB",
        summary: "Normal sinus rhythm, HR 66 bpm. No ST-segment elevation or new ischemic changes.",
        patientId: "pat-rahul-88201",
        patientName: "Rahul Sharma",
        doctorId: "doc-sarah-jenkins",
      },
      {
        id: "rep-4",
        title: "Post-Surgical Cardiac Echo Scan Report",
        category: "Scan",
        date: "2026-07-24",
        doctorName: "Dr. Sarah Jenkins",
        size: "5.2 MB",
        summary: "Transthoracic echocardiogram demonstrates normal LV systolic function without wall motion abnormalities.",
        patientId: "pat-rahul-88201",
        patientName: "Rahul Sharma",
        doctorId: "doc-sarah-jenkins",
      },
      {
        id: "rep-5",
        title: "Cardiology Discharge Prescription",
        category: "Prescription",
        date: "2026-07-12",
        doctorName: "Dr. Sarah Jenkins",
        size: "850 KB",
        summary: "Dual antiplatelet therapy prescribed alongside atorvastatin and metoprolol.",
        patientId: "pat-rahul-88201",
        patientName: "Rahul Sharma",
        doctorId: "doc-sarah-jenkins",
      },
      {
        id: "j-rep-1",
        title: "Initial Discharge Summary",
        category: "Discharge Summary",
        date: "2026-07-15",
        doctorName: "Dr. Amara Okafor",
        size: "1.8 MB",
        summary: "Discharged following mild MI treatment.",
        patientId: "pat-jordan-77002",
        patientName: "Jordan Lee",
        doctorId: "doc-amara-okafor",
      },
    ],
    templates: INITIAL_DISEASE_TEMPLATES,
    auditLogs: INITIAL_AUDIT_LOGS,
    roles: INITIAL_ROLES,
  };

  saveAdminStore(initialStore);
  return initialStore;
}

export function saveAdminStore(data: AdminStoreData): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, JSON.stringify(data));
    } catch (err) {
      console.error("Failed to persist admin store to localStorage:", err);
    }
  }
}
