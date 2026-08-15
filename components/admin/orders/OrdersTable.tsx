"use client";

import { Eye, Clock, CheckCircle2, Truck, XCircle, Box } from "lucide-react";

interface OrdersTableProps {
  orders: any[];
  onView: (order: any) => void;
}

export function OrdersTable({ orders, onView }: OrdersTableProps) {
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-[#111] border border-white/10 rounded-2xl flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <Box className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Orders Found</h3>
        <p className="text-gray-400 text-center max-w-sm">
          We couldn't find any orders matching your current filters.
        </p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "ACCEPTED":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "PREPARING":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "OUT_FOR_DELIVERY":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "DELIVERED":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "CANCELLED":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "ACCEPTED":
        return "Accepted";
      case "PREPARING":
        return "Preparing";
      case "OUT_FOR_DELIVERY":
        return "Out for Delivery";
      case "DELIVERED":
        return "Delivered";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="text-xs uppercase bg-white/5 border-b border-white/10 text-gray-400">
            <tr>
              <th className="px-6 py-4 font-semibold">Order Details</th>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Payment</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Amount</th>
              <th className="px-6 py-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-white">{order.orderNumber}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(order.createdAt))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{order.customerName}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{order.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-300">{order.paymentMethod}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        order.paymentStatus === "COMPLETED"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                      }`}
                    >
                      {order.paymentStatus === "COMPLETED" ? "Paid" : "Pending"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {getStatusLabel(order.orderStatus)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="font-semibold text-white">₹{order.total.toFixed(2)}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{order.orderItems?.length || 0} items</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onView(order)}
                    className="inline-flex items-center justify-center p-2 bg-white/5 hover:bg-primary/20 hover:text-primary text-gray-300 rounded-lg transition-colors border border-transparent hover:border-primary/30"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
