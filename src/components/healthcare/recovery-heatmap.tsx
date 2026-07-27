"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface HeatmapDay {
  date: string;
  score: number | null; // null if no record, 0-100 otherwise
  status: "Completed" | "Pending" | "Missed" | "Future";
}

interface RecoveryHeatmapProps {
  days?: HeatmapDay[];
}

export function RecoveryHeatmap({ days }: RecoveryHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);

  // Generate 35 default days if not provided
  const generateMockDays = (): HeatmapDay[] => {
    const list: HeatmapDay[] = [];
    const today = new Date();
    for (let i = 34; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      
      let score: number | null = null;
      let status: HeatmapDay["status"] = "Completed";

      if (i === 0) {
        score = 92;
        status = "Pending";
      } else if (i % 7 === 0) {
        score = null;
        status = "Missed";
      } else {
        score = Math.floor(78 + Math.random() * 20);
        status = "Completed";
      }

      list.push({ date: dateStr, score, status });
    }
    return list;
  };

  const data = days && days.length > 0 ? days : generateMockDays();

  // Helper function to pick color based on score
  const getColorClass = (day: HeatmapDay) => {
    if (day.status === "Missed" || day.score === null) {
      return "bg-slate-100 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800";
    }
    if (day.score >= 90) {
      return "bg-emerald-500 shadow-sm shadow-emerald-500/20";
    }
    if (day.score >= 80) {
      return "bg-blue-600 shadow-sm shadow-blue-500/20";
    }
    if (day.score >= 70) {
      return "bg-blue-400 dark:bg-blue-500";
    }
    return "bg-amber-400 dark:bg-amber-500";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            Recovery Score Heatmap
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            (Last 35 Days)
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
          <span>Less</span>
          <span className="h-2.5 w-2.5 rounded-sm bg-slate-200 dark:bg-slate-800" />
          <span className="h-2.5 w-2.5 rounded-sm bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-sm bg-blue-400" />
          <span className="h-2.5 w-2.5 rounded-sm bg-blue-600" />
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
          <span>More</span>
        </div>
      </div>

      {/* Grid container */}
      <div className="relative">
        <div className="grid grid-flow-col grid-rows-5 gap-1.5 sm:gap-2 overflow-x-auto pb-1">
          {data.map((day) => (
            <motion.div
              key={day.date}
              whileHover={{ scale: 1.25, zIndex: 10 }}
              transition={{ duration: 0.15 }}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              className={`h-5 w-5 sm:h-6 sm:w-6 rounded-md cursor-pointer transition-colors ${getColorClass(
                day
              )}`}
            />
          ))}
        </div>

        {/* Tooltip on hover */}
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-xl border border-slate-200 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg dark:border-slate-800 z-30 pointer-events-none"
          >
            <span>{hoveredDay.date}: </span>
            {hoveredDay.score !== null ? (
              <span className="text-emerald-400">{hoveredDay.score} / 100 Recovery Score</span>
            ) : (
              <span className="text-slate-400">No Check-in Logged</span>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
