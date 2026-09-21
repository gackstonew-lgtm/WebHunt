"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Radar } from "lucide-react";
import LegalModal from "@/components/LegalModal";

export default function LandingFooter() {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<"privacy" | "terms">("privacy");

  const openLegalModal = (tab: "privacy" | "terms") => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <>
      <footer className="border-t border-border bg-background py-12 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-border">
            
            {/* Brand */}
            <div className="space-y-2">
              <Link href="/" className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center text-foreground">
                  <Radar className="w-4 h-4 text-primary" />
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base text-foreground tracking-tight">WebHunt</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                    Delta
                  </span>
                </div>
              </Link>
              <p className="text-xs text-muted-foreground">
                Opportunity Intelligence &amp; Lead Discovery Platform
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center gap-6 text-xs">
              <a 
                href="#capabilities" 
                onClick={(e) => handleSmoothScroll(e, "#capabilities")} 
                className="hover:text-foreground transition"
              >
                Capabilities
              </a>
              <a 
                href="#workflow" 
                onClick={(e) => handleSmoothScroll(e, "#workflow")} 
                className="hover:text-foreground transition"
              >
                Workflow
              </a>
              <button
                onClick={() => openLegalModal("privacy")}
                className="hover:text-foreground transition text-left"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => openLegalModal("terms")}
                className="hover:text-foreground transition text-left"
              >
                Terms of Service
              </button>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
            <div>
              © {new Date().getFullYear()} WebHunt Delta. All rights reserved.
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/auth?mode=signin" className="hover:text-foreground transition">
                Sign In
              </Link>
              <span>•</span>
              <Link href="/auth?mode=signup" className="hover:text-foreground transition">
                Get Started
              </Link>
            </div>
          </div>

        </div>
      </footer>

      {legalModalOpen && (
        <LegalModal
          initialTab={legalModalTab}
          onClose={() => setLegalModalOpen(false)}
        />
      )}
    </>
  );
}
