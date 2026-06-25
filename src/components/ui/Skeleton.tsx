import { cn } from '@/utils/cn';

/** Animated placeholder block shown while data is loading. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
    />
  );
}

/** Card-shaped skeleton matching the tutor list row. */
export function TutorCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex flex-col gap-5 sm:flex-row">
        <Skeleton className="mx-auto h-32 w-32 rounded-2xl sm:mx-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="hidden w-52 space-y-3 sm:block">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    </div>
  );
}
