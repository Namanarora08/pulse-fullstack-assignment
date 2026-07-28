import * as React from "react";
import { cn } from "@/lib/utils";

/* ── Base surface card ────────────────────────────────────────────────── */
export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("transition-apple rounded-2xl", className)}
      style={{
        background: "#18181B",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 12px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.04)",
        ...(
          props as React.HTMLAttributes<HTMLDivElement> & {
            style?: React.CSSProperties;
          }
        ).style
      }}
      {...props}
    />
  );
}

/* ── Elevated glass card ──────────────────────────────────────────────── */
export function GlassCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("glass-card transition-apple", className)} {...props} />
  );
}

/* ── Raised surface (one step above Card) ────────────────────────────── */
export function SurfaceCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("transition-apple rounded-2xl", className)}
      style={{
        background: "#202024",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 1px 3px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.04)"
      }}
      {...props}
    />
  );
}

/* ── Sub-components ───────────────────────────────────────────────────── */
export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pb-4", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-base font-semibold leading-tight tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "mt-1 text-xs leading-relaxed text-text-secondary",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center border-t border-white/[0.06] p-6 pt-0",
        className
      )}
      {...props}
    />
  );
}
