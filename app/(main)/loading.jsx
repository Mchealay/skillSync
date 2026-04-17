import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-12 w-[300px] bg-muted/40" />
        <Skeleton className="h-4 w-[200px] bg-muted/20" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card p-6 rounded-xl border border-border/50 space-y-3">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-8 w-[60px]" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
