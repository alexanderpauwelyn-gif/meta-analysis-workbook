/** Pulsing skeleton block */
export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-zinc-800 rounded-lg ${className}`} />
  );
}

/** Grid of KPI card skeletons */
export function KPISkeletons({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <Skeleton className="h-3 w-16 mb-3" />
          <Skeleton className="h-7 w-24 mb-2" />
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}

/** Chart placeholder skeleton */
export function ChartSkeleton({ height = 'h-64' }) {
  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-5 ${height}`}>
      <Skeleton className="h-4 w-32 mb-4" />
      <div className="flex items-end gap-1 h-40">
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-zinc-800 rounded-t animate-pulse"
            style={{ height: `${30 + Math.random() * 70}%`, animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

/** Table skeleton */
export function TableSkeleton({ rows = 8, cols = 10 }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 px-4 py-3 border-b border-zinc-800">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 px-4 py-3 border-b border-zinc-800/50">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={c}
              className="h-3 flex-1"
              style={{ opacity: 1 - r * 0.08 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Grid of ad card skeletons */
export function AdCardSkeletons({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <Skeleton className="w-full h-40 rounded-none" />
          <div className="p-4">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/3 mb-4" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j}>
                  <Skeleton className="h-2 w-8 mb-1" />
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
