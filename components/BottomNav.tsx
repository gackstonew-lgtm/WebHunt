"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radar, KanbanSquare, History, CreditCard } from "lucide-react";
import { getStoredPipelineLeads } from "@/lib/pipeline-store";

export default function BottomNav() {
  const pathname = usePathname();
  const [leadCount, setLeadCount] = useState(0);

  const isAuthRoute = pathname ? pathname === "/auth" || pathname.startsWith("/auth/") : false;

  useEffect(() => {
    const updateCount = () => {
      const leads = getStoredPipelineLeads();
      setLeadCount(leads.length);
    };
    updateCount();

    window.addEventListener("storage", updateCount);
    const interval = setInterval(updateCount, 2000);
    return () => {
      window.removeEventListener("storage", updateCount);
      clearInterval(interval);
    };
  }, []);

  if (isAuthRoute) return null;

  const navItems = [
    { href: "/", label: "Radar", icon: Radar },
    { href: "/pipeline", label: "CRM", icon: KanbanSquare, badge: leadCount > 0 ? leadCount : undefined },
    { href: "/searches", label: "History", icon: History },
    { href: "/subscription", label: "Plans", icon: CreditCard },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-subtle/50 px-3 py-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-2xl transition-colors"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <div className={`p-1.5 rounded-xl transition-all ${
                  isActive ? "bg-white text-primary-foreground shadow-sm" : "bg-transparent text-muted-foreground"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-primary text-primary-foreground ring-2 ring-background">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${
                isActive ? "text-foreground font-bold" : "text-muted-foreground font-medium"
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
