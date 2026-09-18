"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * /auth/verify — Email verification is no longer required.
 * This page now redirects all visitors directly to the home dashboard.
 * Old verification links (token-based) will land here and be safely redirected.
 */
export default function VerifyEmailPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 text-neutral-900 dark:text-foreground">
      <div className="flex items-center space-x-3">
        <div className="w-5 h-5 border-2 border-neutral-400 dark:border-white border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Redirecting to workspace...</span>
      </div>
    </div>
  );
}
