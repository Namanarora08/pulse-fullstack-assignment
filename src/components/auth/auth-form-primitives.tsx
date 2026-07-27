"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AuthAccent = "blue" | "emerald" | "slate";

const accentStyles: Record<
  AuthAccent,
  {
    badge: string;
    demoButton: string;
    input: string;
    checkbox: string;
    submit: string;
  }
> = {
  blue: {
    badge: "bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400",
    demoButton:
      "border-blue-200 bg-blue-50/80 text-blue-700 hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/80",
    input:
      "focus:border-blue-500 focus:ring-blue-500/20 dark:focus:border-blue-500",
    checkbox: "text-blue-600 focus:ring-blue-500",
    submit:
      "bg-blue-600 text-white shadow-blue-500/25 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
  },
  emerald: {
    badge:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400",
    demoButton:
      "border-emerald-200 bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/80",
    input:
      "focus:border-emerald-500 focus:ring-emerald-500/20 dark:focus:border-emerald-500",
    checkbox: "text-emerald-600 focus:ring-emerald-500",
    submit:
      "bg-emerald-600 text-white shadow-emerald-500/25 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
  },
  slate: {
    badge: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
    demoButton:
      "border-slate-300 bg-slate-100/80 text-slate-800 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700",
    input:
      "focus:border-slate-500 focus:ring-slate-500/20 dark:focus:border-slate-500",
    checkbox: "text-slate-700 focus:ring-slate-500",
    submit:
      "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
  }
};

export function AuthFormShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 sm:p-8">
      {children}
    </div>
  );
}

type AuthFormHeaderProps = {
  accent: AuthAccent;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  demoLabel: string;
  onDemoFill: () => void;
};

export function AuthFormHeader({
  accent,
  icon: Icon,
  title,
  subtitle,
  demoLabel,
  onDemoFill
}: AuthFormHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            accentStyles[accent].badge
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {title}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {subtitle}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onDemoFill}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all active:scale-95",
          accentStyles[accent].demoButton
        )}
      >
        <Sparkles className="h-3.5 w-3.5" />
        {demoLabel}
      </button>
    </div>
  );
}

export function AuthErrorBanner({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
      {message}
    </div>
  );
}

export function AuthFieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
      {children}
    </label>
  );
}

function authInputClasses(accent: AuthAccent, hasTrailingSlot: boolean) {
  return cn(
    "w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 text-sm text-slate-900 outline-none transition-all focus:bg-white focus:ring-2 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:focus:bg-slate-950",
    hasTrailingSlot ? "pr-10" : "pr-4",
    accentStyles[accent].input
  );
}

type AuthFieldProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "className"
> & {
  accent: AuthAccent;
  icon: LucideIcon;
  label: string;
  hint?: string;
  inputClassName?: string;
};

export function AuthField({
  accent,
  icon: Icon,
  label,
  hint,
  inputClassName,
  ...inputProps
}: AuthFieldProps) {
  return (
    <div className="space-y-1.5">
      <AuthFieldLabel>{label}</AuthFieldLabel>
      <div className="relative flex items-center">
        <Icon className="absolute left-3.5 h-4 w-4 text-slate-400" />
        <input
          {...inputProps}
          className={cn(authInputClasses(accent, false), inputClassName)}
        />
      </div>
      {hint && (
        <p className="text-[11px] text-slate-600 dark:text-slate-300">{hint}</p>
      )}
    </div>
  );
}

type AuthPasswordFieldProps = Omit<AuthFieldProps, "type"> & {
  icon: LucideIcon;
};

export function AuthPasswordField({
  accent,
  icon: Icon,
  label,
  hint,
  inputClassName,
  ...inputProps
}: AuthPasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <AuthFieldLabel>{label}</AuthFieldLabel>
      <div className="relative flex items-center">
        <Icon className="absolute left-3.5 h-4 w-4 text-slate-400" />
        <input
          {...inputProps}
          type={visible ? "text" : "password"}
          className={cn(authInputClasses(accent, true), inputClassName)}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {hint && (
        <p className="text-[11px] text-slate-600 dark:text-slate-300">{hint}</p>
      )}
    </div>
  );
}

type AuthCheckboxProps = {
  accent: AuthAccent;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

export function AuthCheckbox({
  accent,
  checked,
  onChange,
  label
}: AuthCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={cn(
          "h-4 w-4 rounded border-slate-300 dark:border-slate-700 dark:bg-slate-800",
          accentStyles[accent].checkbox
        )}
      />
      {label}
    </label>
  );
}

type AuthSubmitButtonProps = {
  accent: AuthAccent;
  loading: boolean;
  loadingLabel: string;
  label: string;
  icon: LucideIcon;
};

export function AuthSubmitButton({
  accent,
  loading,
  loadingLabel,
  label,
  icon: Icon
}: AuthSubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={loading}
      className={cn(
        "active:scale-98 w-full rounded-xl py-3 text-sm font-semibold shadow-lg transition-all",
        accentStyles[accent].submit
      )}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingLabel}
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          {label}
          <Icon className="h-4 w-4" />
        </div>
      )}
    </Button>
  );
}
