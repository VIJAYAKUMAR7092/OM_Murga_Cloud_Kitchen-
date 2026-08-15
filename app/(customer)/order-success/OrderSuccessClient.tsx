"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ShoppingBag, ArrowRight, Copy, Check } from 'lucide-react';

export function OrderSuccessClient({ orderNumber, trackingId }: { orderNumber: string, trackingId?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (trackingId) {
      const stored = localStorage.getItem('ommuruga_guest_orders');
      let orders: string[] = [];
      if (stored) {
        try {
          orders = JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
      
      // Remove duplicates, keep latest 10
      orders = [trackingId, ...orders.filter(id => id !== trackingId)].slice(0, 10);
      localStorage.setItem('ommuruga_guest_orders', JSON.stringify(orders));
    }
  }, [trackingId]);

  const copyToClipboard = () => {
    if (trackingId) {
      navigator.clipboard.writeText(trackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 text-center shadow-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>
      
      <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </div>
      
      <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
      <p className="text-muted-foreground mb-6">
        Thank you for choosing Om Murga. Your authentic South Indian meal is being prepared with care.
      </p>

      <div className="bg-muted/30 border border-border rounded-lg p-4 mb-4">
        <p className="text-sm text-muted-foreground mb-1">Order Number</p>
        <p className="text-xl font-mono font-bold text-primary">{orderNumber}</p>
      </div>

      {trackingId && (
        <div className="bg-muted/30 border border-border rounded-lg p-4 mb-8">
          <p className="text-sm text-muted-foreground mb-1">Tracking ID</p>
          <div className="flex items-center justify-between bg-background border border-border rounded-md px-3 py-2 mt-2">
            <span className="text-lg font-mono font-bold text-foreground">{trackingId}</span>
            <button 
              onClick={copyToClipboard}
              className="text-muted-foreground hover:text-primary transition-colors p-1"
              title="Copy Tracking ID"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Link href={`/track-order${trackingId ? `?trackingId=${trackingId}` : ''}`} className="btn btn-primary w-full flex items-center justify-center gap-2 py-3 font-bold">
          Track Order <ArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/menu" className="btn w-full bg-transparent border-border hover:bg-muted text-foreground flex items-center justify-center gap-2 py-3 border">
          <ShoppingBag className="w-4 h-4" /> Order More
        </Link>
      </div>
    </div>
  );
}
