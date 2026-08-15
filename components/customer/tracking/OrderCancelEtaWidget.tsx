"use client";

import { useState, useEffect } from 'react';
import { Clock, AlertTriangle, Loader2 } from 'lucide-react';

interface OrderCancelEtaWidgetProps {
  order: any;
  onCancelSuccess: () => void;
}

export function OrderCancelEtaWidget({ order, onCancelSuccess }: OrderCancelEtaWidgetProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (order.orderStatus !== 'PENDING') {
      setTimeLeft(null);
      return;
    }

    const orderTime = new Date(order.createdAt).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = now - orderTime;
      const remaining = 120000 - diff; // 2 mins
      
      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        setTimeLeft(0);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [order.createdAt, order.orderStatus]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingId: order.trackingId, phone: order.phone })
      });
      const data = await res.json();
      if (data.success) {
        setShowConfirm(false);
        onCancelSuccess();
      } else {
        alert(data.error || 'Failed to cancel order');
      }
    } catch (err) {
      alert('Network error while cancelling');
    } finally {
      setCancelling(false);
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isCancelled = order.orderStatus === 'CANCELLED';
  const isDelivered = order.orderStatus === 'DELIVERED';

  const [etaLeft, setEtaLeft] = useState<number | null>(null);

  useEffect(() => {
    if (order.estimatedDeliveryTime && !isCancelled && !isDelivered) {
      const updateTime = new Date(order.updatedAt).getTime();
      const targetTime = updateTime + (order.estimatedDeliveryTime * 60 * 1000);
      
      const calc = () => {
        const now = new Date().getTime();
        const diff = targetTime - now;
        if (diff > 0) {
          setEtaLeft(Math.ceil(diff / 60000));
        } else {
          setEtaLeft(0);
        }
      };
      
      calc();
      const interval = setInterval(calc, 30000); // 30s
      return () => clearInterval(interval);
    }
  }, [order.updatedAt, order.estimatedDeliveryTime, isCancelled, isDelivered]);

  // ETA Logic
  let etaWidget = null;
  if (!isCancelled && !isDelivered && order.estimatedDeliveryTime) {
    etaWidget = (
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
             <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-primary mb-1">Estimated Delivery</p>
            <p className="text-lg font-bold text-foreground">
              {etaLeft !== null ? (etaLeft > 0 ? `${etaLeft} Minutes` : 'Arriving Soon') : `${order.estimatedDeliveryTime} Minutes`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Cancel Widget
  let cancelWidget = null;
  if (order.orderStatus === 'PENDING') {
    if (timeLeft !== null && timeLeft > 0) {
      cancelWidget = (
        <div className="bg-card border border-border rounded-xl p-4 mt-6">
          {!showConfirm ? (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                 <p className="text-sm font-bold text-foreground">Cancellation Window</p>
                 <p className="text-xs text-muted-foreground mt-1">You can cancel this order within <span className="font-mono font-bold text-primary">{formatTime(timeLeft)}</span></p>
              </div>
              <button onClick={() => setShowConfirm(true)} className="btn btn-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 text-sm rounded-lg whitespace-nowrap transition-colors">
                Cancel Order
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-red-500">
                 <AlertTriangle className="w-5 h-5" />
                 <p className="text-sm font-bold">Are you sure you want to cancel?</p>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => setShowConfirm(false)} className="btn bg-muted text-foreground px-4 py-2 text-sm rounded-lg" disabled={cancelling}>No</button>
                 <button onClick={handleCancel} className="btn bg-red-500 text-white hover:bg-red-600 px-4 py-2 text-sm rounded-lg flex items-center gap-2" disabled={cancelling}>
                   {cancelling && <Loader2 className="w-4 h-4 animate-spin" />} Yes, Cancel
                 </button>
              </div>
            </div>
          )}
        </div>
      );
    } else if (timeLeft === 0) {
      cancelWidget = (
        <div className="bg-muted/50 border border-border rounded-xl p-4 mt-6 flex justify-between items-center">
           <p className="text-sm font-medium text-muted-foreground">Cancellation Window Expired</p>
        </div>
      );
    }
  }

  return (
    <>
      {etaWidget}
      {cancelWidget}
    </>
  );
}
