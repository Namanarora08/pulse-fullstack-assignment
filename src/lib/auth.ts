export type UserRole = "patient" | "doctor" | "admin";

export interface PatientReport {
  id: string;
  title: string;
  category: "Blood" | "Lab" | "Prescription" | "Scan" | "Discharge Summary" | "Medical Images" | "Other Clinical Documents";
  date: string;
  doctorName: string;
  size: string;
  summary: string;
}

export interface PatientMeal {
  id: string;
  meal: "Breakfast" | "Lunch" | "Dinner" | "Snacks";
  title: string;
  calories: number;
  items: string[];
  completed: boolean;
  instructions: string;
}

export interface PatientNotification {
  id: string;
  title: string;
  message: string;
  type: "medication" | "meal" | "water" | "checkin" | "doctor";
  timestamp: string;
  read: boolean;
}

export interface PatientMilestone {
  id: string;
  stage: string;
  title: string;
  date: string;
  description: string;
  completed: boolean;
}

export interface PatientRecord {
  id: string;
  name: string;
  email: string;
  aadhaar: string;
  dob: string;
  patientIdCode: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  assignedDoctor: {
    id: string;
    name: string;
    title: string;
    email: string;
    department: string;
  };
  medicalHistory: {
    condition: string;
    hospital: string;
    dischargeDate: string;
    notes: string;
    allergies: string[];
  };
  diseaseInfo: {
    name: string;
    stage: string;
    riskCategory: "Low" | "Moderate" | "High";
    summary: string;
  };
  medicationPlan: {
    id: string;
    name: string;
    dosage: string;
    timing: string;
    instructions: string;
    morningCompleted?: boolean;
    afternoonCompleted?: boolean;
    nightCompleted?: boolean;
  }[];
  dietPlan: {
    type: string;
    dailyCalories: string;
    sodiumLimit: string;
    hydrationTarget: string;
    recommendations: string[];
    meals: PatientMeal[];
  };
  vitals: {
    sleepHours: number;
    sleepQuality: string;
    waterIntakeLiters: number;
    waterTargetLiters: number;
    stepsCount: number;
    heartRateBpm: number;
  };
  badgeInfo: {
    level: "Bronze" | "Silver" | "Gold" | "Platinum";
    points: number;
    targetPoints: number;
    legend: string;
  };
  reports: PatientReport[];
  timeline: PatientMilestone[];
  notifications: PatientNotification[];
  recoveryStatus: {
    streakDays: number;
    completionScore: number;
    readinessRating: string;
    lastCheckIn: string;
    checkInStatus: "Completed" | "Pending" | "Missed";
    nextReminder: string;
  };
  previousCheckIns: {
    date: string;
    completed: boolean;
    symptomsLogged: string[];
    painScale: number;
    notes: string;
  }[];
}

export interface DoctorRecord {
  id: string;
  name: string;
  email: string;
  title: string;
  department: string;
  hospital: string;
  assignedPatientIds: string[];
}

export interface AdminRecord {
  id: string;
  name: string;
  email: string;
  hospitalCode: string;
  department: string;
}

export interface AuthSession {
  role: UserRole;
  user: PatientRecord | DoctorRecord | AdminRecord;
  token: string;
  authenticatedAt: string;
}

// ---------------------------------------------------------------------------
// Demo Database Records
// ---------------------------------------------------------------------------

