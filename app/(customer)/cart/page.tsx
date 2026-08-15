import React from 'react';
import { CartClient } from '@/components/customer/cart/CartClient';

export const metadata = {
  title: "Your Cart | OM MURGA CLOUD KITCHEN",
  description: "Review your authentic South Indian food order.",
};

export default function CartPage() {
  return (
    <div className="min-h-screen pt-32 lg:pt-40 bg-background overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <CartClient />
    </div>
  );
}
