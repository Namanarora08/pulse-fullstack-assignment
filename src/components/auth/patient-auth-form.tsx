"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  HeartPulse,
  HelpCircle,
  Loader2,
  Pill,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";
import { useRouter } from "next/navigation";

const inputClass = [
  "w-full rounded-xl px-4 py-2.5 text-sm",
  "bg-white/[0.04] border border-white/[0.08]",
  "text-foreground placeholder:text-text-muted",
  "outline-none transition-apple-fast",
  "focus:bg-white/[0.06] focus:border-white/[0.18] focus:ring-1 focus:ring-white/[0.12]"
].join(" ");

export function PatientAuthForm() {
  const { login } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [aadhaar, setAadhaar] = useState("");
  const [dob, setDob] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [otp, setOtp] = useState(["7", "4", "9", "2", "0", "1"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotModal, setForgotModal] = useState(false);
  const [syncIndex, setSyncIndex] = useState(0);

  const syncSteps = [
    {
      title: "Verifying Aadhaar Identity",
      desc: "UIDAI token validated",
      icon: ShieldCheck
    },
    {
      title: "Fetching Medical History",
      desc: "Discharge summary & diagnoses",
      icon: FileText
    },
    {
      title: "Syncing Care Team",
      desc: "Assigned Doctor: Dr. Sarah Jenkins",
      icon: UserCheck
    },
    {
      title: "Loading Prescriptions",
      desc: "Active medications & meal plans",
      icon: Pill
    },
    {
      title: "Hydrating Recovery Status",
      desc: "14-day streak & daily score",
      icon: HeartPulse
    }
  ];

  const formatAadhaar = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 12);
    const parts: string[] = [];
    for (let i = 0; i < digits.length; i += 4)
      parts.push(digits.substring(i, i + 4));
    return parts.join(" ");
  };

  const runSync = () => {
    setStep(3);
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setSyncIndex(current);
      if (current >= syncSteps.length) {
        clearInterval(interval);
        setTimeout(() => {
          window.location.href = "/patient";
        }, 300);
      }
    }, 380);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const a = aadhaar || "9876 5432 1098";
    const d = dob || "1988-05-14";
    if (!aadhaar) setAadhaar("9876 5432 1098");
    if (!dob) setDob("1988-05-14");
    const res = await login("patient", { aadhaar: a, dob: d });
    setLoading(false);
    if (!res.success) {
      setError(res.error || "Verification failed.");
      return;
    }
    runSync();
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await login("patient", {
      aadhaar: aadhaar || "9876 5432 1098",
      dob: dob || "1988-05-14"
    });
    setLoading(false);
    if (!res.success) {
      setError(res.error || "Verification failed.");
      return;
    }
    runSync();
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl p-6 sm:p-8"
      style={{
        background: "#111113",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow:
          "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)"
      }}
    >
      {/* Header */}
      <div className="mb-7 flex items-center justify-between border-b border-white/[0.06] pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-recovery/20 bg-recovery/10">
            <HeartPulse className="h-4 w-4 text-recovery" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Patient Authentication
            </h2>
            <p className="text-xs text-text-muted">
              Identity verified via Aadhaar
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setAadhaar("9876 5432 1098");
            setDob("1988-05-14");
            setError("");
          }}
          className="transition-apple-fast inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-white/[0.07] hover:text-foreground"
        >
          <Sparkles className="h-3 w-3" /> Demo
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ── Step 1: Credentials ── */}
        {step === 1 && (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.22 }}
            onSubmit={handleLoginSubmit}
            className="space-y-5"
          >
            {error && (
              <div className="bg-danger/8 rounded-xl border border-danger/20 px-4 py-3 text-xs font-medium text-danger">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">
                Aadhaar Number
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={aadhaar}
                  onChange={(e) => {
                    setError("");
                    setAadhaar(formatAadhaar(e.target.value));
                  }}
                  placeholder="9876 5432 1098"
                  className={`${inputClass} pl-10 font-mono tracking-widest`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => {
                    setError("");
                    setDob(e.target.value);
                  }}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            {/* Quick access panel */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Quick Demo Access
                  </p>
                  <p className="mt-0.5 text-[11px] text-text-muted">
                    Bypass OTP — enter portal instantly
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="recovery"
                  onClick={handleLoginSubmit}
                  disabled={loading}
                  className="text-xs"
                >
                  {loading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "1-Click Login"
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex cursor-pointer items-center gap-2 text-text-secondary">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-white/20 bg-white/[0.05] accent-recovery"
                />
                Remember this device
              </label>
              <button
                type="button"
                onClick={() => setForgotModal(true)}
                className="transition-apple-fast text-text-muted hover:text-foreground"
              >
                Forgot Aadhaar?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Authenticating…
                </>
              ) : (
                <>
                  Login to Patient Portal <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </motion.form>
        )}

        {/* ── Step 2: OTP ── */}
        {step === 2 && (
          <motion.form
            key="step2"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
            onSubmit={handleOtpSubmit}
            className="space-y-6"
          >
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <p className="text-xs font-medium text-foreground">
                OTP sent to mobile ••••8492
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-text-muted">
                {aadhaar}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-text-secondary">
                6-Digit OTP
              </label>
              <div className="flex gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const next = [...otp];
                      next[idx] = e.target.value.slice(-1);
                      setOtp(next);
                    }}
                    className="transition-apple-fast h-12 w-full rounded-xl border border-white/[0.09] bg-white/[0.04] text-center font-mono text-lg font-bold text-foreground outline-none focus:border-white/[0.20] focus:bg-white/[0.07]"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="transition-apple-fast text-text-muted hover:text-foreground"
              >
                ← Back
              </button>
              <button
                type="button"
                className="transition-apple-fast flex items-center gap-1 text-text-secondary hover:text-foreground"
              >
                <RefreshCw className="h-3 w-3" /> Resend in 24s
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Authenticate & Enter
                </>
              )}
            </Button>
          </motion.form>
        )}

        {/* ── Step 3: Data sync ── */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-recovery/20 bg-recovery/10">
                <Loader2 className="h-5 w-5 animate-spin text-recovery" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                Preparing your portal
              </h3>
              <p className="mt-1 text-xs text-text-muted">
                Fetching medical records & care plan…
              </p>
            </div>

            <div className="space-y-2">
              {syncSteps.map((s, idx) => {
                const Icon = s.icon;
                const isDone = idx < syncIndex;
                const isCurrent = idx === syncIndex;

                return (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: isCurrent || isDone ? 1 : 0.3, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="transition-apple-fast flex items-center gap-3 rounded-xl p-3"
                    style={{
                      background: isDone
                        ? "rgba(52,211,153,0.06)"
                        : isCurrent
                          ? "rgba(255,255,255,0.04)"
                          : "transparent",
                      border: `1px solid ${isDone ? "rgba(52,211,153,0.15)" : isCurrent ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"}`
                    }}
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        background: isDone
                          ? "rgba(52,211,153,0.15)"
                          : isCurrent
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(255,255,255,0.03)",
                        color: isDone
                          ? "#34D399"
                          : isCurrent
                            ? "#FAFAFA"
                            : "#71717A"
                      }}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">
                        {s.title}
                      </p>
                      <p className="text-[11px] text-text-muted">{s.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forgot modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-sm space-y-4 rounded-2xl p-6"
            style={{
              background: "#18181B",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.8)"
            }}
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-text-muted" />
              <h3 className="text-sm font-semibold text-foreground">
                Forgot Aadhaar?
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-text-secondary">
              Use your registered mobile or hospital registration card. Demo
              credentials:
            </p>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3 font-mono text-xs text-text-secondary">
              Aadhaar: 9876 5432 1098
              <br />
              DOB: 1988-05-14
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setForgotModal(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setAadhaar("9876 5432 1098");
                  setDob("1988-05-14");
                  setForgotModal(false);
                }}
              >
                Auto-fill
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
