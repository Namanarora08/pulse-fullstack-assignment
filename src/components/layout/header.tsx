import { Badge } from "@/components/ui/badge";

type HeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function Header({ eyebrow, title, description, action }: HeaderProps) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl space-y-1.5">
        {eyebrow ? (
          <Badge variant="secondary" className="w-fit">
            {eyebrow}
          </Badge>
        ) : null}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action ? (
        <div className="flex shrink-0 items-center gap-2">{action}</div>
      ) : null}
    </header>
  );
}
