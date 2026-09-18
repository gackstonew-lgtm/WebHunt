"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Radar, 
  KanbanSquare, 
  History, 
  Download, 
  User, 
  LogIn,
  Sparkles,
  CreditCard,
  Crown
} from "lucide-react";
import ProfileSettingsModal from "./profile/ProfileSettingsModal";
import KoraCheckoutModal from "./payments/KoraCheckoutModal";
import { getStoredPipelineLeads, clearAllClientStorage } from "@/lib/pipeline-store";
import { exportLeadsToCsv } from "@/lib/export";
import { syncLocalStorageWithDatabase } from "@/lib/sync-bridge";
import { getAuthStatusAction, logoutAction } from "@/app/actions/auth";
import { getUserSubscriptionAction } from "@/app/actions/payments";
import { NotificationCenter } from "./NotificationCenter";

export default function Navbar() {
  const pathname = usePathname();
  const [showProfile, setShowProfile] = useState(false);
  const [showKoraCheckout, setShowKoraCheckout] = useState(false);
  const [leadCount, setLeadCount] = useState(0);
  const [userSession, setUserSession] = useState<{ id: string; email: string; name?: string | null } | null>(null);
  const [hasActiveSub, setHasActiveSub] = useState(false);

  const isAuthRoute = pathname ? pathname === "/auth" || pathname.startsWith("/auth/") : false;

  useEffect(() => {
    const stored = getStoredPipelineLeads();
    setLeadCount(stored.length);

    // Fetch auth and subscription status
    getUserSubscriptionAction().then((res) => {
      if (res.isAuthenticated && res.user) {
        setUserSession(res.user);
        setHasActiveSub(!!res.subscriptionStatus.subscription);
      } else {
        setUserSession(null);
        setHasActiveSub(false);
      }
    }).catch(() => {});

    // Trigger seamless background sync with the database on load
    syncLocalStorageWithDatabase().catch((e) => console.warn("Background sync info:", e));

    const handleStorage = () => {
      const updated = getStoredPipelineLeads();
      setLeadCount(updated.length);
    };

    window.addEventListener("storage", handleStorage);
    const interval = setInterval(handleStorage, 2000);
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [pathname]);

  const handleLogout = async () => {
    clearAllClientStorage();
    await logoutAction();
    setUserSession(null);
    window.location.href = "/auth?mode=signin";
  };

  const handleExportAll = () => {
    const leads = getStoredPipelineLeads();
    if (leads.length === 0) {
      alert("No leads currently in pipeline to export. Discover and save leads first!");
      return;
    }
    exportLeadsToCsv(leads, "webhunt-leads-full-pipeline");
  };

  const navLinks = [
    { href: "/", label: "Radar", icon: Radar },
    { href: "/pipeline", label: "CRM", icon: KanbanSquare, badge: leadCount > 0 ? leadCount : undefined },
    { href: "/searches", label: "History", icon: History },
    { href: "/subscription", label: "Pricing", icon: CreditCard },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-subtle/50 bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-surface border border-subtle/50 flex items-center justify-center text-foreground group-hover:border-strong group-hover:bg-surface-elevated transition-colors duration-150">
                  <Radar className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-foreground" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-base sm:text-lg text-foreground tracking-tight">WebHunt</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-surface-elevated/60 text-muted-foreground border border-subtle/50">
                      Delta
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground hidden sm:block">Physical &amp; Online Lead Discovery</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            {!isAuthRoute && (
              <nav className="hidden md:flex items-center space-x-1 bg-surface/60 p-1 rounded-xl border border-subtle/50">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={"flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all " + (
                        isActive
                          ? "bg-surface-elevated text-foreground border border-strong/60 shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-primary-hover/[0.04] border border-transparent"
                      )}
                    >
                      <Icon className={"w-3.5 h-3.5 " + (isActive ? "text-foreground" : "text-muted-foreground")} />
                      <span>{link.label}</span>
                      {link.badge !== undefined && (
                        <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* Right Action buttons */}
            {!isAuthRoute && (
              <div className="flex items-center space-x-2">
                <NotificationCenter />
                {/* Profile & Settings Trigger */}
                <button
                  onClick={() => setShowProfile(true)}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 sm:px-3 text-xs font-semibold rounded-xl bg-surface text-foreground hover:bg-surface-elevated border border-subtle/50 hover:border-strong/60 transition shadow-sm"
                  title="Manage Profile, Appearance & Settings"
                >
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="hidden xs:inline">Profile</span>
                </button>

                {/* Subscription / Upgrade Trigger */}
                {hasActiveSub ? (
                  <Link
                    href="/subscription"
                    className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1.5 sm:px-3 text-xs font-bold rounded-xl bg-emerald-500/10 text-success border border-emerald-500/25 shadow-sm transition hover:bg-emerald-500/20"
                    title="Active Subscription Managed"
                  >
                    <Crown className="w-3.5 h-3.5 text-success" />
                    <span>Active</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => setShowKoraCheckout(true)}
                    className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1.5 sm:px-3 text-xs font-semibold rounded-xl bg-surface-elevated text-foreground hover:bg-surface-elevated/80 border border-subtle/50 hover:border-strong/60 shadow-sm transition"
                    title="Upgrade Subscription (Monthly $50 / Annual $200)"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Upgrade</span>
                  </button>
                )}

                {!userSession && (
                  <Link
                    href="/auth?mode=signin"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground shadow-sm transition"
                    title="Sign In to WebHunt"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                )}

                <button
                  onClick={handleExportAll}
                  className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-elevated border border-subtle/50 hover:border-strong/60 transition"
                  title="Download in-session leads as CSV"
                >
                  <Download className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Export CSV</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </header>

      {showProfile && <ProfileSettingsModal onClose={() => setShowProfile(false)} />}
      {showKoraCheckout && (
        <KoraCheckoutModal
          onClose={() => setShowKoraCheckout(false)}
          userEmail={userSession?.email || ""}
          userName={userSession?.name || ""}
          onSuccess={() => {
            setShowKoraCheckout(false);
            setHasActiveSub(true);
          }}
        />
      )}
    </>
  );
}
