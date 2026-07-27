"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";

import { ThemeToggle } from "@/components/ui/theme-toggle";
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

export function RoleShell({
  role,
  title,
  description,
  navItems,
  children,
}: RoleShellProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Dynamic user details from auth session or role defaults
  const userObj = (user || {}) as Record<string, unknown>;
  const activeName = user?.name || (role === "patient" ? "Rahul Sharma" : role === "doctor" ? "Dr. Sarah Jenkins" : "Admin Operations");
  const activeSub = role === "patient" 
    ? `Patient ID: ${typeof userObj.patientIdCode === "string" ? userObj.patientIdCode : "P-88201"}` 
    : role === "doctor" 
    ? (typeof userObj.title === "string" ? userObj.title : "Chief of Cardiology")
    : `System Director • ${typeof userObj.hospitalCode === "string" ? userObj.hospitalCode : "HOSP-90210"}`;

  const roleConfig = {
    patient: {
      badge: "Patient Portal",
      badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300",
      avatarBg: "bg-blue-600 text-white",
      userName: activeName,
      userSub: activeSub,
      notifications: [
        "Daily recovery check-in due today at 8:00 PM",
        "Dr. Sarah Jenkins uploaded post-discharge report",
        "Medication reminder: Aspirin 75mg at lunch",
      ],
    },
    doctor: {
      badge: "Doctor Workspace",
      badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300",
      avatarBg: "bg-emerald-600 text-white",
      userName: activeName,
      userSub: activeSub,
      notifications: [
        "2 new patient discharge check-ins submitted",
        "High risk alert: Patient P-4020 reported chest tightness",
        "Weekly clinical review summary generated",
      ],
    },
    admin: {
      badge: "Admin Console",
      badgeClass: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
      avatarBg: "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900",
      userName: activeName,
      userSub: activeSub,
      notifications: [
        "System maintenance scheduled for midnight",
        "3 new doctor profiles pending credential validation",
        "EHR synchronization nominal (99.98% uptime)",
      ],
    },
  }[role];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/80 bg-white/90 backdrop-blur-2xl transition-transform duration-300 dark:border-slate-800/80 dark:bg-slate-900/90 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
              <Activity className="h-5 w-5" />
            </span>
            <span className="text-lg text-slate-900 dark:text-white">Pulse</span>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", roleConfig.badgeClass)}>
              {role}
            </span>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar Placeholder */}
        <div className="p-4">
          <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-500 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
            <Search className="h-4 w-4 text-slate-400" />
            <span className="flex-1 truncate">Search workspace...</span>
            <kbd className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-mono text-slate-600 dark:bg-slate-800 dark:text-slate-400">⌘K</kbd>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1.5 px-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== `/${role}` && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-11 items-center justify-between rounded-xl px-3.5 text-xs font-semibold transition-all",
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold",
                      active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Profile */}
        <div className="border-t border-slate-100 p-4 dark:border-slate-800">
          <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50/80 p-3 dark:border-slate-800/60 dark:bg-slate-950/40">
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl font-bold text-xs shadow-sm shrink-0", roleConfig.avatarBg)}>
                {roleConfig.userName.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">{roleConfig.userName}</p>
                <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">{roleConfig.userSub}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Layout Area */}
      <div className="flex flex-col lg:pl-72">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Pulse</span>
                <span>/</span>
                <span className="font-semibold text-slate-900 dark:text-white capitalize">{role} Workspace</span>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setProfileOpen(false);
                }}
                className="relative rounded-xl border border-slate-200/80 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600" />
              </button>

              {/* Notification Popover */}
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        Notifications
                      </h4>
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                        3 New
                      </span>
                    </div>

                    <div className="mt-3 space-y-2.5">
                      {roleConfig.notifications.map((msg, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
                        >
                          <span className="mt-0.5 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                          <p className="leading-snug">{msg}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Settings Icon */}
            <button
              className="rounded-xl border border-slate-200/80 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>

            {/* Profile Avatar & Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl border border-slate-200/80 p-1.5 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800 transition-colors"
              >
                <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold", roleConfig.avatarBg)}>
                  {roleConfig.userName.split(" ").map((n) => n[0]).join("")}
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{roleConfig.userName}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{roleConfig.userSub}</p>
                    </div>

                    <div className="mt-1 space-y-0.5">
                      <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        Account Details
                      </button>
                      <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                        <Settings className="h-3.5 w-3.5 text-slate-400" />
                        Preferences
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Content View Slot */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
          {/* Header Title Section */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              {description}
            </p>
          </div>

          {/* Children View Slot */}
          {children}
        </main>
      </div>
    </div>
  );
}
