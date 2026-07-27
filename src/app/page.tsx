"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { AnimatedBackground, MedicalHeroIllustration } from "@/components/auth/animated-background";
import { RoleSelectionCards, RoleType } from "@/components/auth/role-selection-cards";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleType | undefined>(undefined);

  const handleSelectRole = (role: RoleType) => {
    setSelectedRole(role);
    router.push(`/login?role=${role}`);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-50 font-sans text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      {/* Background visual layers */}
      <AnimatedBackground />

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-slate-900 dark:text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/25">
              <Activity className="h-5 w-5" />
            </span>
            <span className="text-xl">Pulse <span className="text-xs font-normal text-blue-600 dark:text-blue-400">Health</span></span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Clinical Discharge Gateway
            </div>

            <ThemeToggle />

            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-xl border-slate-200/80 bg-white/80 px-4 text-xs font-semibold shadow-sm hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <Link href="/login">
                Sign In
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8 lg:col-span-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur-md dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Post-Discharge Intelligence Platform
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                Your Recovery,{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  Connected.
                </span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
                Patients stay seamlessly connected with their clinical care team after hospital discharge through intelligent daily health tracking, interactive check-ins, and automated recovery insights.
              </p>
            </div>

            {/* Medical Illustration */}
            <div className="pt-2">
              <MedicalHeroIllustration />
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                256-Bit Encrypted
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                UIDAI Aadhaar Verified
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Hospital EHR Synced
              </div>
            </div>
          </motion.div>

          {/* Right Role Cards Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="space-y-6 lg:col-span-6"
          >
            <div className="rounded-3xl border border-white/80 bg-white/40 p-6 shadow-2xl backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-900/40 sm:p-8">
              <div className="mb-6 space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Who are you?
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Select your role to access your dedicated portal.
                </p>
              </div>

              {/* 3 Role Entry Cards */}
              <RoleSelectionCards
                selectedRole={selectedRole}
                onSelectRole={handleSelectRole}
              />

              <div className="mt-8 rounded-2xl border border-slate-200/60 bg-slate-100/60 p-4 text-center dark:border-slate-800/60 dark:bg-slate-950/40">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Need help accessing your patient account? Contact hospital support at <span className="font-semibold text-blue-600 dark:text-blue-400">1800-PULSE-CARE</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
