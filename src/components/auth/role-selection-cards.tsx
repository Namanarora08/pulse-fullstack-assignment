"use client";

import { motion } from "framer-motion";
import { ArrowRight, HeartPulse, Shield, Stethoscope } from "lucide-react";

export type RoleType = "patient" | "doctor" | "admin";

const rolesData = [
  {
    role: "patient" as RoleType,
    title: "Patient",
    subtitle: "Recovery Portal",
    description:
      "Daily check-ins, medication tracking, and real-time recovery insights.",
    icon: HeartPulse,
    accent: "#34D399", // recovery green
    accentDim: "rgba(52,211,153,0.08)",
    accentBorder: "rgba(52,211,153,0.18)",
    accentGlow: "0 0 32px rgba(52,211,153,0.15)"
  },
  {
    role: "doctor" as RoleType,
    title: "Doctor",
    subtitle: "Clinical Workspace",
    description:
      "Monitor patient cohorts, review submissions, and manage care plans.",
    icon: Stethoscope,
    accent: "#818CF8", // indigo / neutral purple
    accentDim: "rgba(129,140,248,0.08)",
    accentBorder: "rgba(129,140,248,0.18)",
    accentGlow: "0 0 32px rgba(129,140,248,0.15)"
  },
  {
    role: "admin" as RoleType,
    title: "Admin",
    subtitle: "System Console",
    description:
      "Hospital governance, physician rosters, and system-wide analytics.",
    icon: Shield,
    accent: "#A1A1AA", // neutral zinc
    accentDim: "rgba(161,161,170,0.06)",
    accentBorder: "rgba(161,161,170,0.14)",
    accentGlow: "0 0 32px rgba(161,161,170,0.10)"
  }
];

export function RoleSelectionCards({
  selectedRole,
  onSelectRole
}: {
  selectedRole?: RoleType;
  onSelectRole: (role: RoleType) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {rolesData.map((item, i) => {
        const Icon = item.icon;
        const isSelected = selectedRole === item.role;

        return (
          <motion.button
            key={item.role}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.08,
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => onSelectRole(item.role)}
            className="transition-apple-fast group relative flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left"
            style={{
              background: isSelected
                ? item.accentDim
                : "rgba(255,255,255,0.02)",
              border: `1px solid ${isSelected ? item.accentBorder : "rgba(255,255,255,0.07)"}`,
              boxShadow: isSelected ? item.accentGlow : "none"
            }}
          >
            {/* Icon */}
            <div
              className="transition-apple-fast flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: isSelected
                  ? item.accentDim
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${isSelected ? item.accentBorder : "rgba(255,255,255,0.07)"}`,
                color: isSelected ? item.accent : "#71717A"
              }}
            >
              <Icon className="h-5 w-5" />
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span
                  className="text-sm font-semibold"
                  style={{ color: isSelected ? item.accent : "#FAFAFA" }}
                >
                  {item.title}
                </span>
                <span className="text-xs text-text-muted">{item.subtitle}</span>
              </div>
              <p className="mt-0.5 line-clamp-1 text-xs leading-snug text-text-muted">
                {item.description}
              </p>
            </div>

            {/* Arrow */}
            <motion.div
              animate={{ x: isSelected ? 0 : -4, opacity: isSelected ? 1 : 0 }}
              className="shrink-0"
              style={{ color: item.accent }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>

            {/* Selected indicator bar */}
            {isSelected && (
              <motion.div
                layoutId="role-indicator"
                className="absolute left-0 top-1/2 h-8 w-0.5 -translate-y-1/2 rounded-full"
                style={{ background: item.accent }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
