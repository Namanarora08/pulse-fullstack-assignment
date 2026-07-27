"use client";

import { useState } from "react";
import {
  Building,
  CheckCircle,
  ChevronRight,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Shield,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";

export function AdminAuthForm() {
  const { login } = useAuth();

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [hospitalCode, setHospitalCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDemoFill = () => {
    setError("");
    setAdminId("admin@stjudehealth.org");
    setPassword("SystemAdmin#2026");
    setHospitalCode("HOSP-90210");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginAdminId = adminId || "admin@stjudehealth.org";
    const loginPassword = password || "SystemAdmin#2026";
    const loginHospitalCode = hospitalCode || "HOSP-90210";
    setAdminId(loginAdminId);
    setPassword(loginPassword);
    setHospitalCode(loginHospitalCode);

    setLoading(true);
    setError("");

    const res = await login("admin", {
      adminId: loginAdminId,
      password: loginPassword,
      hospitalCode: loginHospitalCode,
    });
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Admin authentication failed");
      return;
    }

    window.location.href = "/admin";
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 sm:p-8">
      {/* Header & Governance Branding */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            <Shield className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Hospital Administration</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">System Governance Portal</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDemoFill}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-100/80 px-2.5 py-1 text-xs font-semibold text-slate-800 transition-all hover:bg-slate-200 active:scale-95 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Demo Admin
        </button>
      </div>

      {/* System Status Pill */}
      <div className="mb-5 flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/40">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-slate-200">
          <Building className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          <span>Hospital Operations Infrastructure</span>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
          <CheckCircle className="h-3 w-3" /> All Systems Nominal
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Admin ID Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Admin ID / Email
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={adminId}
              onChange={(e) => {
                setError("");
                setAdminId(e.target.value);
              }}
              placeholder="admin@stjudehealth.org"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-slate-500 focus:bg-white focus:ring-2 focus:ring-slate-500/20 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:focus:border-slate-500 dark:focus:bg-slate-950"
              required
            />
          </div>
        </div>

        {/* Hospital Code Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Hospital Code
          </label>
          <div className="relative flex items-center">
            <KeyRound className="absolute left-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={hospitalCode}
              onChange={(e) => {
                setError("");
                setHospitalCode(e.target.value.toUpperCase());
              }}
              placeholder="HOSP-90210"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm uppercase tracking-widest text-slate-900 outline-none transition-all focus:border-slate-500 focus:bg-white focus:ring-2 focus:ring-slate-500/20 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:focus:border-slate-500 dark:focus:bg-slate-950"
              required
            />
          </div>
        </div>

        {/* Password Input with Visibility Toggle */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Admin Security Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setError("");
                setPassword(e.target.value);
              }}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition-all focus:border-slate-500 focus:bg-white focus:ring-2 focus:ring-slate-500/20 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:focus:border-slate-500 dark:focus:bg-slate-950"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-700 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-800"
            />
            Remember admin workstation
          </label>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 active:scale-98 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying Governance Access...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              Launch Admin Management Console
              <ChevronRight className="h-4 w-4" />
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
