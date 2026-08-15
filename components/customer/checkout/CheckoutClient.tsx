"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useCart } from '@/context/CartContext';
import { KITCHEN_COORDINATES, isWithinDeliveryArea } from '@/lib/location';
import { MapPin, Navigation, CreditCard, Banknote, ShieldCheck } from 'lucide-react';
import { FoodImage } from '@/components/shared/food-image/FoodImage';

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Dynamically import the map to avoid SSR issues with Leaflet
const LocationMap = dynamic(() => import('./LocationMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted/20 animate-pulse rounded-xl flex items-center justify-center"><MapPin className="w-8 h-8 text-muted-foreground opacity-50" /></div>
});

export const CheckoutClient = ({ settings }: { settings?: any }) => {
  const router = useRouter();
  const { cart, subtotal, totalItems, clearCart } = useCart();
  
  const [mounted, setMounted] = useState(false);
  const kitchenLat = settings?.latitude || KITCHEN_COORDINATES.lat;
  const kitchenLng = settings?.longitude || KITCHEN_COORDINATES.lng;
  const [position, setPosition] = useState({ lat: kitchenLat, lng: kitchenLng });
  const [addressData, setAddressData] = useState<any>(null);
  const [isDeliverable, setIsDeliverable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    whatsapp: '',
    houseNo: '',
    landmark: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Redirect if cart is empty
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart, router]);

  useEffect(() => {
    // Custom radius check instead of hardcoded isWithinDeliveryArea
    const distanceKm = getDistanceFromLatLonInKm(position.lat, position.lng, kitchenLat, kitchenLng);
    const radius = settings?.deliveryRadius || 7;
    setIsDeliverable(distanceKm <= radius);
  }, [position, kitchenLat, kitchenLng, settings]);

  // Helper function (Haversine formula)
  function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
  }

  function deg2rad(deg: number) {
    return deg * (Math.PI/180);
  }

  if (!mounted || cart.length === 0) return null;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    try {
      const originalAmount = subtotal + (subtotal * 0.05) + (isDeliverable ? (settings?.deliveryCharge ?? 50) : 0);
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, originalAmount })
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedCoupon(data.coupon);
        setDiscountAmount(data.discountAmount);
      } else {
        alert(data.error || "Invalid coupon");
        setAppliedCoupon(null);
        setDiscountAmount(0);
      }
    } catch (error) {
      alert("Error applying coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          console.error("Geolocation error:", err.message || err);
          alert(`Could not automatically get your location: ${err.message || 'Permission denied or unavailable'}.\n\nYou can still drag the pin on the map manually to select your delivery location!`);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert("Geolocation is not supported by this browser. Please drag the pin on the map manually.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDeliverable) {
      alert("Selected location is outside our delivery area (Kalapatti, Sitra, Saravanampatty).");
      return;
    }
    
    if (formData.mobile.length < 10) {
      alert("Please enter a valid mobile number.");
      return;
    }

    setIsSubmitting(true);

    const formattedAddress = addressData 
      ? [addressData.road, addressData.suburb, addressData.city, addressData.postcode].filter(Boolean).join(', ')
      : `${position.lat}, ${position.lng}`;

    const orderDataPayload = {
      ...formData,
      formattedAddress,
      latitude: position.lat,
      longitude: position.lng,
      paymentMethod,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      cartItems: cart.map(item => ({
        foodId: item.id,
        quantity: item.quantity,
        foodName: item.name
      }))
    };

    if (paymentMethod === 'cod') {
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderDataPayload)
        });

        const data = await response.json();

        if (response.ok) {
          clearCart();
          router.push(`/order-success?orderId=${data.order.id}&orderNumber=${data.order.orderNumber}&trackingId=${data.order.trackingId}`);
        } else {
          alert(data.error || "Failed to place order. Please try again.");
          setIsSubmitting(false);
        }
      } catch (error) {
        console.error("Order submission error:", error);
        alert("An unexpected error occurred. Please try again.");
        setIsSubmitting(false);
      }
    } else {
      // Razorpay Flow
      try {
        // 1. Create Razorpay Order securely on the server
        const rzpResponse = await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderDataPayload)
        });

        const rzpData = await rzpResponse.json();

        if (!rzpResponse.ok) {
          alert(rzpData.error || "Failed to initialize payment.");
          setIsSubmitting(false);
          return;
        }

        // 2. Open Razorpay Checkout Modal
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummykey12345", // Use env variable or fallback
          amount: rzpData.amount,
          currency: rzpData.currency,
          name: settings?.restaurantName || "Om Murga Cloud Kitchen",
          description: "Food Delivery Order",
          order_id: rzpData.id,
          handler: async function (response: any) {
            try {
              // 3. Verify Payment and Create Order
              const verifyRes = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderData: orderDataPayload
                })
              });

              const verifyData = await verifyRes.json();

              if (verifyRes.ok) {
                clearCart();
                router.push(`/order-success?orderId=${verifyData.order.id}&orderNumber=${verifyData.order.orderNumber}&trackingId=${verifyData.order.trackingId}`);
              } else {
                alert(verifyData.error || "Payment verification failed. If money was deducted, it will be refunded.");
                setIsSubmitting(false);
              }
            } catch (err) {
              console.error("Verification error:", err);
              alert("Something went wrong during payment verification. Please contact support.");
              setIsSubmitting(false);
            }
          },
          prefill: {
            name: formData.fullName,
            contact: formData.mobile,
          },
          theme: {
            color: "#D4AF37" // Premium Gold
          },
          modal: {
            ondismiss: function() {
              alert("Payment was cancelled. You can try again.");
              setIsSubmitting(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any){
          alert("Payment failed! " + response.error.description);
          setIsSubmitting(false);
        });
        rzp.open();

      } catch (error) {
        console.error("Razorpay init error:", error);
        alert("Failed to connect to payment gateway. Please try again.");
        setIsSubmitting(false);
      }
    }
  };

  const deliveryCharge = isDeliverable ? (settings?.deliveryCharge ?? 50) : 0;
  const minOrder = settings?.minimumOrder ?? 0;
  const tax = subtotal * 0.05;
  const originalAmount = subtotal + tax + deliveryCharge;
  const grandTotal = Math.max(0, originalAmount - discountAmount);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <div className="mb-10 text-center md:text-left">
        <h1 className="font-serif text-4xl md:text-5xl text-primary font-bold mb-4 tracking-tight">
          Checkout
        </h1>
        <p className="text-muted-foreground">
          Complete your order to enjoy premium South Indian cuisine.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-10">
        
        {/* Left Column: Form & Map */}
        <div className="w-full lg:w-2/3 space-y-8">
          
          {/* Customer Details */}
          <div className="bg-card/40 border border-border/80 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="font-serif text-2xl font-bold mb-6 text-foreground border-b border-border/50 pb-4">
              1. Customer Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name *</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Enter your full name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Mobile Number *</label>
                <input required type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary" placeholder="10-digit mobile number" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email <span className="text-muted-foreground text-xs">(Optional)</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary" placeholder="For order updates" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">WhatsApp Number <span className="text-muted-foreground text-xs">(Optional)</span></label>
                <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary" placeholder="For delivery updates" />
              </div>
            </div>
          </div>

          {/* Delivery Location */}
          <div className="bg-card/40 border border-border/80 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex justify-between items-end border-b border-border/50 pb-4 mb-6">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                2. Delivery Location
              </h2>
              <button type="button" onClick={handleUseCurrentLocation} className="text-sm flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium bg-primary/10 px-3 py-1.5 rounded-full">
                <Navigation className="w-4 h-4" /> Use Current Location
              </button>
            </div>
            
            <div className="h-64 w-full rounded-xl overflow-hidden mb-6 border border-border/50">
              <LocationMap position={position} setPosition={setPosition} onAddressFetched={setAddressData} />
            </div>

            {!isDeliverable && (
              <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-lg mb-6 text-sm flex gap-3">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <p>Sorry, the selected location is outside our delivery area. We currently serve locations within {settings?.deliveryRadius || 7}km of our kitchen.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">House / Flat No *</label>
                <input required type="text" name="houseNo" value={formData.houseNo} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary" placeholder="E.g., Flat 201, Building Name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Landmark <span className="text-muted-foreground text-xs">(Optional)</span></label>
                <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary" placeholder="E.g., Near Apollo Pharmacy" />
              </div>
            </div>

            {addressData && (
              <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border/50 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Detected Area:</p>
                <p>{[addressData.road, addressData.suburb, addressData.city, addressData.postcode].filter(Boolean).join(', ')}</p>
              </div>
            )}
          </div>

          {/* Payment UI */}
          <div className="bg-card/40 border border-border/80 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="font-serif text-2xl font-bold mb-6 text-foreground border-b border-border/50 pb-4">
              3. Payment Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`cursor-pointer border rounded-xl p-4 flex items-center gap-4 transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/50'}`}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-primary' : 'border-muted-foreground'}`}>
                  {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-foreground flex items-center gap-2"><Banknote className="w-4 h-4 text-green-500" /> Cash on Delivery</span>
                  <span className="text-xs text-muted-foreground">Pay at your doorstep</span>
                </div>
              </label>

              <label className={`cursor-pointer border rounded-xl p-4 flex items-center gap-4 transition-all ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/50'}`}>
                <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="hidden" />
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'online' ? 'border-primary' : 'border-muted-foreground'}`}>
                  {paymentMethod === 'online' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-foreground flex items-center gap-2"><CreditCard className="w-4 h-4 text-primary" /> Pay Online</span>
                  <span className="text-xs text-muted-foreground">UPI, Cards, Netbanking</span>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-card/60 border border-border/80 rounded-2xl p-6 sticky top-28 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.3)] backdrop-blur-md">
            <h3 className="font-serif text-2xl font-bold mb-6 text-foreground border-b border-border/50 pb-4">
              Order Summary
            </h3>
            
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted/20 flex-shrink-0 relative">
                    <FoodImage src={item.image || "/images/placeholder.webp"} alt={item.name} fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="flex flex-col flex-grow justify-center">
                    <span className="text-sm font-bold text-foreground line-clamp-1">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.quantity} x ₹{item.price}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-sm">₹{(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 text-sm border-t border-border/50 pt-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({totalItems} items)</span>
                <span className="text-foreground font-semibold">₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee (within {settings?.deliveryRadius || 7}km)</span>
                <span className="text-foreground font-semibold">₹{deliveryCharge.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Taxes (5% GST)</span>
                <span className="text-foreground font-semibold">₹{tax.toFixed(0)}</span>
              </div>
            </div>

            {/* Coupon Box */}
            <div className="border-t border-border/50 pt-4 mb-4">
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon Code"
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary uppercase font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode}
                    className="bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/30 transition-colors disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'APPLY'}
                  </button>
                </div>
              ) : (
                <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-green-400">Coupon Applied: {appliedCoupon.code}</p>
                    <p className="text-xs text-green-500/80">SAVE ₹{discountAmount.toFixed(2)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setAppliedCoupon(null); setDiscountAmount(0); setCouponCode(''); }}
                    className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-1"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-border/50 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-lg text-foreground">Grand Total</span>
                <span className="font-bold text-3xl text-primary">₹{grandTotal.toFixed(0)}</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={!isDeliverable || isSubmitting || subtotal < minOrder}
              className={`btn w-full py-4 text-center block font-bold text-base transition-all ${
                isDeliverable && !isSubmitting && subtotal >= minOrder
                  ? 'btn-primary shadow-[0_0_20px_rgba(212,175,55,0.3)]' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed border border-border'
              }`}
            >
              {isSubmitting ? 'Processing...' : (!isDeliverable ? 'Cannot Deliver to Location' : (subtotal < minOrder ? `Minimum Order: ₹${minOrder}` : 'Place Order'))}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
