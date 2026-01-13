import { cn } from "@/lib/utils";

/**
 * Base Skeleton Component
 * Provides the shimmer animation and base styling
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-800",
        className
      )}
      {...props}
    />
  );
}

/**
 * Skeleton Card Component
 * Displays a card-like skeleton with header and content lines
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950",
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Content Lines */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}

/**
 * Skeleton Table Row Component
 * Displays a table row skeleton with 5 cells
 */
export function SkeletonTableRow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center space-x-4 border-b border-gray-200 py-4 dark:border-gray-800",
        className
      )}
    >
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-16 rounded-md" />
    </div>
  );
}

/**
 * Skeleton Stat Component
 * Displays a stat card skeleton with icon, number, and label
 */
export function SkeletonStat({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950",
        className
      )}
    >
      <div className="flex items-center space-x-4">
        {/* Icon Circle */}
        <Skeleton className="h-12 w-12 rounded-full" />

        {/* Stat Content */}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Optional Trend Line */}
      <div className="mt-4">
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

/**
 * Skeleton Chart Component
 * Displays a chart placeholder skeleton
 */
export function SkeletonChart({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950",
        className
      )}
    >
      {/* Chart Header */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Chart Area */}
      <Skeleton className="h-[300px] w-full rounded-md" />

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton Table Component
 * Displays multiple table rows for complete table loading state
 */
export function SkeletonTable({
  rows = 5,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className
      )}
    >
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {Array.from({ length: rows }).map((_, index) => (
          <SkeletonTableRow key={index} className="border-0 px-6" />
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton Grid Component
 * Displays a grid of skeleton cards
 */
export function SkeletonGrid({
  cards = 6,
  className,
}: {
  cards?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {Array.from({ length: cards }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

/**
 * Skeleton Stats Row Component
 * Displays a row of stat card skeletons
 */
export function SkeletonStatsRow({
  stats = 4,
  className,
}: {
  stats?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {Array.from({ length: stats }).map((_, index) => (
        <SkeletonStat key={index} />
      ))}
    </div>
  );
}
