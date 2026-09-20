"use client";

import { useState, useEffect, useCallback } from "react";

// Global declaration for deferred beforeinstallprompt event
declare global {
  interface Window {
    __deferredPrompt?: any;
  }
}

export interface PwaInstallState {
  isInstalled: boolean;
  canInstall: boolean;
  isIOS: boolean;
  isInstalling: boolean;
  isUnsupported: boolean;
  installOutcome: "accepted" | "dismissed" | null;
  installApp: () => Promise<{ success: boolean; outcome?: "accepted" | "dismissed" }>;
}

export function usePwaInstall(): PwaInstallState {
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [canInstall, setCanInstall] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);
  const [isUnsupported, setIsUnsupported] = useState<boolean>(false);
  const [installOutcome, setInstallOutcome] = useState<"accepted" | "dismissed" | null>(null);
  const [promptEvent, setPromptEvent] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Detect Standalone Mode (Installed PWA)
    const checkIsStandalone = (): boolean => {
      const isStandaloneMedia = window.matchMedia("(display-mode: standalone)").matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      const isAndroidApp = document.referrer?.startsWith("android-app://") || false;
      return Boolean(isStandaloneMedia || isIOSStandalone || isAndroidApp);
    };

    if (checkIsStandalone()) {
      setIsInstalled(true);
      setCanInstall(false);
      return;
    }

    // Listen for display-mode standalone changes (e.g. if user opened app in standalone window)
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
        setCanInstall(false);
      }
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(handleMediaChange);
    }

    // 2. Detect iOS / iPadOS Safari (where beforeinstallprompt is not supported)
    const ua = window.navigator.userAgent || "";
    const isIosDevice =
      /iphone|ipad|ipod/i.test(ua) &&
      !(window as any).MSStream &&
      !(window.navigator as any).standalone;
    setIsIOS(isIosDevice);

    // 3. Capture beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      window.__deferredPrompt = e;
      setPromptEvent(e);
      setCanInstall(true);
      setIsUnsupported(false);
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

    // 5. Fallback timer if prompt doesn't fire and not iOS
    const timeoutId = setTimeout(() => {
      if (!window.__deferredPrompt && !isIosDevice && !checkIsStandalone()) {
        setIsUnsupported(true);
      }
    }, 1500);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } else if ((mediaQuery as any).removeListener) {
        (mediaQuery as any).removeListener(handleMediaChange);
      }
      clearTimeout(timeoutId);
    };
  }, []);

  const installApp = useCallback(async () => {
    const currentPrompt = promptEvent || (typeof window !== "undefined" ? window.__deferredPrompt : null);

    if (!currentPrompt) {
      return { success: false };
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
      return { success: false };
    }
  }, [promptEvent]);

  return {
    isInstalled,
    canInstall,
    isIOS,
    isInstalling,
    isUnsupported,
    installOutcome,
    installApp,
  };
}
