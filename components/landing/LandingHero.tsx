"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Radar, 
  ArrowRight, 
  Play, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Building2, 
  Phone, 
  Globe, 
  Terminal, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Lock
} from "lucide-react";

export default function LandingHero() {
  const [activeTab, setActiveTab] = useState<"physical" | "online">("physical");

  return (
    <section className="relative isolate overflow-hidden pt-8 sm:pt-14 pb-16 sm:pb-24">
      {/* Background ambient radial glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div 
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/30 to-indigo-500/20 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" 
          style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-3.5 py-1.5 text-xs font-semibold text-primary backdrop-blur-md shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-700">
            <Radar className="w-3.5 h-3.5 animate-pulse text-primary" />
            <span>Website Opportunity Intelligence &amp; Lead Radar</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
            Find &amp; Close Your Next <br />
            Web Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-indigo-400">in Minutes</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-xl font-medium text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Streamline your web agency prospecting with industry-leading opportunity intelligence. Scan 170+ physical trades with zero websites and query live remote tech contracts across 240+ countries.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <span className="rounded-full border border-subtle/70 bg-surface/80 px-3 py-1 text-xs font-semibold text-foreground/80 shadow-xs">
              No-Website Local Businesses
            </span>
            <span className="rounded-full border border-subtle/70 bg-surface/80 px-3 py-1 text-xs font-semibold text-foreground/80 shadow-xs">
              Verified Decision Makers
            </span>
            <span className="rounded-full border border-subtle/70 bg-surface/80 px-3 py-1 text-xs font-semibold text-foreground/80 shadow-xs">
              Remote Tech Opportunities
            </span>
            <span className="rounded-full border border-subtle/70 bg-surface/80 px-3 py-1 text-xs font-semibold text-foreground/80 shadow-xs">
              AI Pitch &amp; Proposal Generator
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-400">
            <Link
              href="/auth?mode=signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground h-13 px-8 text-base font-bold shadow-brand-btn transition-all duration-300 group"
            >
              <span>Start Prospecting Free</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="#journey"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-surface hover:bg-surface-elevated text-foreground border border-subtle/70 h-13 px-7 text-base font-semibold shadow-sm transition-all duration-200"
            >
              <Play className="w-4 h-4 text-primary fill-primary/20" />
              <span>See How It Works</span>
            </a>
          </div>

          {/* Assurance Note */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>No credit card required • Instant lead scanning • Verified contact data</span>
          </div>
        </div>

        {/* Interactive App Window Preview */}
        <div className="mt-14 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500">
          <div className="rounded-3xl border border-subtle/80 bg-surface/90 shadow-2xl overflow-hidden backdrop-blur-xl transition-all">
            
            {/* Window Browser Chrome Header */}
            <div className="flex items-center justify-between border-b border-subtle/60 bg-surface-elevated/70 px-4 sm:px-6 py-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
                <span className="ml-2 hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground font-mono bg-background/50 px-3 py-0.5 rounded-lg border border-subtle/50">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  https://webhunt.delta/radar
                </span>
              </div>

              {/* Mode Tabs */}
              <div className="flex items-center gap-1 bg-background/60 p-1 rounded-xl border border-subtle/50">
                <button
                  onClick={() => setActiveTab("physical")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "physical"
                      ? "bg-surface-elevated text-foreground shadow-xs border border-subtle/60"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Physical Radar
                </button>
                <button
                  onClick={() => setActiveTab("online")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "online"
                      ? "bg-surface-elevated text-foreground shadow-xs border border-subtle/60"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Online Radar
                </button>
              </div>
            </div>

            {/* Window Content */}
            <div className="p-5 sm:p-8 space-y-6">
              {activeTab === "physical" ? (
                <div>
                  {/* Search Bar Representation */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-subtle/40">
                    <div>
                      <div className="text-sm font-bold text-foreground">Scanned Trade Opportunities · Nairobi &amp; Global Metro</div>
                      <div className="text-xs text-muted-foreground">Filtered: Phone available • Zero website on record • High buy intent</div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary self-start sm:self-auto">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>342 leads found today</span>
                    </div>
                  </div>

                  {/* Scored Lead Items */}
                  <div className="mt-4 space-y-3">
                    {/* Item 1 - Top Scored */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-surface border border-primary/40 ring-1 ring-primary/20 hover:border-primary transition-all gap-4">
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm sm:text-base text-foreground truncate">Riverside Auto &amp; Mechanical</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/10 text-amber-500 border border-amber-500/25 uppercase">
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
                          <div className="flex items-center gap-1 justify-end">
                            <span className="text-sm font-black text-primary">94</span>
                            <span className="text-[10px] text-muted-foreground">/100</span>
                          </div>
                        </div>
                        <Link
                          href="/auth?mode=signup"
                          className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition flex items-center gap-1 shadow-sm"
                        >
                          <span>Claim Lead</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-surface/60 border border-subtle/60 hover:border-subtle transition-all gap-4">
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-surface-elevated text-muted-foreground flex items-center justify-center shrink-0 border border-subtle/50">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm sm:text-base text-foreground truncate">Apex Dental &amp; Orthodontics</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/10 text-amber-500 border border-amber-500/25 uppercase">
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
                          <div className="flex items-center gap-1 justify-end">
                            <span className="text-sm font-black text-primary">91</span>
                            <span className="text-[10px] text-muted-foreground">/100</span>
                          </div>
                        </div>
                        <Link
                          href="/auth?mode=signup"
                          className="px-3.5 py-1.5 rounded-xl bg-surface-elevated border border-subtle/60 text-foreground font-bold text-xs hover:bg-surface transition flex items-center gap-1"
                        >
                          <span>Unlock Intel</span>
                          <Lock className="w-3 h-3 text-muted-foreground" />
                        </Link>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-surface/60 border border-subtle/60 hover:border-subtle transition-all gap-4">
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-surface-elevated text-muted-foreground flex items-center justify-center shrink-0 border border-subtle/50">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm sm:text-base text-foreground truncate">Kensington Fine Bakery &amp; Cafe</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/10 text-blue-500 border border-blue-500/25 uppercase">
                              Weak Social-Only
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              London, UK • Hospitality
                            </span>
                            <span className="flex items-center gap-1 text-foreground">
                              <Phone className="w-3 h-3 text-primary" />
                              +44 20 7946 0912
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-muted-foreground uppercase">Buy Likelihood</div>
                          <div className="flex items-center gap-1 justify-end">
                            <span className="text-sm font-black text-primary">88</span>
                            <span className="text-[10px] text-muted-foreground">/100</span>
                          </div>
                        </div>
                        <Link
                          href="/auth?mode=signup"
                          className="px-3.5 py-1.5 rounded-xl bg-surface-elevated border border-subtle/60 text-foreground font-bold text-xs hover:bg-surface transition flex items-center gap-1"
                        >
                          <span>Unlock Intel</span>
                          <Lock className="w-3 h-3 text-muted-foreground" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Remote Tech View */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-subtle/40">
                    <div>
                      <div className="text-sm font-bold text-foreground">Live Remote Developer &amp; Design Feeds</div>
                      <div className="text-xs text-muted-foreground">Aggregated from Remotive, Arbeitnow, Himalayas, RemoteOK &amp; WWR</div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-500 self-start sm:self-auto">
                      <Globe className="w-3.5 h-3.5" />
                      <span>1,200+ Live Tech Contracts</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-surface border border-primary/40 ring-1 ring-primary/20 gap-4">
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                          <Terminal className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm sm:text-base text-foreground truncate">Full-Stack Next.js &amp; AI Integration Engineer</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/25">
                              $90,000 - $130,000 / yr
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>SaaS Scaleup • Worldwide Remote • Posted 2h ago</span>
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

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-surface/60 border border-subtle/60 gap-4">
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-surface-elevated text-muted-foreground flex items-center justify-center shrink-0 border border-subtle/50">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm sm:text-base text-foreground truncate">Senior React &amp; Tailwind UI/UX Contractor</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/10 text-blue-500 border border-blue-500/25">
                              $60 - $85 / hr
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>FinTech Lab • US / EMEA • Contract 6 mos</span>
                          </div>
                        </div>
                      </div>
                      <Link
                        href="/auth?mode=signup"
                        className="px-3.5 py-1.5 rounded-xl bg-surface-elevated border border-subtle/60 text-foreground font-bold text-xs hover:bg-surface transition flex items-center justify-center gap-1 shrink-0"
                      >
                        <span>Generate Proposal</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Insight Strip */}
            <div className="border-t border-subtle/60 bg-surface-elevated/40 px-5 sm:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>Opportunity Score: Combines review count, business age &amp; lack of digital presence</span>
              </div>
              <Link
                href="/auth?mode=signup"
                className="font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Launch Your First Scan</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
