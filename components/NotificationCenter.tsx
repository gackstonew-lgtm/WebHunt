"use client";

import React, { useState, useEffect } from "react";
import { Bell, Briefcase, Check, Sparkles } from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  opportunityId?: string;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount);
        }
      }
    } catch (e) {}
  };

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    await fetch(`/api/notifications/${id}/read`, { method: "POST" });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-[#989BA3] hover:text-[#EEEEEE] hover:bg-[#18191D] rounded-xl transition relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#111214]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-[#111214] border border-white/[0.08] rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-white/[0.08] bg-[#0D0E11] flex items-center justify-between">
            <h3 className="font-bold text-[#EEEEEE] text-sm flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Opportunities</span>
            </h3>
            {unreadCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                {unreadCount} new
              </span>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-[#989BA3] text-xs">
                No new opportunities yet. We'll notify you when matching jobs are found.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-4 border-b border-white/[0.04] hover:bg-[#18191D] transition cursor-pointer flex gap-3 ${
                    notif.read ? "opacity-70" : "bg-[#18191D]/50"
                  }`}
                >
                  <div className={`mt-0.5 shrink-0 ${notif.read ? "text-[#989BA3]" : "text-emerald-400"}`}>
                    {notif.type === "NEW_OPPORTUNITY" ? <Briefcase className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className={`text-xs font-semibold ${notif.read ? "text-[#989BA3]" : "text-[#EEEEEE]"}`}>
                        {notif.title}
                      </div>
                      <div className="text-[9px] text-[#989BA3] whitespace-nowrap">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-xs text-[#989BA3] mt-1 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
