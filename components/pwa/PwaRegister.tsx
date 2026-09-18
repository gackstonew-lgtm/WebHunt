"use client";

import React, { useEffect, useState } from "react";
import { Download, WifiOff, X, Check } from "lucide-react";

export default function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // 1. Check if running as installed standalone PWA
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes("android-app://");
      setIsStandalone(isStandaloneMode);
    };
    checkStandalone();

    // 2. Register Service Worker safely
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            console.log("[PWA] ServiceWorker registered with scope:", registration.scope);

            // Handle service worker updates
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
                    console.log("[PWA] New version available. Refresh to update.");
                  }
                };
              }
            };
          })
          .catch((error) => {
            console.warn("[PWA] ServiceWorker registration skipped/failed:", error);
          });
      });
    }

    // 3. Listen for PWA Install Prompt Event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);

      // Check if dismissed before
      const hasDismissed = localStorage.getItem("webhunt_pwa_dismissed");
      if (!hasDismissed) {
        setShowToast(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. Listen for App Installed Event
    const handleAppInstalled = () => {
      console.log("[PWA] WebHunt Delta installed successfully");
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowToast(false);
      setIsStandalone(true);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // 5. Network status monitoring
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User installation choice: ${outcome}`);
    if (outcome === "accepted") {
      setIsInstallable(false);
      setShowToast(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismissToast = () => {
    setShowToast(false);
    localStorage.setItem("webhunt_pwa_dismissed", "true");
  };

  return (
    <>
      {/* Offline Status Warning Bar */}
      {isOffline && (
        <div className="bg-surface-elevated border-b border-red-500/20 text-red-400 px-4 py-2 text-xs flex items-center justify-center space-x-2 fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top">
          <WifiOff className="w-3.5 h-3.5 text-red-400" />
          <span>You are currently offline. Live lead scanning requires an internet connection.</span>
        </div>
      )}

      {/* Subtle Install Floating Banner (Only when installable and not in standalone mode) */}
      {isInstallable && !isStandalone && showToast && (
        <div className="fixed bottom-5 right-5 z-40 max-w-sm w-[calc(100vw-40px)] sm:w-auto bg-surface dark:bg-surface border border-black/[0.08] dark:border-subtle/50 rounded-xl p-5 shadow-2xl shadow-black/80 flex items-center justify-between space-x-3.5 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-surface-elevated border border-black/[0.08] dark:border-subtle/50 flex items-center justify-center text-neutral-900 dark:text-foreground shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-neutral-900 dark:text-foreground">Install WebHunt Delta App</div>
              <div className="text-[11px] text-neutral-500 dark:text-muted-foreground">Fast standalone access on your device</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-semibold shadow-sm transition shrink-0"
            >
              Install
            </button>
            <button
              onClick={handleDismissToast}
              className="p-1.5 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-muted-foreground dark:hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition shrink-0"
              aria-label="Dismiss install prompt"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
