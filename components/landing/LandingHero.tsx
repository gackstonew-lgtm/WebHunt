"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Building2, 
  Phone, 
  Globe, 
  Terminal, 
  ChevronRight,
  Lock,
  Search
} from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import RemoteSourcesBanner from "./RemoteSourcesBanner";

export default function LandingHero() {
  const [activeTab, setActiveTab] = useState<"physical" | "online">("physical");
  const [heroRef, isHeroVisible] = useIntersectionObserver<HTMLElement>();
  const [visualRef, isVisualVisible] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section 
      ref={heroRef}
      className="relative isolate overflow-hidden pt-8 sm:pt-12 pb-16 sm:pb-24 bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Text & CTAs */}
        <div 
          className={`text-center max-w-4xl mx-auto space-y-6 transition-all duration-700 ${
            isHeroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Live Platform / Source Logo Banner - Positioned directly above eyebrow */}
          <RemoteSourcesBanner />

          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-xs">
            <Search className="w-3.5 h-3.5 text-primary" />
            <span>Opportunity Intelligence Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Find Opportunities. <br />
            Discover Businesses. <span className="text-primary">Move Faster.</span>
          </h1>

          {/* Supporting Copy */}
          <p className="max-w-2xl mx-auto text-base sm:text-xl font-medium text-muted-foreground leading-relaxed">
            WebHunt Delta combines physical business discovery and remote opportunity intelligence in one workspace.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/auth?mode=signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground h-12 px-7 text-sm font-bold transition-all duration-200 group shadow-xs"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/auth?mode=signin"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-surface hover:bg-surface-elevated text-foreground border border-border h-12 px-7 text-sm font-semibold transition-all duration-200"
            >
              <span>Sign In</span>
            </Link>
          </div>
        </div>

        {/* Single Authentic Product Visual */}
        <div 
          ref={visualRef}
          className={`mt-12 sm:mt-16 max-w-5xl mx-auto transition-all duration-1000 delay-150 ${
            isVisualVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-[0.98]"
          }`}
        >
          <div className="rounded-2xl border border-border bg-surface shadow-xl overflow-hidden">
            
            {/* Browser Chrome Header */}
            <div className="flex items-center justify-between border-b border-border bg-surface-elevated px-4 sm:px-6 py-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-destructive/60 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/60 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/60 inline-block" />
                <span className="ml-2 hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground font-mono bg-background px-3 py-0.5 rounded-lg border border-border">
                  <Lock className="w-3 h-3 text-primary" />
                  webhunt.delta/radar
                </span>
              </div>

              {/* Mode Tabs */}
              <div className="flex items-center gap-1 bg-background p-1 rounded-xl border border-border">
                <button
                  onClick={() => setActiveTab("physical")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "physical"
                      ? "bg-surface-elevated text-foreground border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Physical Radar
                </button>
                <button
                  onClick={() => setActiveTab("online")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "online"
                      ? "bg-surface-elevated text-foreground border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Online Radar
                </button>
              </div>
            </div>

            {/* Window Content */}
            <div className="p-5 sm:p-7 space-y-5">
              {activeTab === "physical" ? (
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-border">
                    <div>
                      <div className="text-sm font-bold text-foreground">Physical Business Radar</div>
                      <div className="text-xs text-muted-foreground">Nearby trades filtered by digital presence and phone availability</div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Live Intelligence Scan</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {/* Item 1 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-surface-elevated/50 border border-border hover:border-primary/50 transition-all gap-4">
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-surface border border-border text-primary flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-foreground truncate">Riverside Auto &amp; Mechanical</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 uppercase">
                              No Website
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              Nairobi Metro • Auto Repair
                            </span>
                            <span className="flex items-center gap-1 text-foreground">
                              <Phone className="w-3 h-3 text-primary" />
                              +254 712 489 021
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-muted-foreground uppercase">Buy Likelihood</div>
                          <div className="text-sm font-extrabold text-primary">94/100</div>
                        </div>
                        <Link
                          href="/auth?mode=signup"
                          className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition flex items-center gap-1"
                        >
                          <span>Review</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-surface-elevated/50 border border-border hover:border-primary/50 transition-all gap-4">
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-surface border border-border text-muted-foreground flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-foreground truncate">Apex Dental &amp; Healthcare</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 uppercase">
                              No Website
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              Austin, TX • Healthcare
                            </span>
                            <span className="flex items-center gap-1 text-foreground">
                              <Phone className="w-3 h-3 text-primary" />
                              (512) 890-1209
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-muted-foreground uppercase">Buy Likelihood</div>
                          <div className="text-sm font-extrabold text-primary">91/100</div>
                        </div>
                        <Link
                          href="/auth?mode=signup"
                          className="px-3.5 py-1.5 rounded-xl bg-surface border border-border text-foreground font-bold text-xs hover:bg-surface-elevated transition flex items-center gap-1"
                        >
                          <span>Review</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-border">
                    <div>
                      <div className="text-sm font-bold text-foreground">Online Remote Radar</div>
                      <div className="text-xs text-muted-foreground">Aggregated feeds from supported tech sources</div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Live Feeds Active</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {/* Remote Item 1 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-surface-elevated/50 border border-border hover:border-primary/50 transition-all gap-4">
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-surface border border-border text-primary flex items-center justify-center shrink-0">
                          <Terminal className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-foreground truncate">Full-Stack Next.js &amp; Web Engineer</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                              Remote Contract
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            SaaS Tech • Worldwide Remote
                          </div>
                        </div>
                      </div>
                      <Link
                        href="/auth?mode=signup"
                        className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition flex items-center justify-center gap-1 shrink-0"
                      >
                        <span>Generate Proposal</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
