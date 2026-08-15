"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut,
  X,
  MessageSquare,
  BarChart3,
  Star,
  Ticket
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const MENU_ITEMS = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Food Menu", href: "/admin/foods", icon: UtensilsCrossed },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Coupons", href: "/admin/coupons", icon: Ticket },
  { name: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar({ 
  isOpen, 
  onClose,
  logo,
  restaurantName
}: { 
  isOpen: boolean; 
  onClose: () => void;
  logo?: string;
  restaurantName?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [unreadOrders, setUnreadOrders] = useState(0);

  // Poll for unread orders
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/admin/orders/unread");
        if (res.ok) {
          const data = await res.json();
          setUnreadOrders(data.count || 0);
        }
      } catch (e) {
        console.error("Failed to fetch unread orders");
      }
    };
    
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // 30s polling
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error(e);
      setIsLoggingOut(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#111] border-r border-white/10 text-white w-64">
      <div className="p-6 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          {logo && <img src={logo} alt="Logo" className="w-8 h-8 object-contain rounded-md" />}
          <span className="text-lg font-bold tracking-wider text-primary line-clamp-1">
            {restaurantName ? restaurantName.toUpperCase() : "OM MURGA"}
          </span>
        </Link>
        <button className="md:hidden text-gray-400 hover:text-white" onClick={onClose}>
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return ("disabled" in item && item.disabled) ? (
            <div
              key={item.name}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 cursor-not-allowed opacity-60"
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </div>
          ) : (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                if (window.innerWidth < 768) onClose();
              }}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 font-medium group relative overflow-hidden",
                isActive 
                  ? "text-black bg-primary shadow-[0_0_15px_rgba(212,175,55,0.3)]" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("w-5 h-5", isActive ? "text-black" : "group-hover:text-primary transition-colors")} />
                <span>{item.name}</span>
              </div>
              
              {item.name === "Orders" && unreadOrders > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {unreadOrders > 99 ? '99+' : unreadOrders}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-all font-medium disabled:opacity-50"
        >
          <LogOut className="w-5 h-5" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed inset-y-0 left-0 w-64 z-50">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          "md:hidden fixed inset-y-0 left-0 w-64 z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
}
