"use client";

import { useState, useEffect, useCallback } from "react";

// Global declaration for early captured beforeinstallprompt event
declare global {
  interface Window {
    __pwaDeferredPrompt?: any;
  }
}

export type PwaPlatform = "ios" | "android" | "desktop";

export interface PwaInstallState {
  isInstalled: boolean;
  canInstall: boolean;
  platform: PwaPlatform;
  isInstalling: boolean;
  installOutcome: "accepted" | "dismissed" | null;
  installApp: () => Promise<{ success: boolean; outcome?: "accepted" | "dismissed"; isFallback?: boolean }>;
}

export function usePwaInstall(): PwaInstallState {
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [canInstall, setCanInstall] = useState<boolean>(false);
  const [platform, setPlatform] = useState<PwaPlatform>("desktop");
  const [isInstalling, setIsInstalling] = useState<boolean>(false);
  const [installOutcome, setInstallOutcome] = useState<"accepted" | "dismissed" | null>(null);
  const [promptEvent, setPromptEvent] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Detect Platform
    const ua = window.navigator.userAgent || "";
    const isIOSDevice = /iphone|ipad|ipod/i.test(ua) && !(window as any).MSStream;
    const isAndroidDevice = /android/i.test(ua);

    if (isIOSDevice) {
      setPlatform("ios");
    } else if (isAndroidDevice) {
      setPlatform("android");
    } else {
      setPlatform("desktop");
    }

    // 2. Comprehensive Standalone Detection
    const checkIsStandalone = (): boolean => {
      const isStandaloneMedia =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: fullscreen)").matches ||
        window.matchMedia("(display-mode: minimal-ui)").matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      const isAndroidApp = document.referrer?.startsWith("android-app://") || false;
      return Boolean(isStandaloneMedia || isIOSStandalone || isAndroidApp);
    };

    if (checkIsStandalone()) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[PWA] Standalone mode detected - application is running installed");
      }
      setIsInstalled(true);
      setCanInstall(false);
      return;
    }

    // Listen for display-mode standalone changes
    const mediaQueries = [
      window.matchMedia("(display-mode: standalone)"),
      window.matchMedia("(display-mode: fullscreen)"),
      window.matchMedia("(display-mode: minimal-ui)"),
    ];

    const handleMediaChange = () => {
      if (checkIsStandalone()) {
        if (process.env.NODE_ENV !== "production") {
          console.log("[PWA] Standalone mode activated dynamically");
        }
        setIsInstalled(true);
        setCanInstall(false);
      }
    };

    mediaQueries.forEach((mq) => {
      if (mq.addEventListener) {
        mq.addEventListener("change", handleMediaChange);
      } else if ((mq as any).addListener) {
        (mq as any).addListener(handleMediaChange);
      }
    });

    // 3. Capture beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent browser default mini-infobar on mobile
      e.preventDefault();
      
      if (process.env.NODE_ENV !== "production") {
        console.log("[PWA] beforeinstallprompt received");
        console.log("[PWA] Install prompt available");
      }

      window.__pwaDeferredPrompt = e;
      setPromptEvent(e);
      setCanInstall(true);
    };

    // If already captured by early document script before React hydrated
    if (window.__pwaDeferredPrompt) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[PWA] beforeinstallprompt captured from early page load");
        console.log("[PWA] Install prompt available");
      }
      setPromptEvent(window.__pwaDeferredPrompt);
      setCanInstall(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. App Installed listener
    const handleAppInstalled = () => {
      if (process.env.NODE_ENV !== "production") {
        console.log("[PWA] Application installed successfully");
      }
      setIsInstalled(true);
      setCanInstall(false);
      setPromptEvent(null);
      window.__pwaDeferredPrompt = null;
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      mediaQueries.forEach((mq) => {
        if (mq.removeEventListener) {
          mq.removeEventListener("change", handleMediaChange);
        } else if ((mq as any).removeListener) {
          (mq as any).removeListener(handleMediaChange);
        }
      });
    };
  }, []);

  // 5. User-Initiated Installation Trigger
  const installApp = useCallback(async () => {
    const currentPrompt = promptEvent || (typeof window !== "undefined" ? window.__pwaDeferredPrompt : null);

    if (!currentPrompt) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[PWA] Install requested but no native prompt available in current browser session");
      }
      return { success: false, isFallback: true };
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("[PWA] User selected install");
    }

    setIsInstalling(true);
    try {
      await currentPrompt.prompt();
      const choiceResult = await currentPrompt.userChoice;
      const outcome = choiceResult?.outcome as "accepted" | "dismissed";
      setInstallOutcome(outcome);

      if (process.env.NODE_ENV !== "production") {
        if (outcome === "accepted") {
          console.log("[PWA] User accepted installation prompt");
        } else {
          console.log("[PWA] User dismissed install");
        }
      }

      if (outcome === "accepted") {
        // User agreed to install; prompt cannot be used again
        setCanInstall(false);
      }

      setPromptEvent(null);
      if (typeof window !== "undefined") {
        window.__pwaDeferredPrompt = null;
      }
      setIsInstalling(false);
      return { success: outcome === "accepted", outcome };
    } catch (error) {
      console.error("[PWA] Installation prompt invocation failed:", error);
      setIsInstalling(false);
      return { success: false, isFallback: true };
    }
  }, [promptEvent]);

  return {
    isInstalled,
    canInstall,
    platform,
    isInstalling,
    installOutcome,
    installApp,
  };
}
