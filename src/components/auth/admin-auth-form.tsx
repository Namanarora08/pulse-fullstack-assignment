"use client";

import { useState } from "react";
import {
  Building,
  CheckCircle,
  ChevronRight,
  KeyRound,
  Lock,
  Mail,
  Shield
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

const DEMO_ADMIN_ID = "admin@stjudehealth.org";
const DEMO_PASSWORD = "SystemAdmin#2026";
const DEMO_HOSPITAL_CODE = "HOSP-90210";

export function AdminAuthForm() {
  const { login } = useAuth();

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [hospitalCode, setHospitalCode] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDemoFill = () => {
    setError("");
    setAdminId(DEMO_ADMIN_ID);
    setPassword(DEMO_PASSWORD);
    setHospitalCode(DEMO_HOSPITAL_CODE);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginAdminId = adminId || DEMO_ADMIN_ID;
    const loginPassword = password || DEMO_PASSWORD;
    const loginHospitalCode = hospitalCode || DEMO_HOSPITAL_CODE;
    setAdminId(loginAdminId);
    setPassword(loginPassword);
    setHospitalCode(loginHospitalCode);

    setLoading(true);
    setError("");

    const res = await login("admin", {
      adminId: loginAdminId,
      password: loginPassword,
      hospitalCode: loginHospitalCode
    });
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Admin authentication failed");
      return;
    }

    window.location.href = "/admin";
  };

  return (
    <AuthFormShell>
      <AuthFormHeader
        accent="slate"
        icon={Shield}
        title="Hospital Administration"
        subtitle="System Governance Portal"
        demoLabel="Demo Admin"
        onDemoFill={handleDemoFill}
      />

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
        <AuthErrorBanner message={error} />

        <AuthField
          accent="slate"
          icon={Mail}
          label="Admin ID / Email"
          type="text"
          value={adminId}
          onChange={(e) => {
            setError("");
            setAdminId(e.target.value);
          }}
          placeholder={DEMO_ADMIN_ID}
          required
        />

        <AuthField
          accent="slate"
          icon={KeyRound}
          label="Hospital Code"
          type="text"
          value={hospitalCode}
          onChange={(e) => {
            setError("");
            setHospitalCode(e.target.value.toUpperCase());
          }}
          placeholder={DEMO_HOSPITAL_CODE}
          inputClassName="uppercase tracking-widest"
          required
        />

        <AuthPasswordField
          accent="slate"
          icon={Lock}
          label="Admin Security Password"
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
            accent="slate"
            checked={rememberMe}
            onChange={setRememberMe}
            label="Remember admin workstation"
          />
        </div>

        <AuthSubmitButton
          accent="slate"
          loading={loading}
          loadingLabel="Verifying Governance Access..."
          label="Launch Admin Management Console"
          icon={ChevronRight}
        />
      </form>
    </AuthFormShell>
  );
}
