"use client";

import React, { useEffect, useState } from "react";
import { Download, WifiOff, X, Radar, Share } from "lucide-react";

export default function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isIosPrompt, setIsIosPrompt] = useState(false);

  useEffect(() => {
    // 1. Check if running as installed standalone PWA
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes("android-app://");
      setIsStandalone(isStandaloneMode);
      return isStandaloneMode;
    };
    const standalone = checkStandalone();

    // 2. Register Service Worker safely
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            console.log("[PWA] ServiceWorker registered with scope:", registration.scope);
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

      // Check if dismissed before THIS session (so it appears again on a future visit)
      const hasDismissed = sessionStorage.getItem("webhunt_pwa_dismissed_session");
      if (!hasDismissed) {
        setShowToast(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. Listen for App Installed Event
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setIsIosPrompt(false);
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

      // Setup iOS fallback if not standalone
      if (!standalone) {
        const ua = window.navigator.userAgent;
        const isIosDevice = /iphone|ipad|ipod/.test(ua.toLowerCase()) && !(window as any).MSStream;
        if (isIosDevice) {
          const hasDismissed = sessionStorage.getItem("webhunt_pwa_dismissed_session");
          if (!hasDismissed) {
            setIsIosPrompt(true);
            setShowToast(true);
          }
        }
      }
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
    if (outcome === "accepted") {
      setIsInstallable(false);
      setShowToast(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismissToast = () => {
    setShowToast(false);
    // Use sessionStorage instead of localStorage so it appears again on next session
    sessionStorage.setItem("webhunt_pwa_dismissed_session", "true");
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

      {/* Top Right Compact Install Banner */}
      {!isStandalone && showToast && (isInstallable || isIosPrompt) && (
        <div className="fixed top-20 right-4 sm:right-6 lg:right-8 z-40 w-[calc(100vw-32px)] sm:w-80 md:w-96 bg-surface border border-subtle/50 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 slide-in-from-right-4 duration-300 motion-reduce:transition-none motion-reduce:animate-none">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-subtle/50 flex items-center justify-center text-primary shrink-0 shadow-sm">
                <Radar className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-extrabold text-foreground tracking-tight">Install WebHunt</h3>
                <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                  Get quick access from your device.
                </p>
              </div>
            </div>
            <button
              onClick={handleDismissToast}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition shrink-0"
              aria-label="Close install prompt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-end space-x-2 mt-1">
            <button
              onClick={handleDismissToast}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-surface-subtle transition"
            >
              Later
            </button>
            {isInstallable ? (
              <button
                onClick={handleInstallClick}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold shadow-sm transition-all duration-300 shadow-brand-btn flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            ) : (
              <div className="px-3 py-1.5 rounded-xl bg-surface-subtle border border-subtle/50 text-xs font-medium text-muted-foreground flex items-center space-x-1.5">
                <Share className="w-3.5 h-3.5" />
                <span>Tap Share then 'Add to Home Screen'</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
