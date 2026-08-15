"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, Check, ShoppingBag, XCircle, MessageSquare, AlertTriangle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "NEW_ORDER" | "ORDER_CANCELLED" | "NEW_ENQUIRY" | "LOW_STOCK";
  isRead: boolean;
  relatedOrderId: string | null;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(null);
  
  const router = useRouter();
  
  // Audio ref for notification sound
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for the notification sound
    // Using a simple base64 tiny beep sound
    const audio = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"+Array(100).join("A"));
    audioRef.current = audio;
  }, []);

  const fetchNotifications = async (isInitial = false) => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (!res.ok) return;
      const data = await res.json();
      
      const newNotifications = data.notifications || [];
      const unread = newNotifications.filter((n: Notification) => !n.isRead).length;
      
      setNotifications(newNotifications);
      setUnreadCount(unread);

      // Check if there's a new notification to play sound
      if (!isInitial && newNotifications.length > 0) {
        const latestId = newNotifications[0].id;
        if (latestId !== lastNotificationId && !newNotifications[0].isRead) {
           // It's a new unread notification, play sound
           audioRef.current?.play().catch(e => console.log("Audio play prevented:", e));
        }
        setLastNotificationId(latestId);
      } else if (isInitial && newNotifications.length > 0) {
        setLastNotificationId(newNotifications[0].id);
      }

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications(true);
    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000); // Poll every 15s
    
    return () => clearInterval(interval);
  }, [lastNotificationId]);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/admin/notifications/${id}/read`, { method: "POST" });
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/admin/notifications/mark-all-read", { method: "POST" });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "NEW_ORDER": return <ShoppingBag className="w-5 h-5 text-primary" />;
      case "ORDER_CANCELLED": return <XCircle className="w-5 h-5 text-red-500" />;
      case "NEW_ENQUIRY": return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case "LOW_STOCK": return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg border-2 border-black">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sliding Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-[#111] border-l border-white/10 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-md">
                {unreadCount} New
              </span>
            )}
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {unreadCount > 0 && (
          <div className="p-4 border-b border-white/10 flex justify-end">
            <button 
              onClick={markAllAsRead}
              className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
            >
              <Check className="w-4 h-4" /> Mark all as read
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n.id}
                onClick={() => {
                  if (!n.isRead) markAsRead(n.id);
                  if (n.type === "NEW_ORDER" || n.type === "ORDER_CANCELLED") {
                    setIsOpen(false);
                    router.push("/admin/orders");
                  }
                  if (n.type === "NEW_ENQUIRY") {
                    setIsOpen(false);
                    router.push("/admin/enquiries");
                  }
                }}
                className={`flex gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  n.isRead 
                    ? "bg-white/5 border-transparent hover:bg-white/10 text-gray-400" 
                    : "bg-[#1a1a1a] border-white/10 shadow-lg text-white"
                }`}
              >
                <div className="shrink-0 mt-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${n.isRead ? 'bg-black/30' : 'bg-black/50'}`}>
                    {getIcon(n.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className={`font-semibold truncate ${n.isRead ? 'text-gray-300' : 'text-white'}`}>
                      {n.title}
                    </h4>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-sm line-clamp-2 mb-2 leading-snug text-gray-400">
                    {n.message}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
