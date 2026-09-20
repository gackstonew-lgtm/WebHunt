"use client";

import React, { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

interface AppLayoutClientProps {
  children: React.ReactNode;
  initialAuthenticated: boolean;
}

function LayoutContent({ children, initialAuthenticated }: AppLayoutClientProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams ? searchParams.get("view") : null;

  // Landing page condition:
  // Root URL ("/") AND (unauthenticated OR query param ?view=landing is present)
  const isLanding = pathname === "/" && (!initialAuthenticated || view === "landing");

  if (isLanding) {
    return (
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}

export default function AppLayoutClient({ children, initialAuthenticated }: AppLayoutClientProps) {
  return (
    <Suspense fallback={<main className="flex-1 w-full flex flex-col">{children}</main>}>
      <LayoutContent initialAuthenticated={initialAuthenticated}>
        {children}
      </LayoutContent>
    </Suspense>
  );
}
