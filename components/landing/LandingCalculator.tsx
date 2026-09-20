"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Sparkles, 
  ArrowRight, 
  Check, 
  HelpCircle 
} from "lucide-react";

export default function LandingCalculator() {
  const [dealsPerMonth, setDealsPerMonth] = useState<number>(3);
  const [upfrontFee, setUpfrontFee] = useState<number>(1200);
  const [monthlyRetainer, setMonthlyRetainer] = useState<number>(150);

  // Math computations
  const upfrontPerMonth = useMemo(() => dealsPerMonth * upfrontFee, [dealsPerMonth, upfrontFee]);
  const newMrrPerMonth = useMemo(() => dealsPerMonth * monthlyRetainer, [dealsPerMonth, monthlyRetainer]);
  const exitMrrMonth12 = useMemo(() => dealsPerMonth * monthlyRetainer * 12, [dealsPerMonth, monthlyRetainer]);
  
  // Total First Year Earnings = 12 months of upfront + cumulative retainer compounding (sum from m=1 to 12 of m * deals * retainer)
  // Sum(m=1..12) of m = 12 * 13 / 2 = 78
  const cumulativeRetainersYear1 = useMemo(() => 78 * dealsPerMonth * monthlyRetainer, [dealsPerMonth, monthlyRetainer]);
  const totalUpfrontYear1 = useMemo(() => upfrontPerMonth * 12, [upfrontPerMonth]);
  const totalYear1Earnings = useMemo(() => totalUpfrontYear1 + cumulativeRetainersYear1, [totalUpfrontYear1, cumulativeRetainersYear1]);

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="calculator" className="scroll-mt-20 py-20 sm:py-28 bg-surface/30 border-y border-subtle/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Agency Economics Simulator
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Calculate Your Revenue Potential
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            See how landing just 2-3 local no-website businesses per month compounds into steady upfront cash flow and predictable recurring monthly retainers.
          </p>
        </div>

        {/* Interactive Simulator Grid */}
        <div className="mt-14 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Controls Column */}
          <div className="lg:col-span-6 rounded-3xl border border-subtle/70 bg-surface/80 p-6 sm:p-8 flex flex-col justify-between shadow-xl space-y-6 backdrop-blur-xl">
            <div className="space-y-6">
              <div className="flex items-center space-x-2.5 pb-2 border-b border-subtle/40">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-foreground">Pipeline Assumptions</h3>
              </div>

              {/* Slider 1: Deals per month */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-semibold text-foreground">
                    Websites Built / Deals Closed
                  </label>
                  <span className="px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary font-mono font-bold text-sm">
                    {dealsPerMonth} / month
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={15}
                  step={1}
                  value={dealsPerMonth}
                  aria-label="Websites built per month"
                  onChange={(e) => setDealsPerMonth(parseInt(e.target.value))}
                  className="w-full h-2 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>1 deal (Part-time)</span>
                  <span>5 deals (Active Freelancer)</span>
                  <span>15 deals (Agency)</span>
                </div>
              </div>

              {/* Slider 2: Upfront build fee */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-semibold text-foreground">
                    Average Upfront Build Fee
                  </label>
                  <span className="px-2.5 py-0.5 rounded-lg bg-surface-elevated text-foreground border border-subtle/60 font-mono font-bold text-sm">
                    {formatMoney(upfrontFee)}
                  </span>
                </div>
                <input
                  type="range"
                  min={400}
                  max={4000}
                  step={100}
                  value={upfrontFee}
                  aria-label="Upfront build fee"
                  onChange={(e) => setUpfrontFee(parseInt(e.target.value))}
                  className="w-full h-2 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>$400 (Quick 1-Pager)</span>
                  <span>$1,200 (Standard)</span>
                  <span>$4,000 (Custom CMS)</span>
                </div>
              </div>

              {/* Slider 3: Monthly maintenance retainer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-semibold text-foreground">
                    Monthly Retainer (Hosting &amp; Edits)
                  </label>
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono font-bold text-sm">
                    {formatMoney(monthlyRetainer)} / mo
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={500}
                  step={25}
                  value={monthlyRetainer}
                  aria-label="Monthly maintenance retainer"
                  onChange={(e) => setMonthlyRetainer(parseInt(e.target.value))}
                  className="w-full h-2 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>$50 / mo (Hosting only)</span>
                  <span>$150 / mo (Hosting + Edits)</span>
                  <span>$500 / mo (SEO &amp; Growth)</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-elevated/70 border border-subtle/50 text-xs text-muted-foreground">
              <span className="font-bold text-foreground">Retainer Retention:</span> Most local businesses keep their website hosting and support retainer for an average of 24+ months.
            </div>
          </div>

          {/* Results Display Column */}
          <div className="lg:col-span-6 rounded-3xl border border-primary/40 bg-surface p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden ring-1 ring-primary/20">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-subtle/40">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Compounding Forecast</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <TrendingUp className="w-3.5 h-3.5" /> Compounding Growth
                </span>
              </div>

              {/* Big Hero Number: Year 1 Projected Total */}
              <div className="p-5 rounded-2xl bg-surface-elevated border border-primary/30 text-center space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Total Projected Year 1 Earnings
                </span>
                <div className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
                  {formatMoney(totalYear1Earnings)}
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  Combines {formatMoney(totalUpfrontYear1)} upfront cash + {formatMoney(cumulativeRetainersYear1)} compounding retainers
                </p>
              </div>

              {/* Sub Metrics Breakdown */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-surface-elevated/60 border border-subtle/50">
                  <div className="text-xs text-muted-foreground font-semibold">Immediate Cash Flow</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-foreground mt-1">
                    {formatMoney(upfrontPerMonth)}
                    <span className="text-xs font-normal text-muted-foreground"> / mo</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    From {dealsPerMonth} initial build contracts
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-surface-elevated/60 border border-subtle/50">
                  <div className="text-xs text-muted-foreground font-semibold">Month 12 MRR Run-Rate</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-500 mt-1">
                    {formatMoney(exitMrrMonth12)}
                    <span className="text-xs font-normal text-muted-foreground"> / mo</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Pure monthly passive retainers
                  </div>
                </div>
              </div>
            </div>

            {/* CTA bottom */}
            <div className="mt-8 pt-4 border-t border-subtle/40 space-y-3">
              <Link
                href="/auth?mode=signup"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm shadow-brand-btn transition-all duration-200"
              >
                <span>Find Your Next {formatMoney(upfrontFee)} Lead</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-center text-[11px] text-muted-foreground">
                Zero commission taken • All client revenue is 100% yours
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
