"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Filter } from "lucide-react";

export function OrdersFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [payment, setPayment] = useState(searchParams.get("payment") || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
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
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#111] p-4 rounded-2xl border border-white/10 shadow-lg">
      <div className="flex flex-1 w-full flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by Order ID, Name, or Mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 items-center overflow-x-auto pb-2 sm:pb-0">
          <Filter className="w-4 h-4 text-gray-500 ml-2 hidden sm:block" />
          
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              updateFilter("status", e.target.value);
            }}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer appearance-none min-w-[140px]"
          >
            <option value="" className="bg-[#111]">All Statuses</option>
            <option value="PENDING" className="bg-[#111]">Pending</option>
            <option value="ACCEPTED" className="bg-[#111]">Accepted</option>
            <option value="PREPARING" className="bg-[#111]">Preparing</option>
            <option value="OUT_FOR_DELIVERY" className="bg-[#111]">Out for Delivery</option>
            <option value="DELIVERED" className="bg-[#111]">Delivered</option>
            <option value="CANCELLED" className="bg-[#111]">Cancelled</option>
          </select>

          <select
            value={payment}
            onChange={(e) => {
              setPayment(e.target.value);
              updateFilter("payment", e.target.value);
            }}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer appearance-none min-w-[130px]"
          >
            <option value="" className="bg-[#111]">All Payments</option>
            <option value="COD" className="bg-[#111]">Method: COD</option>
            <option value="ONLINE" className="bg-[#111]">Method: Online</option>
            <option value="COMPLETED" className="bg-[#111]">Status: Paid</option>
            <option value="PENDING" className="bg-[#111]">Status: Pending</option>
          </select>
        </div>
      </div>
    </div>
  );
}
