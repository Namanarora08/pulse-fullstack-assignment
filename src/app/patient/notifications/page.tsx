"use client";

import {
  Bell,
  CheckCircle2,
  Pill,
  Utensils,
  Droplets,
  HeartPulse,
  MessageSquare,
  Check,
  X,
} from "lucide-react";
import { RoleShell } from "@/components/layout/role-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";
import { PatientRecord } from "@/lib/auth";
import { patientNavItems } from "@/lib/patient-nav";

export default function PatientNotificationsPage() {
  const { user, updatePatientData } = useAuth();
  const patient = (user as PatientRecord) || null;

  const notifications = patient?.notifications || [];

  const markAllAsRead = () => {
    updatePatientData((prev) => ({
      ...prev,
      notifications: (prev.notifications || []).map((n) => ({ ...n, read: true })),
    }));
  };

  const toggleRead = (id: string) => {
    updatePatientData((prev) => ({
      ...prev,
      notifications: (prev.notifications || []).map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    }));
  };

  const deleteNotif = (id: string) => {
    updatePatientData((prev) => ({
      ...prev,
      notifications: (prev.notifications || []).filter((n) => n.id !== id),
    }));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "medication":
        return <Pill className="h-4 w-4 text-purple-600" />;
      case "meal":
        return <Utensils className="h-4 w-4 text-emerald-600" />;
      case "water":
        return <Droplets className="h-4 w-4 text-cyan-600" />;
      case "checkin":
        return <HeartPulse className="h-4 w-4 text-rose-600" />;
      case "doctor":
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <RoleShell
      role="patient"
      title="Notifications"
      description="Medication alerts, reminders, and updates from your doctor."
      navItems={patientNavItems}
    >
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Patient Notification Feed ({notifications.filter((n) => !n.read).length} Unread)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Stay on top of your recovery.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="rounded-xl text-xs"
          >
            <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" /> Mark All as Read
          </Button>
        </div>

        {/* Notifications Feed */}
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`rounded-2xl border p-4 transition-all flex items-start justify-between gap-4 ${
                notif.read
                  ? "border-slate-200/80 bg-white opacity-85 dark:border-slate-800 dark:bg-slate-900"
                  : "border-blue-200 bg-blue-50/40 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-white dark:bg-slate-800 p-2.5 border border-slate-200/60 dark:border-slate-700 shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div className="space-y-0.5 text-xs">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{notif.title}</p>
                    {!notif.read && (
                      <span className="h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{notif.message}</p>
                  <p className="text-[10px] text-slate-400 font-medium pt-0.5">{notif.timestamp}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleRead(notif.id)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  title={notif.read ? "Mark as unread" : "Mark as read"}
                >
                  <Check className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => deleteNotif(notif.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
                  title="Delete notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-sm">
              No notifications at this time.
            </div>
          )}
        </div>
      </div>
    </RoleShell>
  );
}
