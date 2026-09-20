"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Radar, ArrowRight, ShieldCheck, Globe2 } from "lucide-react";
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
      <footer className="border-t border-subtle/50 bg-surface/50 pt-16 pb-12 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-subtle/40">
            
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-surface border border-subtle/60 flex items-center justify-center text-foreground">
                  <Radar className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-lg text-foreground tracking-tight">WebHunt</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                    Delta
                  </span>
                </div>
              </Link>

              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                The high-performance sales intelligence radar for web design agencies, full-stack freelancers, and developers. Discover local businesses with no website across 170+ trades and tap into live remote tech feeds.
              </p>

              <div className="flex items-center space-x-2 text-[11px] text-muted-foreground pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>Worldwide Radar Grid Online (240+ Countries)</span>
              </div>
            </div>

            {/* Navigation Column */}
            <div className="space-y-3">
              <div className="font-bold text-sm text-foreground">Platform</div>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#journey" onClick={(e) => handleSmoothScroll(e, "#journey")} className="hover:text-foreground transition">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#modes" onClick={(e) => handleSmoothScroll(e, "#modes")} className="hover:text-foreground transition">
                    Dual Radars
                  </a>
                </li>
                <li>
                  <a href="#compare" onClick={(e) => handleSmoothScroll(e, "#compare")} className="hover:text-foreground transition">
                    Compare Methods
                  </a>
                </li>
                <li>
                  <a href="#calculator" onClick={(e) => handleSmoothScroll(e, "#calculator")} className="hover:text-foreground transition">
                    Revenue Calculator
                  </a>
                </li>
                <li>
                  <a href="#features" onClick={(e) => handleSmoothScroll(e, "#features")} className="hover:text-foreground transition">
                    Feature Grid
                  </a>
                </li>
                <li>
                  <a href="#pricing" onClick={(e) => handleSmoothScroll(e, "#pricing")} className="hover:text-foreground transition">
                    Pricing Plans
                  </a>
                </li>
              </ul>
            </div>

            {/* Engines Column */}
            <div className="space-y-3">
              <div className="font-bold text-sm text-foreground">Solutions</div>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/auth?mode=signup" className="hover:text-foreground transition">
                    Physical Business Radar
                  </Link>
                </li>
                <li>
                  <Link href="/auth?mode=signup" className="hover:text-foreground transition">
                    Remote Tech &amp; Gigs Radar
                  </Link>
                </li>
                <li>
                  <Link href="/auth?mode=signup" className="hover:text-foreground transition">
                    Decision-Maker Intel
                  </Link>
                </li>
                <li>
                  <Link href="/auth?mode=signup" className="hover:text-foreground transition">
                    In-Session Pipeline CRM
                  </Link>
                </li>
                <li>
                  <Link href="/auth?mode=signup" className="hover:text-foreground transition">
                    AI Pitch &amp; Proposal Bot
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Company Column */}
            <div className="space-y-3">
              <div className="font-bold text-sm text-foreground">Trust &amp; Legal</div>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => openLegalModal("privacy")}
                    className="hover:text-foreground transition text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openLegalModal("terms")}
                    className="hover:text-foreground transition text-left"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <a href="#faq" onClick={(e) => handleSmoothScroll(e, "#faq")} className="hover:text-foreground transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#contact" onClick={(e) => handleSmoothScroll(e, "#contact")} className="hover:text-foreground transition">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div>
              © {new Date().getFullYear()} WebHunt Delta. All rights reserved. Worldwide Intelligence Radar.
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => openLegalModal("privacy")}
                className="hover:text-foreground transition"
              >
                Privacy
              </button>
              <span>•</span>
              <button
                onClick={() => openLegalModal("terms")}
                className="hover:text-foreground transition"
              >
                Terms
              </button>
              <span>•</span>
              <a href="#contact" onClick={(e) => handleSmoothScroll(e, "#contact")} className="hover:text-foreground transition">
                Support
              </a>
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
