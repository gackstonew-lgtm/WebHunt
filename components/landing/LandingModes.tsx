"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Store, 
  Terminal, 
  MapPin, 
  Phone, 
  Globe, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Code, 
  Laptop, 
  CheckCircle2,
  DollarSign
} from "lucide-react";

export default function LandingModes() {
  const [activeMode, setActiveMode] = useState<"physical" | "online">("physical");

  return (
    <section id="modes" className="scroll-mt-20 py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Dual Engine Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Two Radars. Endless Opportunities.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Whether your web agency focuses on local brick-and-mortar clients or high-ticket remote tech contracts, WebHunt Delta has a dedicated discovery engine built for your business.
          </p>

          {/* Mode Switcher Buttons */}
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-surface border border-subtle/60 shadow-sm mt-4">
            <button
              onClick={() => setActiveMode("physical")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeMode === "physical"
                  ? "bg-primary text-primary-foreground shadow-brand-btn"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Physical Business Radar</span>
            </button>
            <button
              onClick={() => setActiveMode("online")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeMode === "online"
                  ? "bg-primary text-primary-foreground shadow-brand-btn"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Remote Tech &amp; Gig Radar</span>
            </button>
          </div>
        </div>

        {/* Dynamic Mode Showcase */}
        <div className="mt-14 max-w-5xl mx-auto">
          {activeMode === "physical" ? (
            <div className="rounded-3xl border border-primary/30 bg-surface/70 p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left explanation */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
                    <Store className="w-3.5 h-3.5" />
                    <span>Physical Lead Discovery Engine</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    Target Local Businesses With Zero Web Presence
                  </h3>

                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Over 40% of established local businesses with real customer foot-traffic, high review scores, and verified physical addresses still do not have a modern website. WebHunt surfaces them in seconds so you can pitch high-margin web designs, booking portals, and SEO retainers.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>170+ Trades (Roofers, Mechanics, Dentists, Salons, Plumbers)</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>240+ Countries &amp; Metros (Nairobi, Austin, London, Sydney, etc.)</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>Direct phone lines &amp; verified decision maker data</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>Average deal size: $1,200 upfront + $150/mo retainer</span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <Link
                      href="/auth?mode=signup"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs shadow-brand-btn transition-all"
                    >
                      <span>Scan Local Businesses Free</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Right Interactive Mock Card */}
                <div className="lg:col-span-5 space-y-3.5">
                  <div className="p-4 rounded-2xl bg-surface-elevated/80 border border-subtle/70 shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Riverside Auto &amp; Mechanical</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[10px] font-extrabold uppercase">
                        No Website
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Nairobi Metro / Austin TX</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-foreground font-mono">
                        <Phone className="w-3.5 h-3.5 text-primary" />
                        <span>+254 712 489 021</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-background/60 border border-subtle/40 text-[11px] text-muted-foreground">
                      <span className="font-bold text-foreground">Opportunity:</span> 4.8★ with 120 reviews. High caller volume but zero online scheduling.
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-elevated/80 border border-subtle/70 shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Kensington Fine Bakery</span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-extrabold uppercase">
                        Social Only
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>London, UK • Hospitality</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-foreground font-mono">
                        <Phone className="w-3.5 h-3.5 text-primary" />
                        <span>+44 20 7946 0912</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-background/60 border border-subtle/40 text-[11px] text-muted-foreground">
                      <span className="font-bold text-foreground">Opportunity:</span> Relying entirely on Instagram DMs for custom cake orders. Needs custom online ordering catalog.
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-primary/30 bg-surface/70 p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left explanation */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Remote Opportunities Radar</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    Query Live Remote Tech Feeds &amp; Freelance Contracts
                  </h3>

                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Connect directly to top developer endpoints (Remotive, Arbeitnow, Himalayas, RemoteOK, WWR) to query genuine remote software engineering, UI/UX design, Next.js contract, and AI implementation gigs.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Official API aggregation (Remotive, Arbeitnow, Himalayas, RemoteOK)</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Keyword filters (React, Next.js, Python, Tailwind, UI/UX)</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Instant Proposal &amp; Cover Letter Generator</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-foreground/90">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>High-ticket contract rates: $50 - $120 / hour</span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <Link
                      href="/auth?mode=signup"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs shadow-brand-btn transition-all"
                    >
                      <span>Explore Remote Radar Free</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Right Interactive Mock Card */}
                <div className="lg:col-span-5 space-y-3.5">
                  <div className="p-4 rounded-2xl bg-surface-elevated/80 border border-subtle/70 shadow-lg space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Senior Next.js &amp; AI Integration Engineer</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-extrabold">
                        $90k - $130k / yr
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Remote Worldwide • FinTech Scaleup • Posted 2h ago
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2 py-0.5 rounded bg-background/80 text-[10px] font-mono text-muted-foreground border border-subtle/50">Next.js 14</span>
                      <span className="px-2 py-0.5 rounded bg-background/80 text-[10px] font-mono text-muted-foreground border border-subtle/50">TypeScript</span>
                      <span className="px-2 py-0.5 rounded bg-background/80 text-[10px] font-mono text-muted-foreground border border-subtle/50">OpenAI API</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-elevated/80 border border-subtle/70 shadow-lg space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Lead Frontend UI/UX Contract</span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-extrabold">
                        $70 - $95 / hr
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      US / Remote • E-commerce Platform • 3 Months
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2 py-0.5 rounded bg-background/80 text-[10px] font-mono text-muted-foreground border border-subtle/50">Tailwind CSS</span>
                      <span className="px-2 py-0.5 rounded bg-background/80 text-[10px] font-mono text-muted-foreground border border-subtle/50">Design Systems</span>
                      <span className="px-2 py-0.5 rounded bg-background/80 text-[10px] font-mono text-muted-foreground border border-subtle/50">Figma</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
