"use client";

import React, { useEffect, useState } from "react";
import { Download, WifiOff, X, Radar, Share } from "lucide-react";

type InstallState = "checking" | "install_available" | "ios_instructions" | "already_installed" | "unsupported" | "dismissed";

export default function PwaRegister() {
  const [installState, setInstallState] = useState<InstallState>("checking");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(false);

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
      window.addEventListener("online", () => setIsOffline(false));
      window.addEventListener("offline", () => setIsOffline(true));
    }

    // 3. Standalone Detection
    const isStandaloneMode = () => {
      return (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes("android-app://")
      );
    };

    if (isStandaloneMode()) {
      setInstallState("already_installed");
      return;
    }

    // Check if dismissed in this session
    if (sessionStorage.getItem("webhunt_pwa_dismissed_session")) {
      setInstallState("dismissed");
      return;
    }

    // 4. Install Event Handler
    const handleBeforeInstallPrompt = (e: any) => {
      console.log("[PWA] beforeinstallprompt fired/caught");
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallState("install_available");
    };

    // Important: Check if it already fired and was captured by our layout script
    if ((window as any).__deferredPrompt) {
      handleBeforeInstallPrompt((window as any).__deferredPrompt);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 5. Fallback timer if beforeinstallprompt doesn't fire
    const fallbackTimer = setTimeout(() => {
      setInstallState((prev) => {
        if (prev === "checking") {
          const ua = window.navigator.userAgent;
          const isIosDevice = /iphone|ipad|ipod/.test(ua.toLowerCase()) && !(window as any).MSStream;
          return isIosDevice ? "ios_instructions" : "unsupported";
        }
        return prev;
      });
    }, 1500);

    // 6. App Installed Event
    const handleAppInstalled = () => {
      console.log("[PWA] App installed event received");
      setInstallState("already_installed");
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log("[PWA] User choice:", outcome);
      if (outcome === "accepted") {
        setInstallState("already_installed");
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error("[PWA] Install error:", err);
    }
  };

  const handleDismiss = () => {
    setInstallState("dismissed");
    sessionStorage.setItem("webhunt_pwa_dismissed_session", "true");
  };

  const shouldShowBanner = installState === "install_available" || installState === "ios_instructions";

  return (
    <>
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-surface-elevated border-b border-red-500/20 text-red-400 px-4 py-2 text-xs flex items-center justify-center space-x-2 fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top">
          <WifiOff className="w-3.5 h-3.5 text-red-400" />
          <span>You are currently offline. Live lead scanning requires an internet connection.</span>
        </div>
      )}

      {/* PWA Install Banner */}
      {shouldShowBanner && (
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
              onClick={handleDismiss}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition shrink-0"
              aria-label="Close install prompt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-end space-x-2 mt-1">
            <button
              onClick={handleDismiss}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-surface-subtle transition"
            >
              Later
            </button>
            {installState === "install_available" ? (
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
