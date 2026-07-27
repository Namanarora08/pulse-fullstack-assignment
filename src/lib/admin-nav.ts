import {
  LayoutDashboard,
  Users,
  Stethoscope,
  FileText,
  ClipboardList,
  ShieldAlert,
  UserCheck,
} from "lucide-react";

export const adminNavItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/patients", label: "Patients", icon: Users },
  { href: "/admin/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/admin/reports", label: "Clinical Uploads", icon: FileText },
  { href: "/admin/templates", label: "Disease Templates", icon: ClipboardList },
  { href: "/admin/governance", label: "System Audit", icon: ShieldAlert },
  { href: "/admin/roles", label: "Role & Access", icon: UserCheck },
];
