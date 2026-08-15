"use client";

import { Menu, UserCircle } from "lucide-react";
import { NotificationBell } from "@/components/admin/notifications/NotificationBell";

export function TopHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-[#111]/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 border-b border-white/10 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-400 hover:text-white p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="hidden md:flex text-sm font-medium text-gray-400">
          Admin Dashboard
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <NotificationBell />
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <UserCircle className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-white hidden sm:block">Admin</span>
        </div>
      </div>
    </header>
  );
}
