import {
  LayoutDashboard,
  HeartPulse,
  Pill,
  Utensils,
  FileText,
  Calendar,
  User,
  Bell,
} from "lucide-react";

export const patientNavItems = [
  { href: "/patient", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patient/check-in", label: "Daily Check-in", icon: HeartPulse, badge: "Due" },
  { href: "/patient/medications", label: "Medication", icon: Pill },
  { href: "/patient/diet", label: "Diet Plan", icon: Utensils },
  { href: "/patient/reports", label: "Medical Reports", icon: FileText },
  { href: "/patient/timeline", label: "Recovery Timeline", icon: Calendar },
  { href: "/patient/profile", label: "My Profile", icon: User },
  { href: "/patient/notifications", label: "Notifications", icon: Bell },
];
