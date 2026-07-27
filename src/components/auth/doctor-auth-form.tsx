"use client";

import { useState } from "react";
import {
  ChevronRight,
  Hospital,
  Lock,
  Mail,
  ShieldCheck,
  Stethoscope,
  Users
} from "lucide-react";
import {
  AuthCheckbox,
  AuthErrorBanner,
  AuthField,
  AuthFormHeader,
  AuthFormShell,
  AuthPasswordField,
  AuthSubmitButton
} from "@/components/auth/auth-form-primitives";
import { useAuth } from "@/components/auth/auth-context";

const DEMO_EMAIL = "dr.smith@stjudehealth.org";
const DEMO_PASSWORD = "Cardiology#2026";

export function DoctorAuthForm() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDemoFill = () => {
    setError("");
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginEmail = email || DEMO_EMAIL;
    const loginPassword = password || DEMO_PASSWORD;
    setEmail(loginEmail);
    setPassword(loginPassword);

    setLoading(true);
    setError("");

    const res = await login("doctor", {
      email: loginEmail,
      password: loginPassword
    });
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Doctor authentication failed");
      return;
    }

    window.location.href = "/doctor";
  };

  return (
    <AuthFormShell>
      <AuthFormHeader
        accent="emerald"
        icon={Stethoscope}
        title="Doctor Workspace"
        subtitle="St. Jude Heart & Vascular Institute"
        demoLabel="Demo Doctor"
        onDemoFill={handleDemoFill}
      />

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
        <AuthErrorBanner message={error} />

        <AuthField
          accent="emerald"
          icon={Mail}
          label="Hospital Email"
          type="email"
          value={email}
          onChange={(e) => {
            setError("");
            setEmail(e.target.value);
          }}
          placeholder={DEMO_EMAIL}
          required
        />

        <AuthPasswordField
          accent="emerald"
          icon={Lock}
          label="Clinical Password"
          value={password}
          onChange={(e) => {
            setError("");
            setPassword(e.target.value);
          }}
          placeholder="••••••••••••"
          required
        />

        {/* Options */}
        <div className="flex items-center justify-between text-xs">
          <AuthCheckbox
            accent="emerald"
            checked={rememberMe}
            onChange={setRememberMe}
            label="Keep clinical session active"
          />
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

        <AuthSubmitButton
          accent="emerald"
          loading={loading}
          loadingLabel="Authenticating Doctor Credentials..."
          label="Access Clinical Workspace"
          icon={ChevronRight}
        />
      </form>
    </AuthFormShell>
  );
}
