"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeatmapDay {
  date: string;
  score: number | null;
  status: "Completed" | "Pending" | "Missed" | "Future";
}

interface RecoveryHeatmapProps {
  days?: HeatmapDay[];
}

const WEEKS = 15;
const DAYS_PER_WEEK = 7;
const TOTAL = WEEKS * DAYS_PER_WEEK;

function generateMockDays(): HeatmapDay[] {
  const list: HeatmapDay[] = [];
  const today = new Date();

  for (let i = TOTAL - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    let score: number | null;
    let status: HeatmapDay["status"];

    if (i === 0) {
      score = 92;
      status = "Pending";
    } else if (i % 11 === 0) {
      score = null;
      status = "Missed";
    } else {
      score = Math.floor(60 + Math.random() * 38);
      status = "Completed";
    }
    list.push({ date: dateStr, score, status });
  }
  return list;
}

function getColor(day: HeatmapDay): string {
  if (day.status === "Missed" || day.score === null)
    return "rgba(255,255,255,0.05)";
  if (day.status === "Pending") return "rgba(251,191,36,0.6)";
  if (day.score >= 90) return "#34D399";
  if (day.score >= 78) return "#10B981";
  if (day.score >= 65) return "#059669";
  return "#047857";
}

function getGlow(day: HeatmapDay): string {
  if (!day.score || day.score < 65) return "none";
  const alpha = day.score >= 90 ? 0.5 : 0.3;
  return `drop-shadow(0 0 4px rgba(52,211,153,${alpha}))`;
}

export function RecoveryHeatmap({ days }: RecoveryHeatmapProps) {
  const [hovered, setHovered] = useState<HeatmapDay | null>(null);
  const data = days && days.length > 0 ? days : generateMockDays();

  // Chunk into columns (weeks)
  const columns: HeatmapDay[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    columns.push(data.slice(w * DAYS_PER_WEEK, (w + 1) * DAYS_PER_WEEK));
  }

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Recovery Heatmap
          </h3>
          <p className="mt-0.5 text-xs text-text-muted">Last {WEEKS} weeks</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
          <span>Less</span>
          {[
            "rgba(255,255,255,0.06)",
            "#047857",
            "#059669",
            "#10B981",
            "#34D399"
          ].map((c) => (
            <span
              key={c}
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: c }}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {/* Day labels */}
        <div className="flex shrink-0 flex-col gap-[3px] pt-0">
          {dayLabels.map((d) => (
            <div
              key={d}
              className="flex h-[11px] items-center text-[9px] leading-none text-text-muted"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-[3px]">
          {columns.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: (wi * 7 + di) * 0.003,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  whileHover={{ scale: 1.4, zIndex: 10 }}
                  onMouseEnter={() => setHovered(day)}
                  onMouseLeave={() => setHovered(null)}
                  className="transition-apple-fast h-[11px] w-[11px] cursor-pointer rounded-sm"
                  style={{
                    background: getColor(day),
                    filter: getGlow(day)
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key={hovered.date}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs"
            style={{
              background: "#202024",
              border: "1px solid rgba(255,255,255,0.08)"
            }}
          >
            <span className="font-mono text-text-muted">{hovered.date}</span>
            {hovered.score !== null ? (
              <span className="font-semibold text-recovery">
                {hovered.score}/100
              </span>
            ) : (
              <span className="text-text-muted">No check-in</span>
            )}
            <span
              className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
              style={{
                background:
                  hovered.status === "Completed"
                    ? "rgba(52,211,153,0.12)"
                    : hovered.status === "Pending"
                      ? "rgba(251,191,36,0.12)"
                      : "rgba(255,255,255,0.06)",
                color:
                  hovered.status === "Completed"
                    ? "#34D399"
                    : hovered.status === "Pending"
                      ? "#FBBF24"
                      : "#71717A"
              }}
            >
              {hovered.status}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
