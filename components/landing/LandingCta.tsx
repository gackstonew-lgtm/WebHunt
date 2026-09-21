"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Radar } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export default function LandingCta() {
  const [cardRef, isVisible] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section className="py-16 sm:py-24 bg-surface-subtle border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div 
          ref={cardRef}
          className={`rounded-2xl border border-border bg-surface p-8 sm:p-14 text-center shadow-lg transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="max-w-2xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
              <Radar className="w-3.5 h-3.5" />
              <span>WebHunt Delta Workspace</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Ready to Start?
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Access physical business discovery and remote opportunity intelligence in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/auth?mode=signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground h-12 px-7 text-sm font-bold transition-all duration-200 group shadow-xs"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/auth?mode=signin"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-surface-elevated hover:bg-surface text-foreground border border-border h-12 px-7 text-sm font-semibold transition-all duration-200"
              >
                <span>Sign In</span>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
