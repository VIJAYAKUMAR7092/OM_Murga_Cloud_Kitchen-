"use client";

import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="text-center p-8 max-w-md bg-[#111] border border-white/10 rounded-3xl shadow-2xl">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4 font-serif">You are offline</h1>
        <p className="text-gray-400 mb-8">
          It looks like you've lost your internet connection. Please check your network and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary hover:bg-primary/90 text-black font-bold py-3 px-8 rounded-full transition-all hover:scale-105 active:scale-95"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
