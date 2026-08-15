"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Plus, Filter } from "lucide-react";

export function FoodFilters({ onAdd }: { onAdd: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [isVegetarian, setIsVegetarian] = useState(searchParams.get("isVegetarian") || "");
  const [isAvailable, setIsAvailable] = useState(searchParams.get("isAvailable") || "");

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      params.set("page", "1"); // Reset to page 1 on search
      router.push(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, pathname, router, searchParams]);

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set("page", "1"); // Reset to page 1 on filter
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#111] p-4 rounded-2xl border border-white/10 shadow-lg">
      <div className="flex flex-1 w-full md:w-auto flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search foods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 items-center overflow-x-auto pb-2 sm:pb-0">
          <Filter className="w-4 h-4 text-gray-500 ml-2 hidden sm:block" />
          
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              updateFilter("category", e.target.value);
            }}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer appearance-none min-w-[120px]"
          >
            <option value="" className="bg-[#111]">All Categories</option>
            <option value="Breakfast" className="bg-[#111]">Breakfast</option>
            <option value="Lunch" className="bg-[#111]">Lunch</option>
            <option value="Dinner" className="bg-[#111]">Dinner</option>
          </select>

          <select
            value={isVegetarian}
            onChange={(e) => {
              setIsVegetarian(e.target.value);
              updateFilter("isVegetarian", e.target.value);
            }}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer appearance-none min-w-[100px]"
          >
            <option value="" className="bg-[#111]">All Types</option>
            <option value="true" className="bg-[#111]">Veg Only</option>
            <option value="false" className="bg-[#111]">Non-Veg Only</option>
          </select>

          <select
            value={isAvailable}
            onChange={(e) => {
              setIsAvailable(e.target.value);
              updateFilter("isAvailable", e.target.value);
            }}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer appearance-none min-w-[110px]"
          >
            <option value="" className="bg-[#111]">Any Status</option>
            <option value="true" className="bg-[#111]">Available</option>
            <option value="false" className="bg-[#111]">Unavailable</option>
          </select>
        </div>
      </div>

      <button
        onClick={onAdd}
        className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-black font-semibold px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all hover:-translate-y-0.5 active:translate-y-0"
      >
        <Plus className="w-5 h-5" />
        <span>Add Food</span>
      </button>
    </div>
  );
}
