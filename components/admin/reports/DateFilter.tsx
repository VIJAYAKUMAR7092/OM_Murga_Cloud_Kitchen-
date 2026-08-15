"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function DateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || "last7";

  const filters = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 Days", value: "last7" },
    { label: "Last 30 Days", value: "last30" },
    { label: "This Month", value: "thisMonth" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.set("filter", f.value);
            router.push(`?${params.toString()}`);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentFilter === f.value 
              ? "bg-primary text-black" 
              : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
