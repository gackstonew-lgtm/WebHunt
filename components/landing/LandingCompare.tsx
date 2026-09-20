"use client";

import React from "react";
import Link from "next/link";
import { 
  XCircle, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet, 
  Search, 
  Zap, 
  Target, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  MousePointerClick
} from "lucide-react";

export default function LandingCompare() {
  const manualDrawbacks = [
    {
      title: "Endless Manual Map Scrolling",
      text: "Wasting 4-6 hours clicking through Google Maps and directories one pin at a time just to check if a website link exists.",
    },
    {
      title: "Messy Spreadsheet Copy-Pasting",
      text: "Manually typing phone numbers, addresses, and trade types into spreadsheets with zero automated enrichment.",
    },
    {
      title: "Zero Intent or Scoring Filter",
      text: "No way to know if an owner is actively growing or if the business is a dead end before you pick up the phone.",
    },
    {
      title: "Slow, Unpredictable Pipeline",
      text: "Burning whole afternoons to yield 3-4 unqualified leads with generic gatekeeper numbers.",
    },
  ];

  const webhuntBenefits = [
    {
      title: "Instant Scored Pipeline in Seconds",
      text: "Instant query across 170+ physical trades and live remote tech feeds, automatically filtering businesses with no website.",
    },
    {
      title: "Verified Decision-Maker Intel",
      text: "Get direct phone numbers, owner contact names, and an AI opportunity summary ready for immediate outreach.",
    },
    {
      title: "Buy-Likelihood Intelligence",
      text: "Our scoring algorithm evaluates review volume, ratings, and digital gaps so you call the hottest prospects first.",
    },
    {
      title: "Integrated CRM & Rapid Export",
      text: "One click to save leads to your in-session Kanban pipeline, generate pitches, or export cleanly formatted CSVs.",
    },
  ];

  return (
    <section id="compare" className="scroll-mt-20 py-20 sm:py-28 bg-surface/30 border-y border-subtle/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Discovery Reimagined
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Stop Hunting by Hand
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Finding businesses that need a website manually burns valuable design and client-pitching hours. WebHunt gives you a finished, scored list ready to convert.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* The Manual Way */}
          <div className="rounded-3xl border border-red-500/20 bg-surface/50 p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-subtle/40">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">The Traditional Hustle</span>
                  <h3 className="text-2xl font-bold text-foreground mt-0.5">The Manual Way</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
                  4-6 Hours / Day
                </span>
              </div>

              <div className="space-y-4">
                {manualDrawbacks.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3.5 p-3 rounded-2xl bg-surface-elevated/40 border border-subtle/30">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-subtle/40 flex items-center justify-between text-xs text-muted-foreground">
              <span>Outcome: Low conversion &amp; burnout</span>
              <span className="font-bold text-red-400">~2 leads / hour</span>
            </div>
          </div>

          {/* The WebHunt Way */}
          <div className="rounded-3xl border border-primary/40 bg-surface p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden ring-1 ring-primary/20">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-subtle/40">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Intelligent Lead Radar</span>
                  <h3 className="text-2xl font-bold text-foreground mt-0.5">The WebHunt Way</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold">
                  Seconds per Scan
                </span>
              </div>

              <div className="space-y-4">
                {webhuntBenefits.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3.5 p-3 rounded-2xl bg-surface-elevated border border-primary/20 shadow-xs">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-subtle/40 flex items-center justify-between text-xs text-muted-foreground">
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Outcome: High intent &amp; closed retainers
              </span>
              <span className="font-bold text-primary">50+ qualified leads / scan</span>
            </div>
          </div>

        </div>

        {/* Call to action */}
        <div className="mt-12 text-center">
          <Link
            href="/auth?mode=signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm shadow-brand-btn transition-all duration-200"
          >
            <span>Switch to the WebHunt Way</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
