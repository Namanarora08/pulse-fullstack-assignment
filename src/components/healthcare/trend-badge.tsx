import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type TrendBadgeProps = {
  trend: "up" | "down" | "stable";
  label?: string;
};

const trendContent = {
  up: { label: "Improving", icon: ArrowUpRight, variant: "success" as const },
  down: { label: "Watch", icon: ArrowDownRight, variant: "warning" as const },
  stable: { label: "Stable", icon: ArrowRight, variant: "secondary" as const }
};

export function TrendBadge({ trend, label }: TrendBadgeProps) {
  const content = trendContent[trend];
  const Icon = content.icon;

  return (
    <Badge variant={content.variant} className="gap-1">
      <Icon className="h-3 w-3" aria-hidden="true" />
      {label ?? content.label}
    </Badge>
  );
}
