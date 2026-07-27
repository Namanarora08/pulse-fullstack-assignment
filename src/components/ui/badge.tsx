import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-tight transition-colors",
  {
    variants: {
      variant: {
        default: "border-blue-200/80 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300",
        secondary: "border-slate-200/80 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300",
        outline: "border-slate-200/80 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200",
        success: "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/60 dark:text-emerald-300",
        warning: "border-amber-200/80 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/60 dark:text-amber-300",
        danger: "border-rose-200/80 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/60 dark:text-rose-300"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
