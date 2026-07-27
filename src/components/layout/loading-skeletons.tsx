import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeletons() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-lg border bg-card p-5">
          <Skeleton className="mb-4 h-4 w-24" />
          <Skeleton className="mb-3 h-8 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}
