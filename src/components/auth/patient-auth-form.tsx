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
  Lock,
  Pill,
  RefreshCw,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AuthCheckbox,
  AuthErrorBanner,
  AuthField,
  AuthFormHeader,
  AuthFormShell,
  AuthSubmitButton
} from "@/components/auth/auth-form-primitives";
import { useAuth } from "@/components/auth/auth-context";

const DEMO_AADHAAR = "9876 5432 1098";
const DEMO_DOB = "1988-05-14";

export function PatientAuthForm() {
  const { login } = useAuth();

  // Step: 1 = Credentials, 2 = OTP verification, 3 = Simulated data hydration
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [aadhaar, setAadhaar] = useState("");
  const [dob, setDob] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [otp, setOtp] = useState(["7", "4", "9", "2", "0", "1"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotModal, setForgotModal] = useState(false);

  // Simulated sync steps for Step 3
  const [syncIndex, setSyncIndex] = useState(0);

  const syncSteps = [
    {
      title: "Verifying Aadhaar Identity",
      desc: "UIDAI Auth Token validated",
      icon: ShieldCheck
    },
    {
      title: "Fetching Medical History",
      desc: "Discharge Summary & Diseases",
      icon: FileText
    },
    {
      title: "Syncing Care Team",
      desc: "Assigned Doctor: Dr. Sarah Jenkins",
      icon: UserCheck
    },
    {
      title: "Loading Prescriptions & Diet",
      desc: "Active Medications & Meals",
      icon: Pill
    },
    {
      title: "Hydrating Recovery Status",
      desc: "14-Day Streak & Daily Score",
      icon: HeartPulse
    }
  ];

  const formatAadhaar = (val: string) => {
    // Remove non-digit chars
    const digits = val.replace(/\D/g, "").slice(0, 12);
    // Format as 4-4-4
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.substring(i, i + 4));
    }
    return parts.join(" ");
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setAadhaar(formatAadhaar(e.target.value));
  };

  const handleDemoFill = () => {
    setError("");
    setAadhaar(DEMO_AADHAAR);
    setDob(DEMO_DOB);
  };

  const runSyncAnimation = (stepDurationMs: number) => {
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
    }, stepDurationMs);
  };

  const authenticate = async (
    credentials: { aadhaar: string; dob: string },
    stepDurationMs: number
  ) => {
    setLoading(true);
    setError("");

    const res = await login("patient", credentials);
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Aadhaar verification failed.");
      return;
    }

    setStep(3);
    runSyncAnimation(stepDurationMs);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let currentAadhaar = aadhaar;
    let currentDob = dob;

    if (!currentAadhaar || currentAadhaar.replace(/\s/g, "").length !== 12) {
      currentAadhaar = DEMO_AADHAAR;
      setAadhaar(currentAadhaar);
    }
    if (!currentDob) {
      currentDob = DEMO_DOB;
      setDob(currentDob);
    }

    await authenticate({ aadhaar: currentAadhaar, dob: currentDob }, 350);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authenticate(
      { aadhaar: aadhaar || DEMO_AADHAAR, dob: dob || DEMO_DOB },
      400
    );
  };

  return (
    <AuthFormShell>
      <AuthFormHeader
        accent="blue"
        icon={HeartPulse}
        title="Patient Authentication"
        subtitle="Identity verification via Aadhaar"
        demoLabel="Quick Demo Fill"
        onDemoFill={handleDemoFill}
      />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onSubmit={handleLoginSubmit}
            className="space-y-5"
          >
            <AuthErrorBanner message={error} />

            <AuthField
              accent="blue"
              icon={CreditCard}
              label="Aadhaar Number"
              type="text"
              value={aadhaar}
              onChange={handleAadhaarChange}
              placeholder={DEMO_AADHAAR}
              inputClassName="tracking-widest"
              hint="12-digit UIDAI number. Demo token for sandbox authentication."
            />

            <AuthField
              accent="blue"
              icon={Calendar}
              label="Date of Birth"
              type="date"
              value={dob}
              onChange={(e) => {
                setError("");
                setDob(e.target.value);
              }}
            />

            {/* Instant Login Banner Callout */}
            <div className="rounded-xl border border-blue-200/80 bg-blue-50/70 p-3.5 dark:border-blue-900/50 dark:bg-blue-950/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-blue-900 dark:text-blue-200">
                    Quick Testing Access
                  </p>
                  <p className="text-[11px] text-blue-700/80 dark:text-blue-300/80">
                    Bypass OTP & enter Patient Portal instantly
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleLoginSubmit}
                  disabled={loading}
                  className="rounded-lg bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
                >
                  {loading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "1-Click Login"
                  )}
                </Button>
              </div>
            </div>

            {/* Remember & Forgot options */}
            <div className="flex items-center justify-between text-xs">
              <AuthCheckbox
                accent="blue"
                checked={rememberMe}
                onChange={setRememberMe}
                label="Remember this device"
              />
              <button
                type="button"
                onClick={() => setForgotModal(true)}
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Forgot Aadhaar?
              </button>
            </div>

            <AuthSubmitButton
              accent="blue"
              loading={loading}
              loadingLabel="Authenticating Patient..."
              label="Login to Patient Portal"
              icon={ChevronRight}
            />
          </motion.form>
        )}

        {step === 2 && (
          <motion.form
            key="step2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onSubmit={handleOtpSubmit}
            className="space-y-6"
          >
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/40 dark:bg-blue-950/30">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 dark:text-blue-300">
                <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                OTP sent to linked mobile ending in •••• 8492
              </div>
              <p className="mt-1 text-xs text-blue-600/80 dark:text-blue-300/80">
                Aadhaar Token: <span className="font-mono">{aadhaar}</span>
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Enter 6-Digit OTP
              </label>
              <div className="flex justify-between gap-2">
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
                    className="h-12 w-11 rounded-xl border border-slate-200 bg-slate-50 text-center font-mono text-lg font-bold text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                ))}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Demo passcode auto-filled. Click Verify to complete login.
              </p>
            </div>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                ← Back to Aadhaar
              </button>
              <button
                type="button"
                className="flex items-center gap-1 font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                <RefreshCw className="h-3 w-3" />
                Resend OTP in 24s
              </button>
            </div>

            <AuthSubmitButton
              accent="blue"
              loading={loading}
              loadingLabel="Verifying OTP..."
              label="Authenticate & Launch Portal"
              icon={CheckCircle2}
            />
          </motion.form>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 py-2"
          >
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Preparing Patient Care Portal
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Fetching medical records & active care plan...
              </p>
            </div>

            <div className="space-y-3">
              {syncSteps.map((s, idx) => {
                const Icon = s.icon;
                const isDone = idx < syncIndex;
                const isCurrent = idx === syncIndex;

                return (
                  <div
                    key={s.title}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                      isDone
                        ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/40 dark:bg-emerald-950/20"
                        : isCurrent
                          ? "border-blue-300 bg-blue-50/80 shadow-sm dark:border-blue-800 dark:bg-blue-950/40"
                          : "border-slate-100 bg-slate-50/40 opacity-40 dark:border-slate-800/50 dark:bg-slate-900/20"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                        isDone
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                            ? "bg-blue-600 text-white"
                            : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        {s.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forgot Aadhaar Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-semibold">
                Forgot Aadhaar Number?
              </h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              In production, patients can retrieve their linked ID via
              registered mobile SMS or hospital registration card. For this
              demo, use:
            </p>
            <div className="mt-3 rounded-lg bg-slate-100 p-3 font-mono text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-200">
              Demo Aadhaar: {DEMO_AADHAAR}
              <br />
              DOB: {DEMO_DOB}
            </div>
            <div className="mt-5 flex justify-end">
              <Button
                size="sm"
                onClick={() => {
                  handleDemoFill();
                  setForgotModal(false);
                }}
                className="rounded-lg bg-blue-600 text-white"
              >
                Auto-fill Demo Aadhaar
              </Button>
            </div>
          </div>
        </div>
      )}
    </AuthFormShell>
  );
}
