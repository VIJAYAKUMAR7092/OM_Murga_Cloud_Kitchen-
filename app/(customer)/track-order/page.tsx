import React, { Suspense } from 'react';
import { TrackOrderClient } from './TrackOrderClient';

export const metadata = {
  title: "Track Order | OM MURGA CLOUD KITCHEN",
  description: "Track your food delivery live.",
};

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 flex items-center justify-center">Loading...</div>}>
      <TrackOrderClient />
    </Suspense>
  );
}
