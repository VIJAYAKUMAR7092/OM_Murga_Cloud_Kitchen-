export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      
      {/* Welcome Section Skeleton */}
      <div className="rounded-2xl bg-[#111] border border-white/5 p-8 h-40">
        <div className="h-8 bg-white/5 rounded-lg w-1/3 mb-4" />
        <div className="h-4 bg-white/5 rounded-lg w-1/2" />
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className="bg-[#111] rounded-2xl p-6 border border-white/5 h-36"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 mb-4" />
            <div className="h-4 bg-white/5 rounded w-1/2 mb-2" />
            <div className="h-8 bg-white/5 rounded w-1/3" />
          </div>
        ))}
      </div>

      {/* Activity Skeleton */}
      <div className="bg-[#111] rounded-2xl border border-white/5 p-6 h-64">
        <div className="h-6 bg-white/5 rounded w-1/4 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-white/5 rounded-lg w-full" />
          ))}
        </div>
      </div>
      
    </div>
  );
}
