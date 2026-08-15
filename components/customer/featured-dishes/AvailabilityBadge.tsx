import React from 'react';

interface AvailabilityBadgeProps {
  isAvailable: boolean;
}

export const AvailabilityBadge = ({ isAvailable }: AvailabilityBadgeProps) => {
  if (isAvailable) {
    return (
      <div className="absolute top-4 right-4 z-20">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-widest uppercase shadow-sm backdrop-blur-md">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          </span>
          Available
        </span>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-20">
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold tracking-widest uppercase shadow-sm backdrop-blur-md">
        <span className="relative flex h-1.5 w-1.5">
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500"></span>
        </span>
        Out of Stock
      </span>
    </div>
  );
};
