"use client";

import React from "react";
import Link from "next/link";
import { 
  Radar, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2,
  Zap
} from "lucide-react";

export default function LandingCta() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Glow Container Card */}
        <div className="relative rounded-3xl border border-primary/30 bg-gradient-to-b from-surface via-surface-elevated/70 to-surface p-8 sm:p-16 text-center shadow-2xl overflow-hidden">
          
          {/* Background Ambient Radial Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/25 text-xs font-bold shadow-xs">
              <Radar className="w-4 h-4 animate-pulse" />
              <span>Worldwide Opportunity Radar Active</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Ready to Close Your Next <br className="hidden sm:inline" />
              <span className="text-primary italic">High-Ticket Web Client</span>?
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Stop wasting hours manually browsing map pins and outdated directories. Start scanning 170+ physical trades and live remote tech feeds today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link
                href="/auth?mode=signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground h-13 px-8 text-base font-bold shadow-brand-btn transition-all duration-300 group"
              >
                <span>Start Prospecting Free</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-surface hover:bg-surface-elevated text-foreground border border-subtle/70 h-13 px-7 text-base font-semibold shadow-sm transition-all duration-200"
              >
                <span>View Pricing Plans</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground pt-4">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                No credit card required upfront
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-primary" />
                Instant lead results
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Verified contact details
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
