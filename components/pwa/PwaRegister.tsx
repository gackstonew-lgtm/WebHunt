"use client";

import React, { useEffect, useState } from "react";
import { Download, WifiOff, X, Radar, Share } from "lucide-react";
import { usePwaInstall } from "@/lib/usePwaInstall";

export default function PwaRegister() {
  const { isInstalled, canInstall, platform, isInstalling, installApp } = usePwaInstall();
  const [isOffline, setIsOffline] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // 1. Service Worker Registration
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((reg) => console.log("[PWA] SW registered:", reg.scope))
          .catch((err) => console.warn("[PWA] SW error:", err));
      });
    }

    // 2. Offline Detection
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Check if banner dismissed in session
      if (sessionStorage.getItem("webhunt_pwa_dismissed_session")) {
        setIsDismissed(true);
      }

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("webhunt_pwa_dismissed_session", "true");
    }
  };

  const shouldShowBanner = !isDismissed && !isInstalled && (canInstall || platform === "ios");

  return (
    <>
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-surface-elevated border-b border-red-500/20 text-red-400 px-4 py-2 text-xs flex items-center justify-center space-x-2 fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top">
          <WifiOff className="w-3.5 h-3.5 text-red-400" />
          <span>You are currently offline. Live lead scanning requires an internet connection.</span>
        </div>
      )}

      {/* PWA Install Popup Card modeled after reference design */}
      {shouldShowBanner && (
        <div
          role="dialog"
          aria-labelledby="pwa-install-title"
          aria-describedby="pwa-install-desc"
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-auto sm:w-[380px] z-50 bg-card border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-floating backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center text-foreground shrink-0 shadow-sm">
                <Radar className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex flex-col min-w-0">
                <h3 id="pwa-install-title" className="text-sm font-bold text-card-foreground tracking-tight">
                  Install WebHunt
                </h3>
                <p id="pwa-install-desc" className="text-xs text-muted-foreground leading-snug mt-0.5 truncate sm:whitespace-normal">
                  Get quick access from your device.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              className="p-1 rounded-lg text-muted-foreground hover:text-card-foreground hover:bg-surface-elevated transition shrink-0"
              aria-label="Dismiss installation prompt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-end space-x-2 mt-3 pt-1">
            <button
              type="button"
              onClick={handleDismiss}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-card-foreground hover:bg-surface-elevated/50 transition"
            >
              Later
            </button>
            {canInstall ? (
              <button
                type="button"
                onClick={installApp}
                disabled={isInstalling}
                aria-label="Install WebHunt as App"
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-brand-btn transition-all duration-200 flex items-center space-x-1.5 disabled:opacity-50 active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isInstalling ? "Installing..." : "Install"}</span>
              </button>
            ) : platform === "ios" ? (
              <div className="px-3 py-1.5 rounded-xl bg-surface-elevated border border-border text-[11px] font-medium text-muted-foreground flex items-center space-x-1.5">
                <Share className="w-3 h-3 text-primary" />
                <span>Share → 'Add to Home Screen'</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={installApp}
                disabled={isInstalling}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-brand-btn transition-all duration-200 flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
