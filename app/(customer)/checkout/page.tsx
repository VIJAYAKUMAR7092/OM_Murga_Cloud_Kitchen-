import React from 'react';
import Script from 'next/script';
import { CheckoutClient } from '@/components/customer/checkout/CheckoutClient';
import { getRestaurantSettings } from '@/server/queries/settings';

export const metadata = {
  title: "Checkout | OM MURGA CLOUD KITCHEN",
  description: "Complete your order and arrange delivery.",
};

export default async function CheckoutPage() {
  const settings = await getRestaurantSettings();

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="min-h-screen pt-32 lg:pt-40 bg-background overflow-hidden relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <CheckoutClient settings={settings} />
      </div>
    </>
  );
}
