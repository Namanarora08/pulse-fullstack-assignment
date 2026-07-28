import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-tight transition-apple-fast",
  {
    variants: {
      variant: {
        default:
          "bg-white/[0.08]  border border-white/[0.10] text-text-primary",
        secondary:
          "bg-white/[0.05]  border border-white/[0.07] text-text-secondary",
        recovery: "bg-recovery/10   border border-recovery/20  text-recovery",
        heart: "bg-heart/10      border border-heart/20     text-heart",
        medication:
          "bg-medication/10 border border-medication/20 text-medication",
        sleep: "bg-sleep/10      border border-sleep/20     text-sleep",
        hydration: "bg-hydration/10  border border-hydration/20 text-hydration",
        warning: "bg-warning/10    border border-warning/20   text-warning",
        danger: "bg-danger/10     border border-danger/20    text-danger",
        outline:
          "border border-white/[0.10] bg-transparent   text-text-primary",
        ghost: "border-transparent bg-white/[0.04]          text-text-muted",
        success: "bg-recovery/10   border border-recovery/20  text-recovery"
      }
    },
    defaultVariants: { variant: "default" }
  }
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
