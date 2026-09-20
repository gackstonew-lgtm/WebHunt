"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  UserCheck, 
  PhoneCall, 
  Wand2, 
  CalendarCheck, 
  Trophy, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Building2, 
  Phone, 
  Mail, 
  Clock, 
  Check, 
  TrendingUp,
  ShieldCheck,
  ExternalLink,
  Code
} from "lucide-react";

export default function LandingLoop() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      number: 1,
      id: "discover",
      title: "Discover the Opportunity",
      icon: Search,
      tag: "Step 01 • Market Discovery",
      summary: "WebHunt scans local markets across 170+ trades to surface businesses with zero website or weak, outdated web footprints. Buy-likelihood scoring highlights who is most ready to buy.",
      mockup: (
        <div className="rounded-2xl border border-subtle/70 bg-surface/90 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-subtle/40">
            <span className="text-xs font-bold text-foreground">Scanned Leads · Austin &amp; Nairobi</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
              342 Scored Today
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-elevated/70 border border-primary/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">Riverside Auto Repair</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[10px] font-extrabold uppercase">
                No Website
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Nairobi / Austin • Mechanic
              </span>
              <span className="font-bold text-primary flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Score: 92/100
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-background/50 border border-subtle/40 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>High buying intent detected: 4.8★ with 130+ reviews and zero web presence</span>
          </div>
        </div>
      ),
    },
    {
      number: 2,
      id: "enrich",
      title: "Enrich with Decision-Maker Intel",
      icon: UserCheck,
      tag: "Step 02 • Contact Enrichment",
      summary: "Go past the raw listing to the real owner. WebHunt surfaces verified decision-maker names, direct phone lines, and email addresses with an AI opportunity brief.",
      mockup: (
        <div className="rounded-2xl border border-subtle/70 bg-surface/90 p-5 shadow-xl space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full bg-primary/15 text-primary font-bold text-sm flex items-center justify-center border border-primary/25">
              DM
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-foreground">Dana Morales</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                  Verified Owner (95%)
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Owner • Riverside Auto Repair</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-elevated border border-subtle/50 font-mono">
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span>(512) 555-0142</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-elevated border border-subtle/50 font-mono truncate">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span>dana@riverside...</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-primary/[0.04] border border-primary/20 text-xs leading-relaxed text-muted-foreground">
            <div className="font-bold text-primary flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              AI Opportunity Brief
            </div>
            Strong customer loyalty but zero web search visibility. Losing evening and weekend bookings to franchise chains.
          </div>
        </div>
      ),
    },
    {
      number: 3,
      id: "outreach",
      title: "Outreach & Cold-Call Scripts",
      icon: PhoneCall,
      tag: "Step 03 • Conversation Teleprompter",
      summary: "Pitch with total confidence. Get tailored cold-call openers, objection handlers, and value propositions crafted specifically for the business's industry and missing site.",
      mockup: (
        <div className="rounded-2xl border border-subtle/70 bg-surface/90 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-subtle/40">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cold-Call Teleprompter</span>
            <span className="text-[11px] font-semibold text-primary">Ready in 1-Click</span>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-elevated/80 border border-subtle/50 space-y-2">
            <div className="text-xs font-semibold text-primary">Proven Opening Script:</div>
            <p className="text-xs italic text-foreground/90 leading-relaxed">
              &quot;Hi Dana — saw Riverside Auto has some of the highest rated reviews in town, but I noticed you don&apos;t have a website for customers looking to book appointments after-hours. I actually put together a quick mockup tailored for your shop...&quot;
            </p>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-500">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              Objection handling built in
            </span>
            <span>82% Meeting Rate</span>
          </div>
        </div>
      ),
    },
    {
      number: 4,
      id: "pitch",
      title: "Build the Pitch in One Click",
      icon: Wand2,
      tag: "Step 04 • Rapid AI Mockups",
      summary: "Walk into every conversation with a live concept, not a blank promise. Generate prompts tailored for Replit, Lovable, v0, Bolt, and modern AI site builders in seconds.",
      mockup: (
        <div className="rounded-2xl border border-subtle/70 bg-surface/90 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-subtle/40">
            <span className="text-xs font-bold text-foreground">AI Website Prompt — Generated</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary">Mobile-First Concept</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-elevated border border-subtle/50 text-xs font-mono text-muted-foreground line-clamp-3">
            &quot;Create a sleek, high-converting website for Riverside Auto Repair. Feature emergency roadside call button, online repair booking, customer testimonial carousel, and price estimates...&quot;
          </div>
          <div className="pt-1">
            <div className="text-[11px] font-bold text-muted-foreground uppercase mb-2">Export to Your Builder</div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
              <span className="p-2 rounded-lg bg-surface-elevated border border-subtle/60 text-foreground">Replit</span>
              <span className="p-2 rounded-lg bg-surface-elevated border border-subtle/60 text-foreground">Lovable</span>
              <span className="p-2 rounded-lg bg-surface-elevated border border-subtle/60 text-foreground">v0.dev</span>
              <span className="p-2 rounded-lg bg-surface-elevated border border-subtle/60 text-foreground">Bolt.new</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: 5,
      id: "crm",
      title: "Run the Meeting & Pipeline CRM",
      icon: CalendarCheck,
      tag: "Step 05 • Deal Management",
      summary: "Track every lead across our built-in in-session Kanban pipeline. Move deals seamlessly from New Lead → Contacted → Interested → Closed Deal without messy spreadsheets.",
      mockup: (
        <div className="rounded-2xl border border-subtle/70 bg-surface/90 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-subtle/40">
            <span className="text-xs font-bold text-foreground">In-Session Pipeline Tracker</span>
            <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Demo Booked
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
            <div className="py-1.5 rounded bg-surface-elevated border border-subtle/50 text-muted-foreground">New</div>
            <div className="py-1.5 rounded bg-surface-elevated border border-subtle/50 text-muted-foreground">Contacted</div>
            <div className="py-1.5 rounded bg-primary text-primary-foreground shadow-xs">Interested</div>
            <div className="py-1.5 rounded bg-surface-elevated border border-subtle/50 text-muted-foreground">Closed</div>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-elevated border border-subtle/50 space-y-1.5">
            <div className="text-xs font-bold text-foreground">Demo Call · Riverside Auto Repair</div>
            <div className="text-xs text-muted-foreground flex items-center justify-between">
              <span>Thursday, 2:00 PM • Screen share</span>
              <span className="font-semibold text-primary">High Close Probability</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: 6,
      id: "revenue",
      title: "Close Recurring Monthly Revenue",
      icon: Trophy,
      tag: "Step 06 • Long-Term Retainers",
      summary: "Sign the client and bundle hosting, domain management, and maintenance into a steady monthly recurring retainer ($500 to $1,500/month). Build predictable agency cash flow.",
      mockup: (
        <div className="rounded-2xl border border-subtle/70 bg-surface/90 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
              <Trophy className="w-3.5 h-3.5" />
              Deal Won &amp; Signed
            </span>
            <span className="text-xs text-muted-foreground font-semibold">One Week Loop</span>
          </div>
          <div className="flex items-baseline justify-between p-4 rounded-xl bg-surface-elevated border border-primary/30">
            <div>
              <div className="text-3xl font-extrabold text-foreground tracking-tight">$1,500</div>
              <div className="text-xs text-muted-foreground">Recurring Retainer / Month</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-emerald-500 flex items-center gap-1 justify-end">
                <TrendingUp className="w-3.5 h-3.5" />
                +$18,000 ARR
              </div>
              <div className="text-[11px] text-muted-foreground">Upfront Build: $2,500</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-background/50 border border-subtle/40">
              <div className="text-muted-foreground text-[10px] font-bold">Discovered</div>
              <div className="font-extrabold text-foreground">Mon</div>
            </div>
            <div className="p-2 rounded-lg bg-background/50 border border-subtle/40">
              <div className="text-muted-foreground text-[10px] font-bold">Demo Pitch</div>
              <div className="font-extrabold text-foreground">Wed</div>
            </div>
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <div className="text-primary text-[10px] font-bold">Closed</div>
              <div className="font-extrabold text-primary">Fri</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="journey" className="scroll-mt-20 py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            The WebHunt Loop
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            From Cold Lead to <span className="text-primary italic">Closed Deal</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Six beats, one continuous motion. WebHunt automates opportunity discovery and contact intelligence — you just close.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="flex flex-col justify-between rounded-3xl border border-subtle/70 bg-surface/50 p-6 sm:p-7 hover:bg-surface hover:border-strong/60 transition-all duration-200 hover:shadow-xl group"
              >
                <div className="space-y-4">
                  {/* Step Header */}
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
                      0{step.number}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                      {step.summary}
                    </p>
                  </div>
                </div>

                {/* Mockup Preview Card */}
                <div className="mt-6 pt-2">
                  {step.mockup}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA at end of loop */}
        <div className="mt-16 text-center">
          <Link
            href="/auth?mode=signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm shadow-brand-btn transition-all duration-200"
          >
            <span>Start Your 6-Step Loop Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
