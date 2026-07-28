"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Bell,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  X
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-context";

export type RoleType = "patient" | "doctor" | "admin";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
}

interface RoleShellProps {
  role: RoleType;
  title: string;
  description: string;
  navItems: NavItem[];
  children: React.ReactNode;
}

const roleAccent: Record<
  RoleType,
  { color: string; dim: string; border: string }
> = {
  patient: {
    color: "#34D399",
    dim: "rgba(52,211,153,0.10)",
    border: "rgba(52,211,153,0.20)"
  },
  doctor: {
    color: "#818CF8",
    dim: "rgba(129,140,248,0.10)",
    border: "rgba(129,140,248,0.20)"
  },
  admin: {
    color: "#A1A1AA",
    dim: "rgba(161,161,170,0.08)",
    border: "rgba(161,161,170,0.16)"
  }
};

export function RoleShell({ role, navItems, children }: RoleShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const accent = roleAccent[role];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, isLoading, router]);

  const userObj = (user || {}) as Record<string, unknown>;
  const userName =
    user?.name ||
    (role === "patient"
      ? "Rahul Sharma"
      : role === "doctor"
        ? "Dr. Sarah Jenkins"
        : "Admin Operations");
  const userSub =
    role === "patient"
      ? `ID: ${typeof userObj.patientIdCode === "string" ? userObj.patientIdCode : "P-88201"}`
      : role === "doctor"
        ? typeof userObj.title === "string"
          ? userObj.title
          : "Chief of Cardiology"
        : `Director · ${typeof userObj.hospitalCode === "string" ? userObj.hospitalCode : "HOSP-90210"}`;

  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2);

  const notifications: Record<RoleType, string[]> = {
    patient: [
      "Daily recovery check-in due today",
      "Dr. Sarah Jenkins uploaded a new report",
      "Medication reminder: Aspirin 75mg at 8 PM"
    ],
    doctor: [
      "2 new patient check-ins submitted",
      "High risk alert: Patient P-4020",
      "Weekly clinical review generated"
    ],
    admin: [
      "System maintenance at midnight",
      "3 doctor profiles pending validation",
      "EHR sync nominal — 99.98% uptime"
    ]
  };

  const SIDEBAR_W = 260;

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <motion.aside
        initial={false}
        animate={{ x: mobileOpen ? 0 : undefined }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{
          width: SIDEBAR_W,
          background: "#0D0D0F",
          borderRight: "1px solid rgba(255,255,255,0.05)"
        }}
      >
        {/* Brand */}
        <div
          className="flex h-14 items-center justify-between px-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{
                background: accent.dim,
                border: `1px solid ${accent.border}`
              }}
            >
              <Activity
                className="h-3.5 w-3.5"
                style={{ color: accent.color }}
              />
            </div>
            <span className="text-sm font-semibold text-foreground">Pulse</span>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-medium capitalize"
              style={{
                background: accent.dim,
                color: accent.color,
                border: `1px solid ${accent.border}`
              }}
            >
              {role}
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="transition-apple-fast rounded-lg p-1 text-text-muted hover:text-foreground lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div
            className="transition-apple-fast flex h-9 items-center gap-2 rounded-xl px-3 text-xs text-text-muted hover:border-white/[0.12]"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)"
            }}
          >
            <Search className="h-3.5 w-3.5 shrink-0 opacity-60" />
            <span className="flex-1 truncate">Search…</span>
            <kbd className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== `/${role}` && pathname.startsWith(item.href));

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: i * 0.04,
                  type: "spring",
                  stiffness: 300,
                  damping: 28
                }}
              >
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="transition-apple-fast group relative flex h-9 items-center justify-between rounded-xl px-3 text-xs font-medium"
                  style={{
                    background: active ? accent.dim : "transparent",
                    color: active ? accent.color : "#71717A",
                    border: active
                      ? `1px solid ${accent.border}`
                      : "1px solid transparent"
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(255,255,255,0.04)";
                      (e.currentTarget as HTMLElement).style.color = "#FAFAFA";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                      (e.currentTarget as HTMLElement).style.color = "#71717A";
                    }
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId={`nav-active-${role}`}
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: accent.dim,
                        border: `1px solid ${accent.border}`
                      }}
                      transition={{
                        type: "spring",
                        bounce: 0.15,
                        duration: 0.5
                      }}
                    />
                  )}
                  <div className="relative flex items-center gap-2.5">
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className="relative rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                      style={{ background: accent.dim, color: accent.color }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Profile */}
        <div
          className="p-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div
            className="transition-apple-fast flex items-center gap-3 rounded-xl p-3"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.06)"
            }}
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
              style={{
                background: accent.dim,
                color: accent.color,
                border: `1px solid ${accent.border}`
              }}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">
                {userName}
              </p>
              <p className="truncate text-[10px] text-text-muted">{userSub}</p>
            </div>
            <button
              onClick={() => logout()}
              className="transition-apple-fast shrink-0 rounded-lg p-1.5 text-text-muted hover:bg-danger/10 hover:text-danger"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* ── Main area ── */}
      <div className="flex flex-col lg:pl-[260px]">
        {/* Top bar */}
        <header
          className="glass sticky top-0 z-30 flex h-14 items-center justify-between px-5 sm:px-6"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="transition-apple-fast rounded-xl border border-white/[0.07] p-2 text-text-muted hover:text-foreground lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Breadcrumb */}
            <div className="hidden items-center gap-1.5 text-xs text-text-muted sm:flex">
              <span>Pulse</span>
              <ChevronRight className="h-3 w-3 opacity-40" />
              <span className="font-medium capitalize text-text-secondary">
                {role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="transition-apple-fast relative rounded-xl border border-white/[0.07] p-2 text-text-muted hover:text-foreground"
              >
                <Bell className="h-4 w-4" />
                <span
                  className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full"
                  style={{ background: accent.color }}
                />
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{
                      type: "spring",
                      bounce: 0.15,
                      duration: 0.35
                    }}
                    className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl"
                    style={{
                      background: "#18181B",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "0 16px 48px rgba(0,0,0,0.7)"
                    }}
                  >
                    <div
                      className="flex items-center justify-between px-4 py-3"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.06)"
                      }}
                    >
                      <span className="text-xs font-semibold text-foreground">
                        Notifications
                      </span>
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{ background: accent.dim, color: accent.color }}
                      >
                        3 new
                      </span>
                    </div>
                    <div className="space-y-1 p-2">
                      {notifications[role].map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="transition-apple-fast flex cursor-pointer items-start gap-2.5 rounded-xl px-3 py-2.5 text-xs text-text-secondary hover:bg-white/[0.04]"
                        >
                          <span
                            className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: accent.color }}
                          />
                          {msg}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Settings */}
            <button className="transition-apple-fast rounded-xl border border-white/[0.07] p-2 text-text-muted hover:text-foreground">
              <Settings className="h-4 w-4" />
            </button>

            {/* Avatar */}
            <button className="transition-apple-fast flex items-center gap-2 rounded-xl border border-white/[0.07] px-2 py-1.5 hover:bg-white/[0.04]">
              <div
                className="flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-bold"
                style={{ background: accent.dim, color: accent.color }}
              >
                {initials}
              </div>
              <User className="h-3 w-3 text-text-muted" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="flex-1 p-5 sm:p-6 lg:p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
