import { Card } from "@/components/ui/card";

type QuestionCardProps = {
  eyebrow: string;
  question: string;
  children: React.ReactNode;
};

export function QuestionCard({
  eyebrow,
  question,
  children
}: QuestionCardProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {eyebrow}
          </span>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
            {question}
          </h2>
        </div>
        {children}
      </div>
    </Card>
  );
}
