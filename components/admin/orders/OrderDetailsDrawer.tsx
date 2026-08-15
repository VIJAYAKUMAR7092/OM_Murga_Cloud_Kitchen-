"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, User, Phone, Mail, CheckCircle2, Package, Truck, Home, XCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface OrderDetailsDrawerProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_FLOW = {
  PENDING: ["ACCEPTED", "CANCELLED"],
  ACCEPTED: ["PREPARING", "CANCELLED"],
  PREPARING: ["OUT_FOR_DELIVERY", "CANCELLED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "CANCELLED"],
  DELIVERED: ["CANCELLED"],
  CANCELLED: [],
} as Record<string, string[]>;

const TIMELINE_STAGES = [
  { id: "PENDING", label: "Pending", icon: Package },
  { id: "ACCEPTED", label: "Accepted", icon: CheckCircle2 },
  { id: "PREPARING", label: "Preparing", icon: Package },
  { id: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: Truck },
  { id: "DELIVERED", label: "Delivered", icon: Home },
];

export function OrderDetailsDrawer({ order, isOpen, onClose }: OrderDetailsDrawerProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [eta, setEta] = useState<number | null>(order.estimatedDeliveryTime || null);
  const [customEta, setCustomEta] = useState('');

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setEta(order.estimatedDeliveryTime || null);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, order]);

  if (!order) return null;

  const allowedTransitions = STATUS_FLOW[order.orderStatus] || [];

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: newStatus,
          estimatedDeliveryTime: eta 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      toast.success("Order status updated");
      router.refresh();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!confirm("Confirm cash has been collected?")) return;
    try {
      setIsUpdating(true);
      const res = await fetch(`/api/admin/orders/${order.id}/payment`, {
        method: "PATCH",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update payment");

      toast.success("Payment marked as complete");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentStageIndex = TIMELINE_STAGES.findIndex(s => s.id === order.orderStatus);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-lg bg-[#111] border-l border-white/10 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex-none px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{order.orderNumber}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      order.paymentStatus === "COMPLETED"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                    }`}
                  >
                    {order.paymentMethod} - {order.paymentStatus === "COMPLETED" ? "Paid" : "Pending"}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* Timeline */}
              {order.orderStatus !== "CANCELLED" ? (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Order Status</h3>
                  <div className="relative flex justify-between">
                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/10 -z-10" />
                    {TIMELINE_STAGES.map((stage, index) => {
                      const Icon = stage.icon;
                      const isCompleted = currentStageIndex >= index;
                      const isCurrent = currentStageIndex === index;

                      return (
                        <div key={stage.id} className="flex flex-col items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                              isCurrent
                                ? "bg-primary border-primary text-black"
                                : isCompleted
                                ? "bg-primary/20 border-primary text-primary"
                                : "bg-[#111] border-gray-600 text-gray-600"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] font-medium text-center ${isCompleted ? "text-primary" : "text-gray-500"}`}>
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Order Status</h3>
                  <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <XCircle className="w-6 h-6 text-red-400" />
                    <div>
                      <p className="font-semibold text-red-400">Order Cancelled</p>
                      <p className="text-sm text-gray-400">This order was cancelled.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Customer Details</h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-300">{order.phone}</p>
                      {order.whatsapp && <p className="text-sm text-green-400 mt-0.5">WhatsApp: {order.whatsapp}</p>}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-300">{order.email || "Not Provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-300">
                        {order.houseNumber}, {order.formattedAddress}
                      </p>
                      {order.landmark && <p className="text-sm text-gray-400 mt-1">Landmark: {order.landmark}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Order Items ({order.orderItems?.length})</h3>
                <div className="space-y-3">
                  {order.orderItems?.map((item: any) => (
                    <div key={item.id} className="flex gap-4 bg-white/5 border border-white/10 p-3 rounded-xl">
                      <div className="w-16 h-16 rounded-lg bg-white/10 overflow-hidden flex-none">
                        {item.food?.image ? (
                          <img src={item.food.image} alt={item.foodName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-medium text-white truncate">{item.foodName}</h4>
                          <span className="text-sm font-semibold text-white">₹{item.subtotal.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          {item.quantity} x ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Payment Summary</h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Delivery Fee</span>
                    <span>₹{order.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax</span>
                    <span>₹{order.tax.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-white/10 flex justify-between text-white font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary">₹{order.total.toFixed(2)}</span>
                  </div>
                  {order.paymentMethod === 'ONLINE' && order.razorpayPaymentId && (
                    <div className="pt-2 mt-2 border-t border-white/10 space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Transaction ID</span>
                        <span className="text-gray-300 font-mono">{order.razorpayPaymentId}</span>
                      </div>
                      {order.paidAt && (
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Paid At</span>
                          <span className="text-gray-300">{new Date(order.paidAt).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {order.paymentMethod === 'COD' && (
                    <div className="pt-2 mt-2 border-t border-white/10 space-y-2">
                      {order.paymentStatus === 'PENDING' ? (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-yellow-500 font-medium flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                            Payment Pending
                          </span>
                          <button
                            onClick={handleMarkAsPaid}
                            disabled={isUpdating}
                            className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Mark as Paid
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-1.5 text-green-500 font-bold text-sm">
                            <CheckCircle2 className="w-4 h-4" /> ✅ Paid
                          </div>
                          {order.paidAt && (
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>Paid At</span>
                              <span className="text-gray-300">{new Date(order.paidAt).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer / Actions */}
            <div className="flex-none p-5 border-t border-white/10 bg-[#111]">
              
              {(order.orderStatus === 'PENDING' || order.orderStatus === 'ACCEPTED' || order.orderStatus === 'PREPARING') && (
                <div className="mb-5 pb-5 border-b border-white/10">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex justify-between items-center">
                    Estimated Delivery Time
                    {order.estimatedDeliveryTime && <span className="text-primary normal-case font-bold">{order.estimatedDeliveryTime} mins set</span>}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[15, 20, 30, 45, 60].map(mins => (
                      <button
                        key={mins}
                        onClick={() => setEta(mins)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          eta === mins 
                            ? 'bg-primary text-black' 
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        {mins} min
                      </button>
                    ))}
                    <div className="flex items-center gap-2">
                       <input 
                         type="number" 
                         placeholder="Custom"
                         value={customEta}
                         onChange={(e) => {
                           setCustomEta(e.target.value);
                           if (e.target.value) setEta(parseInt(e.target.value));
                         }}
                         className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white w-20 outline-none focus:border-primary"
                       />
                       <span className="text-xs text-gray-400">min</span>
                    </div>
                  </div>
                </div>
              )}

              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Update Status</h3>
              <div className="grid grid-cols-2 gap-3">
                {allowedTransitions.map((nextStatus) => {
                  const isCancel = nextStatus === "CANCELLED";
                  return (
                    <button
                      key={nextStatus}
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus(nextStatus)}
                      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 ${
                        isCancel
                          ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                          : "bg-primary hover:bg-primary/90 text-black border border-transparent"
                      }`}
                    >
                      {isUpdating && !isCancel && <Loader2 className="w-4 h-4 animate-spin" />}
                      Mark as {TIMELINE_STAGES.find((s) => s.id === nextStatus)?.label || "Cancelled"}
                    </button>
                  );
                })}
                {allowedTransitions.length === 0 && (
                  <div className="col-span-2 text-center text-sm text-gray-500 py-2">
                    No further status updates available.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
