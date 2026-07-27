"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-slate-50/50 dark:bg-slate-950/80 transition-colors duration-500">
      {/* Animated soft gradient blobs */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/15"
      />
      <motion.div
        animate={{
          x: [0, -40, 20, 0],
          y: [0, 30, -30, 0],
          scale: [1, 0.9, 1.08, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -right-20 top-1/4 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-600/15"
      />
      <motion.div
        animate={{
          x: [0, 25, -25, 0],
          y: [0, 35, -20, 0],
          scale: [1, 1.05, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-10 left-1/3 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl dark:bg-indigo-600/10"
      />

      {/* Grid line overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
      />
    </div>
  );
}

export function MedicalHeroIllustration() {
  return (
    <div className="relative mx-auto flex h-72 w-full max-w-lg items-center justify-center rounded-3xl border border-white/60 bg-white/40 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/40">
      {/* Background glow ring */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-500/10 via-emerald-500/10 to-sky-500/10 dark:from-blue-500/5 dark:to-emerald-500/5" />

      {/* Animated Heartbeat ECG Wave */}
      <div className="relative z-10 w-full space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Live Patient Sync
            </span>
          </div>
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            98.4% Adherence
          </span>
        </div>

        {/* ECG Line Graphics */}
        <div className="relative h-20 w-full overflow-hidden rounded-xl bg-slate-900/90 p-3 shadow-inner">
          <svg
            className="h-full w-full text-emerald-400"
            viewBox="0 0 300 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M0 25 L50 25 L60 10 L70 40 L80 15 L90 30 L100 25 L160 25 L170 5 L180 45 L190 15 L200 30 L210 25 L300 25"
              initial={{ pathLength: 0, opacity: 0.2 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </svg>
          <div className="absolute right-3 top-2 text-[10px] font-mono text-emerald-400/80">
            HR: 72 BPM • SpO2: 99%
          </div>
        </div>

        {/* Floating Health Stat Badges */}
        <div className="grid grid-cols-3 gap-2">
          <motion.div
            whileHover={{ y: -2 }}
            className="rounded-xl border border-slate-100 bg-white/80 p-2.5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-800/80"
          >
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Recovery</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">92 / 100</p>
          </motion.div>
          <motion.div
            whileHover={{ y: -2 }}
            className="rounded-xl border border-slate-100 bg-white/80 p-2.5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-800/80"
          >
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Streak</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">14 Days 🔥</p>
          </motion.div>
          <motion.div
            whileHover={{ y: -2 }}
            className="rounded-xl border border-slate-100 bg-white/80 p-2.5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-800/80"
          >
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Doctor Sync</p>
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Connected</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
