import {
  Activity,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Thermometer,
  UsersRound
} from "lucide-react";

export const overviewMetrics = [
  {
    label: "Active patients",
    value: "128",
    detail: "Across monitored care plans",
    trend: "up" as const,
    icon: UsersRound
  },
  {
    label: "Check-ins today",
    value: "84%",
    detail: "Placeholder completion rate",
    trend: "stable" as const,
    icon: Activity
  },
  {
    label: "Vitals reviewed",
    value: "312",
    detail: "Mock observations queued",
    trend: "up" as const,
    icon: HeartPulse
  },
  {
    label: "Care alerts",
    value: "6",
    detail: "UI-only alert preview",
    trend: "down" as const,
    icon: ShieldCheck
  }
];

export const patientMetrics = [
  {
    label: "Resting heart rate",
    value: "72",
    detail: "beats per minute",
    trend: "stable" as const,
    icon: HeartPulse
  },
  {
    label: "Temperature",
    value: "98.4",
    detail: "degrees Fahrenheit",
    trend: "stable" as const,
    icon: Thermometer
  },
  {
    label: "Care team",
    value: "3",
    detail: "assigned clinicians",
    trend: "up" as const,
    icon: Stethoscope
  }
];

export const trendData = [
  { label: "Mon", value: 68 },
  { label: "Tue", value: 72 },
  { label: "Wed", value: 70 },
  { label: "Thu", value: 76 },
  { label: "Fri", value: 73 },
  { label: "Sat", value: 71 },
  { label: "Sun", value: 74 }
];

export const patientRows = [
  { id: "demo", name: "Avery Stone", status: "Stable", checkIn: "Complete" },
  { id: "mira", name: "Mira Patel", status: "Watch", checkIn: "Pending" },
  { id: "jordan", name: "Jordan Lee", status: "Improving", checkIn: "Complete" }
];

export const activityItems = [
  "Morning check-in completed",
  "Vitals card refreshed",
  "Care team note placeholder",
  "Weekly trend preview generated"
];
