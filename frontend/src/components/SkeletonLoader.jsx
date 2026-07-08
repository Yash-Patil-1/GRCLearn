export default function SkeletonLoader({ variant = 'lesson', count = 1, lines = 3 }) {
  if (variant === 'lesson') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-sm bg-carbon shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-carbon rounded w-3/4" />
                <div className="flex gap-3">
                  <div className="h-3 bg-carbon rounded w-20" />
                  <div className="h-3 bg-carbon rounded w-24" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'text') {
    return (
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card">
            {Array.from({ length: lines }).map((_, j) => (
              <div key={j} className="h-3 bg-carbon rounded mb-2"
                style={{ width: `${70 + Math.random() * 25}%` }} />
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="animate-pulse card">
      <div className="h-4 bg-carbon rounded w-1/2 mb-4" />
      <div className="h-3 bg-carbon rounded w-full mb-2" />
      <div className="h-3 bg-carbon rounded w-3/4" />
    </div>
  )
}
