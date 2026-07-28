"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  /* Base */
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-xl text-sm font-medium tracking-tight",
    "transition-all duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.96]",
    "select-none"
  ].join(" "),
  {
    variants: {
      variant: {
        /* Primary — filled white */
        default: [
          "bg-[#FAFAFA] text-[#09090B]",
          "hover:bg-white",
          "shadow-[0_1px_3px_rgba(0,0,0,.4)]"
        ].join(" "),

        /* Subtle filled surface */
        secondary: [
          "bg-[#202024] text-[#FAFAFA]",
          "border border-white/[0.08]",
          "hover:bg-[#2a2a2e] hover:border-white/[0.12]"
        ].join(" "),

        /* Ghost */
        ghost: [
          "text-text-secondary",
          "hover:bg-white/[0.05] hover:text-foreground"
        ].join(" "),

        /* Outline */
        outline: [
          "border border-white/[0.10] bg-transparent text-foreground",
          "hover:bg-white/[0.04] hover:border-white/[0.16]"
        ].join(" "),

        /* Glass */
        glass: [
          "glass text-foreground",
          "hover:bg-white/[0.08]",
          "shadow-premium-sm"
        ].join(" "),

        /* ── Semantic healthcare ── */
        recovery: [
          "bg-recovery text-[#09090B] font-semibold",
          "hover:brightness-110",
          "shadow-glow-green shadow-[0_4px_12px_rgba(0,0,0,.5)]"
        ].join(" "),

        heart: [
          "bg-heart text-white font-semibold",
          "hover:brightness-110",
          "shadow-glow-red"
        ].join(" "),

        medication: [
          "bg-medication text-white font-semibold",
          "hover:brightness-110",
          "shadow-glow-blue"
        ].join(" "),

        sleep: [
          "bg-sleep text-white font-semibold",
          "hover:brightness-110",
          "shadow-glow-purple"
        ].join(" "),

        hydration: [
          "bg-hydration text-[#09090B] font-semibold",
          "hover:brightness-110",
          "shadow-glow-cyan"
        ].join(" "),

        warning: [
          "bg-warning text-[#09090B] font-semibold",
          "hover:brightness-110",
          "shadow-glow-amber"
        ].join(" "),

        danger: [
          "bg-danger text-white font-semibold",
          "hover:brightness-110",
          "shadow-glow-red"
        ].join(" ")
      },
      size: {
        xs: "h-7  px-2.5 text-xs  rounded-lg",
        sm: "h-8  px-3   text-xs  rounded-lg",
        default: "h-10 px-4   text-sm",
        lg: "h-11 px-5   text-sm",
        xl: "h-12 px-6   text-base rounded-2xl",
        icon: "h-9  w-9    p-0",
        "icon-sm": "h-7 w-7    p-0 rounded-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
