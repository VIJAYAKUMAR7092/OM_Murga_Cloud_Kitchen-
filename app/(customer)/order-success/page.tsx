import React from 'react';
import { OrderSuccessClient } from './OrderSuccessClient';

export const metadata = {
  title: "Order Success | OM MURGA CLOUD KITCHEN",
  description: "Your order has been placed successfully.",
};

export default async function OrderSuccessPage(props: { searchParams: Promise<{ orderId?: string, orderNumber?: string, trackingId?: string }> }) {
  const searchParams = await props.searchParams;
  const orderNumber = searchParams.orderNumber || "Processing...";
  const trackingId = searchParams.trackingId;

  return (
    <div className="min-h-screen pt-32 lg:pt-40 bg-background flex flex-col items-center justify-center p-4">
      <OrderSuccessClient orderNumber={orderNumber} trackingId={trackingId} />
    </div>
  );
}
