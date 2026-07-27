"use client";

import { useState } from "react";
import {
  ChevronRight,
  Eye,
  EyeOff,
  Hospital,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";

export function DoctorAuthForm() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDemoFill = () => {
    setError("");
    setEmail("dr.smith@stjudehealth.org");
    setPassword("Cardiology#2026");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Enter your hospital email and password.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await login("doctor", { email, password });
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Doctor authentication failed");
      return;
    }

    window.location.href = "/doctor";
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 sm:p-8">
      {/* Header & Hospital Branding */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
            <Stethoscope className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Doctor Workspace
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              St. Jude Heart & Vascular Institute
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDemoFill}
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/80 px-2.5 py-1 text-xs font-semibold text-emerald-700 transition-all hover:bg-emerald-100 active:scale-95 dark:border-emerald-900/50 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/80"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Demo Doctor
        </button>
      </div>

      {/* Hospital Gateway Badge */}
      <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 dark:border-emerald-900/30 dark:bg-emerald-950/30">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 dark:text-emerald-300">
          <Hospital className="h-4 w-4 text-emerald-600" />
          <span>Cardiology & Post-Surgical Ward</span>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200">
          <ShieldCheck className="h-3 w-3" /> NABH Compliant
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Hospital Email Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Hospital Email
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 h-4 w-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setError("");
                setEmail(e.target.value);
              }}
              placeholder="dr.smith@stjudehealth.org"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:focus:border-emerald-500 dark:focus:bg-slate-950"
              required
            />
          </div>
        </div>

        {/* Password Input with Visibility Toggle */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Clinical Password
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
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:focus:border-emerald-500 dark:focus:bg-slate-950"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center justify-between text-xs">
          <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800"
            />
            Keep clinical session active
          </label>
          <button
            type="button"
            className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Forgot Password?
          </button>
        </div>

        {/* Patient Review Teaser Widget */}
        <div className="mt-4 rounded-xl border border-slate-200/60 bg-slate-50/60 p-3 dark:border-slate-800/80 dark:bg-slate-950/40">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <Users className="h-3.5 w-3.5 text-emerald-600" />
              Active Panel Preview
            </span>
            <span className="rounded bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              4 Patients
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
            2 discharge reviews pending • 1 high risk alert
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="active:scale-98 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Authenticating Doctor Credentials...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              Access Clinical Workspace
              <ChevronRight className="h-4 w-4" />
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