export const DEMO_PATIENTS: PatientRecord[] = [
  {
    id: "pat-rahul-88201",
    name: "Rahul Sharma",
    email: "rahul.sharma@pulsecare.dev",
    aadhaar: "9876 5432 1098",
    dob: "1988-05-14",
    patientIdCode: "P-88201",
    emergencyContact: {
      name: "Priya Sharma",
      relation: "Spouse",
      phone: "+91 98765 43210",
    },
    assignedDoctor: {
      id: "doc-sarah-jenkins",
      name: "Dr. Sarah Jenkins",
      title: "Chief of Cardiology",
      email: "dr.smith@stjudehealth.org",
      department: "Cardiology & Vascular Institute",
    },
    medicalHistory: {
      condition: "Post-Coronary Stent Placement",
      hospital: "St. Jude Heart Institute",
      dischargeDate: "2026-07-12",
      notes: "Successful drug-eluting stent placement in LAD. Stable hemodynamic recovery.",
      allergies: ["Penicillin", "Sulfa drugs"],
    },
    diseaseInfo: {
      name: "Coronary Artery Disease (CAD)",
      stage: "Post-Surgical Recovery (Phase 2)",
      riskCategory: "Low",
      summary: "Cardiac recovery protocol following stent intervention. Vital signs stable.",
    },
    medicationPlan: [
      {
        id: "m1",
        name: "Aspirin (Ecotrin)",
        dosage: "75mg",
        timing: "Once daily (After lunch)",
        instructions: "Take with food to prevent gastric discomfort.",
        morningCompleted: false,
        afternoonCompleted: true,
        nightCompleted: false,
      },
      {
        id: "m2",
        name: "Atorvastatin (Lipitor)",
        dosage: "40mg",
        timing: "Once daily (At bedtime)",
        instructions: "Maintain cholesterol control.",
        morningCompleted: false,
        afternoonCompleted: false,
        nightCompleted: false,
      },
      {
        id: "m3",
        name: "Metoprolol Succinate",
        dosage: "25mg",
        timing: "Twice daily (Morning & Evening)",
        instructions: "Monitor heart rate prior to administration.",
        morningCompleted: true,
        afternoonCompleted: false,
        nightCompleted: false,
      },
    ],
    dietPlan: {
      type: "Mediterranean Cardiac Recovery Diet",
      dailyCalories: "1,800 - 2,000 kcal",
      sodiumLimit: "< 2,000 mg / day",
      hydrationTarget: "2.5 Liters daily",
      recommendations: [
        "Include rich omega-3 fatty acids (salmon, walnuts, olive oil)",
        "Avoid high-sodium processed foods and fried items",
        "Maintain lean protein and fiber intake across meals",
      ],
      meals: [
        {
          id: "meal-1",
          meal: "Breakfast",
          title: "Oatmeal with Walnuts & Berries",
          calories: 420,
          items: ["Steel-cut oats (1 cup)", "Chopped walnuts (15g)", "Fresh blueberries (50g)", "Skimmed milk (200ml)"],
          completed: true,
          instructions: "No added refined sugar. High fiber heart support.",
        },
        {
          id: "meal-2",
          meal: "Lunch",
          title: "Grilled Salmon & Quinoa Salad",
          calories: 580,
          items: ["Grilled salmon fillet (150g)", "Quinoa with herbs (1 cup)", "Steamed broccoli", "Extra virgin olive oil dressing"],
          completed: true,
          instructions: "Rich in omega-3 fatty acids. Low sodium seasoning.",
        },
        {
          id: "meal-3",
          meal: "Snacks",
          title: "Unsalted Almonds & Green Tea",
          calories: 180,
          items: ["Raw unsalted almonds (12-15 nuts)", "Unsweetened green tea (1 cup)"],
          completed: false,
          instructions: "Mid-afternoon antioxidant boost.",
        },
        {
          id: "meal-4",
          meal: "Dinner",
          title: "Steamed Chicken Breast & Brown Rice",
          calories: 520,
          items: ["Herb steamed chicken breast (150g)", "Steamed brown rice (1/2 cup)", "Sautéed spinach with garlic"],
          completed: false,
          instructions: "Eat before 8:00 PM for optimal digestion.",
        },
      ],
    },
    vitals: {
      sleepHours: 7.5,
      sleepQuality: "Restful (85% Deep Sleep)",
      waterIntakeLiters: 1.75,
      waterTargetLiters: 2.5,
      stepsCount: 4250,
      heartRateBpm: 68,
    },
    badgeInfo: {
      level: "Gold",
      points: 840,
      targetPoints: 1000,
      legend: "Level Legend: Bronze (0-299 pts) • Silver (300-599 pts) • Gold (600-899 pts) • Platinum (900+ pts)",
    },
    reports: [
      {
        id: "rep-1",
        title: "Hospital Discharge Summary & Cardiac Assessment",
        category: "Discharge Summary",
        date: "2026-07-12",
        doctorName: "Dr. Sarah Jenkins",
        size: "2.4 MB",
        summary: "Patient discharged in stable condition following LAD stent placement. Ejection fraction 58%. Hemodynamics normal.",
      },
      {
        id: "rep-2",
        title: "Post-Discharge Blood Panel (CBC, Lipid & Troponin)",
        category: "Blood",
        date: "2026-07-20",
        doctorName: "Dr. Sarah Jenkins",
        size: "1.1 MB",
        summary: "Troponin I levels normalized (< 0.01 ng/mL). Total cholesterol 155 mg/dL. LDL 72 mg/dL. Excellent lipid response.",
      },
      {
        id: "rep-3",
        title: "ECG 12-Lead Electrocardiogram",
        category: "Lab",
        date: "2026-07-22",
        doctorName: "Dr. Sarah Jenkins",
        size: "3.8 MB",
        summary: "Normal sinus rhythm, HR 66 bpm. No ST-segment elevation or new ischemic changes.",
      },
      {
        id: "rep-4",
        title: "Post-Surgical Cardiac Echo Scan Report",
        category: "Scan",
        date: "2026-07-24",
        doctorName: "Dr. Sarah Jenkins",
        size: "5.2 MB",
        summary: "Transthoracic echocardiogram demonstrates normal LV systolic function without wall motion abnormalities.",
      },
      {
        id: "rep-5",
        title: "Cardiology Discharge Prescription",
        category: "Prescription",
        date: "2026-07-12",
        doctorName: "Dr. Sarah Jenkins",
        size: "850 KB",
        summary: "Dual antiplatelet therapy prescribed alongside atorvastatin and metoprolol.",
      },
    ],
    timeline: [
      {
        id: "tl-1",
        stage: "Admission",
        title: "Admitted to St. Jude Cardiac Care Unit",
        date: "2026-07-10",
        description: "Presented with exertional angina. Emergency angiogram confirmed 85% proximal LAD stenosis.",
        completed: true,
      },
      {
        id: "tl-2",
        stage: "Diagnosis & Intervention",
        title: "Successful Percutaneous Coronary Intervention (PCI)",
        date: "2026-07-11",
        description: "Drug-eluting stent successfully deployed in LAD artery. TIMI 3 flow restored.",
        completed: true,
      },
      {
        id: "tl-3",
        stage: "Discharge",
        title: "Discharged with Cardiac Rehabilitation Plan",
        date: "2026-07-12",
        description: "Discharged in stable condition. Onboarding completed for Pulse Care remote tracking.",
        completed: true,
      },
      {
        id: "tl-4",
        stage: "Daily Recovery",
        title: "Phase 2 Cardiac Rehab & Check-ins",
        date: "2026-07-13 to Present",
        description: "Logging daily symptoms, medication adherence, walking vitals, and dietary compliance.",
        completed: true,
      },
      {
        id: "tl-5",
        stage: "Doctor Feedback",
        title: "2-Week Clinical Tele-Consultation",
        date: "2026-07-28",
        description: "Scheduled video review with Dr. Sarah Jenkins to review progress and lab work.",
        completed: false,
      },
      {
        id: "tl-6",
        stage: "Milestones",
        title: "1-Month Post-Stent Full Functional Assessment",
        date: "2026-08-12",
        description: "Target milestone for complete return to moderate aerobic activities.",
        completed: false,
      },
    ],
    notifications: [
      {
        id: "notif-1",
        title: "Medicine Reminder",
        message: "Time for Metoprolol Succinate (25mg) - Evening Dose at 8:00 PM.",
        type: "medication",
        timestamp: "Today at 7:30 PM",
        read: false,
      },
      {
        id: "notif-2",
        title: "Meal & Diet Reminder",
        message: "Log your Dinner meal: Steamed Chicken Breast & Brown Rice.",
        type: "meal",
        timestamp: "Today at 7:00 PM",
        read: false,
      },
      {
        id: "notif-3",
        title: "Water Intake Reminder",
        message: "You are 750ml away from reaching your 2.5L daily hydration target.",
        type: "water",
        timestamp: "Today at 5:00 PM",
        read: true,
      },
      {
        id: "notif-4",
        title: "Check-in Reminder",
        message: "Your daily recovery check-in is pending for today.",
        type: "checkin",
        timestamp: "Today at 9:00 AM",
        read: false,
      },
      {
        id: "notif-5",
        title: "Doctor Message",
        message: "Dr. Sarah Jenkins: 'Great job maintaining your 14-day check-in streak, Rahul! Keep your sodium low.'",
        type: "doctor",
        timestamp: "Yesterday at 4:15 PM",
        read: true,
      },
    ],
    recoveryStatus: {
      streakDays: 14,
      completionScore: 92,
      readinessRating: "Optimal Clinical Progress",
      lastCheckIn: "2026-07-26 at 8:15 PM",
      checkInStatus: "Pending",
      nextReminder: "Today at 8:00 PM",
    },
    previousCheckIns: [
      {
        date: "2026-07-26",
        completed: true,
        symptomsLogged: ["Mild fatigue"],
        painScale: 1,
        notes: "Completed morning walking exercise without chest pressure.",
      },
      {
        date: "2026-07-25",
        completed: true,
        symptomsLogged: ["None"],
        painScale: 0,
        notes: "Vitals normal. Pulse 68 bpm, BP 118/76.",
      },
      {
        date: "2026-07-24",
        completed: true,
        symptomsLogged: ["Slight dizziness"],
        painScale: 2,
        notes: "Hydrated well after afternoon walk. Dizziness resolved.",
      },
    ],
  },
  {
    id: "pat-jordan-77002",
    name: "Jordan Lee",
    email: "patient.improving@pulsecare.dev",
    aadhaar: "1234 5678 9012",
    dob: "1992-09-20",
    patientIdCode: "P-77002",
    emergencyContact: {
      name: "Alex Lee",
      relation: "Sibling",
      phone: "+91 91234 56789",
    },
    assignedDoctor: {
      id: "doc-amara-okafor",
      name: "Dr. Amara Okafor",
      title: "Senior Cardiologist",
      email: "dr.amara.okafor@pulsecare.dev",
      department: "Post-Discharge Care Unit",
    },
    medicalHistory: {
      condition: "Myocardial Infarction - Mild",
      hospital: "Pulse Memorial Hospital",
      dischargeDate: "2026-07-15",
      notes: "Post-MI rehabilitation course progressing smoothly.",
      allergies: ["Latex"],
    },
    diseaseInfo: {
      name: "Ischemic Heart Disease",
      stage: "Post-Acute Phase",
      riskCategory: "Low",
      summary: "Patient shows consistent adherence and improving endurance.",
    },
    medicationPlan: [
      {
        id: "m1",
        name: "Clopidogrel (Plavix)",
        dosage: "75mg",
        timing: "Once daily",
        instructions: "Do not skip doses.",
        morningCompleted: true,
        afternoonCompleted: false,
        nightCompleted: false,
      },
    ],
    dietPlan: {
      type: "Low-Sodium Cardiac Diet",
      dailyCalories: "2,000 kcal",
      sodiumLimit: "< 1,800 mg / day",
      hydrationTarget: "2.0 Liters daily",
      recommendations: ["Increase fresh vegetables and whole grains."],
      meals: [
        {
          id: "j-meal-1",
          meal: "Breakfast",
          title: "Avocado & Whole Grain Toast",
          calories: 380,
          items: ["Whole grain bread (2 slices)", "Avocado mash", "Poached egg"],
          completed: true,
          instructions: "Healthy fats breakfast.",
        },
      ],
    },
    vitals: {
      sleepHours: 8.0,
      sleepQuality: "Good",
      waterIntakeLiters: 2.0,
      waterTargetLiters: 2.0,
      stepsCount: 5100,
      heartRateBpm: 72,
    },
    badgeInfo: {
      level: "Silver",
      points: 480,
      targetPoints: 600,
      legend: "Level Legend: Bronze (0-299 pts) • Silver (300-599 pts) • Gold (600-899 pts) • Platinum (900+ pts)",
    },
    reports: [
      {
        id: "j-rep-1",
        title: "Initial Discharge Summary",
        category: "Discharge Summary",
        date: "2026-07-15",
        doctorName: "Dr. Amara Okafor",
        size: "1.8 MB",
        summary: "Discharged following mild MI treatment.",
      },
    ],
    timeline: [
      {
        id: "j-tl-1",
        stage: "Admission",
        title: "Hospital Care",
        date: "2026-07-13",
        description: "Admitted for observation and stabilization.",
        completed: true,
      },
    ],
    notifications: [],
    recoveryStatus: {
      streakDays: 10,
      completionScore: 88,
      readinessRating: "Steady Recovery",
      lastCheckIn: "2026-07-26",
      checkInStatus: "Pending",
      nextReminder: "Today at 8:00 PM",
    },
    previousCheckIns: [
      {
        date: "2026-07-26",
        completed: true,
        symptomsLogged: ["None"],
        painScale: 0,
        notes: "Feeling good.",
      },
    ],
  },
];

export const DEMO_DOCTORS: DoctorRecord[] = [
  {
    id: "doc-sarah-jenkins",
    name: "Dr. Sarah Jenkins",
    email: "dr.smith@stjudehealth.org",
    title: "Chief of Cardiology",
    department: "Cardiology & Vascular Institute",
    hospital: "St. Jude Heart Institute",
    assignedPatientIds: ["pat-rahul-88201"],
  },
  {
    id: "doc-amara-okafor",
    name: "Dr. Amara Okafor",
    email: "dr.amara.okafor@pulsecare.dev",
    title: "Senior Cardiologist",
    department: "Post-Discharge Care Unit",
    hospital: "Pulse Care Health Center",
    assignedPatientIds: ["pat-jordan-77002"],
  },
];

export const DEMO_ADMIN: AdminRecord = {
  id: "admin-sys-90210",
  name: "Admin Operations",
  email: "admin@stjudehealth.org",
  hospitalCode: "HOSP-90210",
  department: "Hospital Administration & Governance",
};

export const SESSION_COOKIE_NAME = "pulse_session";
