import { Skeleton } from "@/components/ui/skeleton";

export default function IncidentDetailLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-32" />
      <div className="space-y-2 border-b border-border pb-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
}
