"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

type YesNoSwipeCardProps = {
  prompt: string;
  value?: boolean | null;
  onChange?: (value: boolean) => void;
};

export function YesNoSwipeCard({ prompt, value, onChange }: YesNoSwipeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/40"
    >
      <p className="mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300">{prompt}</p>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange?.(false)}
          className={`flex h-11 items-center justify-center gap-2 rounded-xl border text-xs font-semibold transition-all ${
            value === false
              ? "border-rose-300 bg-rose-600 text-white shadow-sm dark:border-rose-900"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
          No
        </button>
        <button
          type="button"
          onClick={() => onChange?.(true)}
          className={`flex h-11 items-center justify-center gap-2 rounded-xl border text-xs font-semibold transition-all ${
            value === true
              ? "border-blue-700 bg-blue-600 text-white shadow-sm dark:border-blue-500"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          <Check className="h-4 w-4" aria-hidden="true" />
          Yes
        </button>
      </div>
    </motion.div>
  );
}
