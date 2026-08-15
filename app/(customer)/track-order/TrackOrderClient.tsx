"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, MapPin, Clock, Phone, ShoppingBag, Package, CheckCircle, XCircle, ChevronRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { CustomerReviewForm } from '@/components/customer/CustomerReviewForm';
import { OrderCancelEtaWidget } from '@/components/customer/tracking/OrderCancelEtaWidget';

const STATUS_STEPS = [
  { id: 'PENDING', label: 'Order Placed', desc: 'We have received your order' },
  { id: 'ACCEPTED', label: 'Accepted', desc: 'Order is confirmed' },
  { id: 'PREPARING', label: 'Preparing', desc: 'Food is being prepared' },
  { id: 'OUT_FOR_DELIVERY', label: 'Out For Delivery', desc: 'Rider is on the way' },
  { id: 'DELIVERED', label: 'Delivered', desc: 'Enjoy your meal!' }
];

export function TrackOrderClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTrackingId = searchParams.get('trackingId');
  
  const [trackingInput, setTrackingInput] = useState(initialTrackingId || '');
  const [phoneInput, setPhoneInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[] | null>(null);
  const [error, setError] = useState('');
  
  const [recentOrders, setRecentOrders] = useState<string[]>([]);

  useEffect(() => {
    // Load recent from local storage
    try {
      const stored = localStorage.getItem('ommuruga_guest_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentOrders(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Polling
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (orders && orders.length > 0 && trackingInput && phoneInput) {
      interval = setInterval(() => {
        handleSearch(trackingInput, phoneInput, true);
      }, 20000); // 20 seconds
    }
    return () => clearInterval(interval);
  }, [orders, trackingInput, phoneInput]);

  const handleSearch = async (tId: string, pNumber: string, isSilent = false) => {
    if (!tId || !pNumber) {
      setError('Both Tracking ID and Phone Number are required.');
      return;
    }
    setTrackingInput(tId);
    setPhoneInput(pNumber);
    
    if (!isSilent) setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/track?trackingId=${tId}&phone=${pNumber}`);
      const data = await res.json();

      if (res.ok && data.orders && data.orders.length > 0) {
        setOrders(data.orders);
        if (!isSilent) {
           router.replace(`/track-order?trackingId=${data.orders[0].trackingId}`, { scroll: false });
        }
      } else {
        setError(data.error || 'Order not found. Please check your Tracking ID and Phone Number.');
        setOrders(null);
      }
    } catch (err) {
      setError('Failed to fetch tracking details. Please try again.');
      setOrders(null);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  const getStatusIndex = (status: string) => {
    if (status === 'CANCELLED') return -1;
    return STATUS_STEPS.findIndex(s => s.id === status);
  };

  return (
    <div className="min-h-screen pt-32 lg:pt-40 bg-background pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl text-primary font-bold mb-4">Track Order</h1>
          <p className="text-muted-foreground">Enter your Tracking ID and Phone Number to view live status</p>
        </div>

        {/* Search Box */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-md mb-8">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(trackingInput, phoneInput); }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Tracking ID (e.g., OMM-20260815-XXXXXX)"
                className="w-full bg-background border border-border rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-primary text-foreground uppercase"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                required
              />
            </div>
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Phone Number (e.g., 9876543210)"
                className="w-full bg-background border border-border rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-primary text-foreground"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !trackingInput.trim() || !phoneInput.trim()}
              className="btn btn-primary py-3 px-8 rounded-lg font-bold flex items-center justify-center min-w-[120px]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Track'}
            </button>
          </form>

          {/* Recent Orders tags */}
          {recentOrders.length > 0 && !orders && !loading && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">My Recent Orders (Requires Phone Number)</p>
              <div className="flex flex-wrap gap-2">
                {recentOrders.map((id) => (
                  <button
                    key={id}
                    onClick={() => {
                      setTrackingInput(id);
                      // Don't auto search unless phone is filled
                      if (phoneInput.length === 10) {
                        handleSearch(id, phoneInput);
                      }
                    }}
                    className="text-xs bg-muted hover:bg-primary/20 text-foreground px-3 py-1.5 rounded-full border border-border transition-colors flex items-center gap-1"
                  >
                    <Package className="w-3 h-3" /> {id}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-4 text-center mb-8">
            {error}
          </div>
        )}

        {/* Skeleton Loading */}
        {loading && !orders && (
          <div className="space-y-6 animate-pulse">
            <div className="h-64 bg-card rounded-2xl border border-border"></div>
            <div className="h-64 bg-card rounded-2xl border border-border"></div>
          </div>
        )}

        {/* Order Details */}
        {!loading && orders && orders.length > 0 && (
          <div className="space-y-8">
            {orders.map((order, idx) => {
              const currentIdx = getStatusIndex(order.orderStatus);
              const isCancelled = order.orderStatus === 'CANCELLED';

              return (
                <div key={order.trackingId} className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
                  {/* Header */}
                  <div className="bg-muted/30 border-b border-border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Order {order.orderNumber}</h2>
                      <p className="text-sm font-mono text-muted-foreground mt-1">ID: {order.trackingId}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-sm text-muted-foreground">Order Date</p>
                      <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Live Status Timeline */}
                    <div className="mb-12">
                      <h3 className="font-bold text-lg mb-6">Live Status</h3>
                      <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute top-6 left-6 right-6 h-0.5 bg-border hidden sm:block">
                           <div 
                              className={`h-full transition-all duration-500 ${isCancelled ? 'bg-red-500' : 'bg-primary'}`} 
                              style={{ width: isCancelled ? '100%' : `${(currentIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
                           />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-6 sm:gap-0">
                          {isCancelled ? (
                            <div className="flex flex-col items-center flex-1 text-center">
                              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-lg border-4 border-card mb-3">
                                <XCircle className="w-6 h-6 text-white" />
                              </div>
                              <span className="font-bold text-red-500">Order Cancelled</span>
                              <span className="text-xs text-muted-foreground mt-1">Please contact support</span>
                            </div>
                          ) : (
                            STATUS_STEPS.map((step, index) => {
                              const isCompleted = index <= currentIdx;
                              const isCurrent = index === currentIdx;
                              const isDelivered = order.orderStatus === 'DELIVERED';
                              
                              return (
                                <div key={step.id} className="flex sm:flex-col items-center flex-1 sm:text-center gap-4 sm:gap-0">
                                  {/* Mobile Line */}
                                  <div className="sm:hidden w-0.5 h-full absolute left-6 top-10 -bottom-10 bg-border -z-10">
                                     {isCompleted && <div className={`w-full h-full ${isDelivered ? 'bg-green-500' : 'bg-primary'}`} />}
                                  </div>

                                  <div className={`
                                    w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-card mb-0 sm:mb-3 transition-colors duration-300
                                    ${isCompleted 
                                        ? (isDelivered && step.id === 'DELIVERED' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-primary text-primary-foreground shadow-lg shadow-primary/20') 
                                        : 'bg-muted text-muted-foreground'}
                                    ${isCurrent && !isDelivered ? 'ring-4 ring-primary/20 animate-pulse' : ''}
                                  `}>
                                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-5 h-5" />}
                                  </div>
                                  <div>
                                    <span className={`block font-bold text-sm sm:text-base ${isCompleted ? (isDelivered && step.id === 'DELIVERED' ? 'text-green-500' : 'text-foreground') : 'text-muted-foreground'}`}>
                                      {step.label}
                                    </span>
                                    <span className="hidden sm:block text-xs text-muted-foreground mt-1">{step.desc}</span>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Cancel & ETA Widget */}
                    <OrderCancelEtaWidget 
                      order={order} 
                      onCancelSuccess={() => handleSearch(trackingInput, phoneInput, true)} 
                    />

                    {/* Split Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-border pt-8 mt-8">
                      {/* Left side: Items & Total */}
                      <div>
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                          <ShoppingBag className="w-5 h-5 text-primary" /> Order Items
                        </h3>
                        <div className="space-y-3 mb-6">
                          {order.items.map((item: any, i: number) => (
                            <div key={i} className="flex justify-between text-sm border-b border-border/50 pb-3 last:border-0 last:pb-0">
                              <span className="text-foreground">
                                <span className="text-muted-foreground mr-2">{item.quantity}x</span>
                                {item.foodName}
                              </span>
                              <span className="font-medium">₹{item.subtotal}</span>
                            </div>
                          ))}
                        </div>

                        <div className="bg-muted/20 rounded-xl p-4 space-y-2 text-sm">
                          <div className="flex justify-between text-xs pt-1">
                            <span className="text-muted-foreground">Payment Method</span>
                            <span className="font-bold">{order.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Payment Status</span>
                            <span className={`font-bold ${order.paymentStatus === 'COMPLETED' ? 'text-green-500' : 'text-orange-500'}`}>
                              {order.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right side: Delivery Info */}
                      <div>
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-primary" /> Delivery Details
                        </h3>
                        
                        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Customer Name</p>
                            <p className="font-medium">{order.customerName}</p>
                          </div>
                          
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Contact</p>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3 h-3 text-muted-foreground" />
                              {order.phone}
                            </div>
                          </div>

                          {order.restaurantContact && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Restaurant Contact</p>
                              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                                <Phone className="w-3 h-3" />
                                {order.restaurantContact}
                              </div>
                            </div>
                          )}

                          {order.estimatedDelivery && (
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mt-4 flex items-start gap-3">
                              <Clock className="w-5 h-5 text-primary shrink-0" />
                              <div>
                                <p className="text-xs text-primary font-medium">Estimated Delivery</p>
                                <p className="text-sm font-bold">{new Date(order.estimatedDelivery).toLocaleString()}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {order.orderStatus === 'DELIVERED' && (
                      <CustomerReviewForm
                        trackingId={order.trackingId}
                        phone={order.phone}
                        customerName={order.customerName}
                        hasReviewed={order.hasReviewed}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
