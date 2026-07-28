"use client";

import { motion } from "framer-motion";

interface RecoveryRingsProps {
  score: number; // 0–100
  medsAdherence: number; // 0–100
  waterPercent: number; // 0–100
  size?: number;
}

export function RecoveryRings({
  score,
  medsAdherence,
  waterPercent,
  size = 200
}: RecoveryRingsProps) {
  const center = size / 2;
  const sw = 12; // stroke width
  const gap = 8;

  const r1 = center - sw / 2 - 2;
  const r2 = r1 - sw - gap;
  const r3 = r2 - sw - gap;

  const circ = (r: number) => 2 * Math.PI * r;
  const offset = (r: number, pct: number) =>
    circ(r) - (Math.min(100, Math.max(0, pct)) / 100) * circ(r);

  const rings = [
    {
      r: r1,
      pct: score,
      color: "#34D399",
      glow: "rgba(52,211,153,0.4)",
      delay: 0.1
    },
    {
      r: r2,
      pct: medsAdherence,
      color: "#818CF8",
      glow: "rgba(129,140,248,0.4)",
      delay: 0.3
    },
    {
      r: r3,
      pct: waterPercent,
      color: "#22D3EE",
      glow: "rgba(34,211,238,0.4)",
      delay: 0.5
    }
  ];

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90 overflow-visible">
        <defs>
          {rings.map((ring, i) => (
            <filter
              key={i}
              id={`glow-ring-${i}`}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        {rings.map((ring, i) => (
          <g key={i}>
            {/* Track */}
            <circle
              cx={center}
              cy={center}
              r={ring.r}
              fill="none"
              stroke={ring.color}
              strokeWidth={sw}
              opacity={0.08}
            />
            {/* Progress */}
            <motion.circle
              cx={center}
              cy={center}
              r={ring.r}
              fill="none"
              stroke={ring.color}
              strokeWidth={sw}
              strokeDasharray={circ(ring.r)}
              initial={{ strokeDashoffset: circ(ring.r) }}
              animate={{ strokeDashoffset: offset(ring.r, ring.pct) }}
              transition={{
                duration: 1.4,
                delay: ring.delay,
                ease: [0.34, 1.56, 0.64, 1]
              }}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 6px ${ring.glow})` }}
            />
          </g>
        ))}
      </svg>

      {/* Center readout */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, type: "spring", stiffness: 260, damping: 22 }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
      >
        <span className="metric-number text-4xl font-bold leading-none tracking-tighter text-foreground">
          {score}
        </span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-widest text-text-muted">
          Recovery
        </span>
      </motion.div>
    </div>
  );
}
