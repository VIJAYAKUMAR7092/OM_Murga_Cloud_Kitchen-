"use client";

import { useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { TopHeader } from "@/components/admin/TopHeader";

import { Toaster } from "react-hot-toast";

export default function AdminProtectedLayoutClient({
  children,
  logo,
  restaurantName,
}: {
  children: React.ReactNode;
  logo: string;
  restaurantName: string;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} logo={logo} restaurantName={restaurantName} />
      
      <div className="md:pl-64 flex flex-col min-h-screen">
        <TopHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
