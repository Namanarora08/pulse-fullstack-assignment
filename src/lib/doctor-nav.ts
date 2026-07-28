import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  ClipboardList,
  Settings
} from "lucide-react";

export const doctorNavItems = [
  { href: "/doctor", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctor/patients", label: "Patient List", icon: Users, badge: "12" },
  { href: "/doctor/analytics", label: "Analytics", icon: BarChart3 },
  {
    href: "/doctor/questions",
    label: "Question Management",
    icon: ClipboardList
  },
  { href: "/doctor/reports", label: "Clinical Reports", icon: FileText },
  { href: "/doctor/settings", label: "Settings", icon: Settings }
];
