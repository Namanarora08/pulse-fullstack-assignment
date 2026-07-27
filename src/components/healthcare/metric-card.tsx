import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { TrendBadge } from "@/components/healthcare/trend-badge";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  trend?: "up" | "down" | "stable";
  icon: LucideIcon;
};

export function MetricCard({
  label,
  value,
  detail,
  trend = "stable",
  icon: Icon
}: MetricCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{value}</p>
        <TrendBadge trend={trend} />
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detail}</p>
    </Card>
  );
}
