"use client";

import { useState } from "react";
import { OrdersFilters } from "./OrdersFilters";
import { OrdersTable } from "./OrdersTable";
import { OrderDetailsDrawer } from "./OrderDetailsDrawer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface OrdersClientProps {
  initialOrders: any[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

export function OrdersClient({ initialOrders, pagination }: OrdersClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Order Management</h1>
          <p className="text-gray-400 mt-1">Manage and track customer orders.</p>
        </div>
      </div>

      <OrdersFilters />

      <OrdersTable 
        orders={initialOrders} 
        onView={(order) => {
          setSelectedOrder(order);
          if (!order.isRead) {
            fetch(`/api/admin/orders/${order.id}/read`, { method: "POST" }).catch(console.error);
          }
        }} 
      />

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between bg-[#111] border border-white/10 rounded-2xl p-4">
          <p className="text-sm text-gray-400">
            Showing <span className="font-medium text-white">{((pagination.page - 1) * pagination.limit) + 1}</span> to{" "}
            <span className="font-medium text-white">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of <span className="font-medium text-white">{pagination.total}</span> results
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white/5 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <OrderDetailsDrawer 
        order={selectedOrder} 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />
    </div>
  );
}
