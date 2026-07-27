"use client";

import { motion } from "framer-motion";

interface RecoveryRingsProps {
  score: number; // 0 - 100
  medsAdherence: number; // 0 - 100
  waterPercent: number; // 0 - 100
  size?: number;
}

export function RecoveryRings({
  score,
  medsAdherence,
  waterPercent,
  size = 180,
}: RecoveryRingsProps) {
  // Center point
  const center = size / 2;
  const strokeWidth = 12;

  // Radii
  const r1 = center - strokeWidth; // Outer ring (Recovery Score - Accent Blue #2563EB)
  const r2 = r1 - strokeWidth - 4; // Middle ring (Meds Adherence - Emerald #10B981)
  const r3 = r2 - strokeWidth - 4; // Inner ring (Hydration - Cyan #06B6D4)

  // Circumferences
  const c1 = 2 * Math.PI * r1;
  const c2 = 2 * Math.PI * r2;
  const c3 = 2 * Math.PI * r3;

  // Offsets
  const offset1 = c1 - (Math.min(100, Math.max(0, score)) / 100) * c1;
  const offset2 = c2 - (Math.min(100, Math.max(0, medsAdherence)) / 100) * c2;
  const offset3 = c3 - (Math.min(100, Math.max(0, waterPercent)) / 100) * c3;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 transform overflow-visible">
        {/* Outer Ring Background */}
        <circle
          cx={center}
          cy={center}
          r={r1}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-slate-800"
          fill="transparent"
        />
        {/* Outer Ring Progress */}
        <motion.circle
          cx={center}
          cy={center}
          r={r1}
          stroke="#2563EB"
          strokeWidth={strokeWidth}
          strokeDasharray={c1}
          initial={{ strokeDashoffset: c1 }}
          animate={{ strokeDashoffset: offset1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
          fill="transparent"
        />

        {/* Middle Ring Background */}
        <circle
          cx={center}
          cy={center}
          r={r2}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-slate-800"
          fill="transparent"
        />
        {/* Middle Ring Progress */}
        <motion.circle
          cx={center}
          cy={center}
          r={r2}
          stroke="#10B981"
          strokeWidth={strokeWidth}
          strokeDasharray={c2}
          initial={{ strokeDashoffset: c2 }}
          animate={{ strokeDashoffset: offset2 }}
          transition={{ duration: 1, delay: 0.15, ease: "easeOut" }}
          strokeLinecap="round"
          fill="transparent"
        />

        {/* Inner Ring Background */}
        <circle
          cx={center}
          cy={center}
          r={r3}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-slate-800"
          fill="transparent"
        />
        {/* Inner Ring Progress */}
        <motion.circle
          cx={center}
          cy={center}
          r={r3}
          stroke="#06B6D4"
          strokeWidth={strokeWidth}
          strokeDasharray={c3}
          initial={{ strokeDashoffset: c3 }}
          animate={{ strokeDashoffset: offset3 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>

      {/* Center Score Readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {score}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Score
        </span>
      </div>
    </div>
  );
}
