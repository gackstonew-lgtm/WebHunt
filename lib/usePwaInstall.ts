"use client";

import { useState, useEffect, useCallback } from "react";

// Global declaration for deferred beforeinstallprompt event
declare global {
  interface Window {
    __deferredPrompt?: any;
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
        window.matchMedia("(display-mode: minimal-ui)").matches ||
        window.matchMedia("(display-mode: window-controls-overlay)").matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      const isAndroidApp = document.referrer?.startsWith("android-app://") || false;
      return Boolean(isStandaloneMedia || isIOSStandalone || isAndroidApp);
    };

    if (checkIsStandalone()) {
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
      e.preventDefault();
      window.__deferredPrompt = e;
      setPromptEvent(e);
      setCanInstall(true);
    };

    // If already captured by global head script
    if (window.__deferredPrompt) {
      setPromptEvent(window.__deferredPrompt);
      setCanInstall(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. App Installed listener
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setPromptEvent(null);
      window.__deferredPrompt = null;
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

  const installApp = useCallback(async () => {
    const currentPrompt = promptEvent || (typeof window !== "undefined" ? window.__deferredPrompt : null);

    if (!currentPrompt) {
      // Native prompt not available in this browser/session; trigger instructional fallback
      return { success: false, isFallback: true };
    }

    setIsInstalling(true);
    try {
      await currentPrompt.prompt();
      const choiceResult = await currentPrompt.userChoice;
      const outcome = choiceResult?.outcome as "accepted" | "dismissed";
      setInstallOutcome(outcome);

      if (outcome === "accepted") {
        setIsInstalled(true);
        setCanInstall(false);
      }

      setPromptEvent(null);
      if (typeof window !== "undefined") {
        window.__deferredPrompt = null;
      }
      setIsInstalling(false);
      return { success: outcome === "accepted", outcome };
    } catch (error) {
      console.error("[PWA] Installation prompt error:", error);
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
