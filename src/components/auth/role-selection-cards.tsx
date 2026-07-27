"use client";

import { motion } from "framer-motion";
import { ArrowRight, HeartPulse, Shield, Stethoscope, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type RoleType = "patient" | "doctor" | "admin";

interface RoleCardProps {
  role: RoleType;
  title: string;
  badge: string;
  description: string;
  icon: typeof UserCheck;
  activeRole?: RoleType;
  onSelect: (role: RoleType) => void;
  accentColor: "blue" | "emerald" | "slate";
}

const rolesData: RoleCardProps[] = [
  {
    role: "patient",
    title: "Patient Portal",
    badge: "Aadhaar Verified",
    description: "Access daily recovery check-ins, medication tracking, diet plans, and direct doctor updates.",
    icon: HeartPulse,
    accentColor: "blue",
    onSelect: () => {},
  },
  {
    role: "doctor",
    title: "Doctor Workspace",
    badge: "Clinical Gateway",
    description: "Monitor patient discharge trends, risk levels, questionnaires, and approve recovery milestones.",
    icon: Stethoscope,
    accentColor: "emerald",
    onSelect: () => {},
  },
  {
    role: "admin",
    title: "Admin Portal",
    badge: "System Governance",
    description: "Manage patient lifecycles, assign care teams, upload clinical reports, and configure templates.",
    icon: Shield,
    accentColor: "slate",
    onSelect: () => {},
  },
];

export function RoleSelectionCards({
  selectedRole,
  onSelectRole,
}: {
  selectedRole?: RoleType;
  onSelectRole: (role: RoleType) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
      {rolesData.map((item) => {
        const Icon = item.icon;
        const isSelected = selectedRole === item.role;

        return (
          <motion.div
            key={item.role}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => onSelectRole(item.role)}
            className={cn(
              "group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border p-6 backdrop-blur-xl transition-all duration-300",
              isSelected
                ? "border-blue-500/80 bg-white/95 shadow-xl shadow-blue-500/10 dark:border-blue-500 dark:bg-slate-900/95"
                : "border-slate-200/80 bg-white/60 hover:border-slate-300 hover:bg-white/90 hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900/60 dark:hover:border-slate-700 dark:hover:bg-slate-900/90"
            )}
          >
            {/* Subtle glow highlight on hover */}
            <div
              className={cn(
                "absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-100",
                item.role === "patient" && "bg-blue-500/30",
                item.role === "doctor" && "bg-emerald-500/30",
                item.role === "admin" && "bg-slate-500/30"
              )}
            />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                    item.role === "patient" && "bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400",
                    item.role === "doctor" && "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400",
                    item.role === "admin" && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  )}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase",
                    item.role === "patient" && "bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300",
                    item.role === "doctor" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300",
                    item.role === "admin" && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  )}
                >
                  {item.badge}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Select {item.role.charAt(0).toUpperCase() + item.role.slice(1)} Login
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all dark:bg-slate-800 dark:text-slate-300">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
