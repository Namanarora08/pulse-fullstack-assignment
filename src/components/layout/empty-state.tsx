import { ClipboardList } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex min-h-56 flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-secondary text-muted-foreground">
          {icon ?? <ClipboardList className="h-5 w-5" aria-hidden="true" />}
        </div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
