"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Deep smoke orbs — neutral, not blue */}
      <motion.div
        animate={{
          x: [0, 24, -16, 0],
          y: [0, -32, 18, 0],
          scale: [1, 1.08, 0.96, 1]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full bg-white/[0.025] blur-[80px]"
      />
      <motion.div
        animate={{
          x: [0, -28, 18, 0],
          y: [0, 28, -22, 0],
          scale: [1, 0.92, 1.06, 1]
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-24 top-1/3 h-[400px] w-[400px] rounded-full bg-white/[0.02] blur-[80px]"
      />
      <motion.div
        animate={{
          x: [0, 18, -22, 0],
          y: [0, 26, -14, 0],
          scale: [1, 1.04, 0.94, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-white/[0.018] blur-[80px]"
      />

      {/* Very subtle green glow — recovery accent only */}
      <motion.div
        animate={{ opacity: [0.04, 0.07, 0.04] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-1/4 top-1/4 h-64 w-64 rounded-full bg-recovery blur-[100px]"
      />

      {/* Dot-grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)"
        }}
      />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}

export function MedicalHeroIllustration() {
  return (
    <div
      className="relative mx-auto flex h-64 w-full max-w-md items-center justify-center overflow-hidden rounded-3xl"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow:
          "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)"
      }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-recovery/5 via-transparent to-medication/5" />

      <div className="relative z-10 w-full space-y-5 px-6">
        {/* Header row */}
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-recovery/60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-recovery" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Live Patient Sync
            </span>
          </div>
          <span className="rounded-full border border-recovery/20 bg-recovery/10 px-2.5 py-0.5 text-xs font-semibold text-recovery">
            98.4% Adherence
          </span>
        </div>

        {/* ECG */}
        <div
          className="relative h-16 w-full overflow-hidden rounded-2xl bg-black/30 px-4 py-2"
          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <svg
            className="h-full w-full text-recovery"
            viewBox="0 0 300 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M0 20 L45 20 L55 8 L65 32 L75 12 L85 24 L95 20 L155 20 L165 4 L175 36 L185 12 L195 24 L205 20 L300 20"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
            />
          </svg>
          <div className="absolute right-3 top-2 font-mono text-[10px] text-recovery/70">
            HR 72 · SpO₂ 99%
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Recovery", value: "92/100", color: "text-recovery" },
            { label: "Streak", value: "14 Days", color: "text-warning" },
            { label: "Sync", value: "Live", color: "text-medication" }
          ].map((s) => (
            <motion.div
              key={s.label}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="rounded-xl px-3 py-2 text-center"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)"
              }}
            >
              <p className="text-[10px] text-text-muted">{s.label}</p>
              <p className={`text-xs font-bold ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
