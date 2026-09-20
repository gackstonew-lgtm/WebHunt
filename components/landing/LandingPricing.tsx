"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  CreditCard, 
  Smartphone,
  Crown
} from "lucide-react";

interface LandingPricingProps {
  isAuthenticated?: boolean;
}

export default function LandingPricing({ isAuthenticated = false }: LandingPricingProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const planFeatures = [
    "Full Physical Radar access across 170+ trades",
    "Worldwide coverage (Kenya, US, UK, Canada & 240+ countries)",
    "Remote Tech Radar (Remotive, Arbeitnow, Himalayas, etc.)",
    "Verified decision-maker contact details & direct phone",
    "AI Opportunity Brief & Cold-Call Teleprompters",
    "In-Session Kanban Pipeline CRM",
    "Unlimited lead scans & 1-Click CSV exports",
    "PWA Mobile & Desktop installability",
    "M-Pesa, Credit/Debit Card & Bank Transfer checkout",
  ];

  const getCtaLink = (plan: "monthly" | "annual") => {
    if (isAuthenticated) {
      return `/subscription?plan=${plan}`;
    }
    return `/auth?mode=signup&returnUrl=${encodeURIComponent(`/subscription?plan=${plan}`)}`;
  };

  return (
    <section id="pricing" className="scroll-mt-20 py-20 sm:py-28 bg-surface/30 border-y border-subtle/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Simple, Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Invest in Your Pipeline. Land More Clients.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Close a single web development deal, and WebHunt Delta pays for itself many times over. No hidden fees, no per-lead micro-charges.
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-surface border border-subtle/60 shadow-sm mt-4">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                billingCycle === "monthly"
                  ? "bg-surface-elevated text-foreground shadow-xs border border-subtle/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                billingCycle === "annual"
                  ? "bg-primary text-primary-foreground shadow-brand-btn"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Annual Pass</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-black uppercase">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-14 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Monthly Plan Card */}
          <div className="rounded-3xl border border-subtle/70 bg-surface/70 p-6 sm:p-8 flex flex-col justify-between shadow-lg relative">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-subtle/40">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Monthly Access</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Flexible month-to-month prospecting</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-surface-elevated text-muted-foreground text-[10px] font-bold uppercase border border-subtle/50">
                  Monthly
                </span>
              </div>

              <div className="flex items-baseline space-x-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">$50</span>
                <span className="text-sm font-semibold text-muted-foreground">/ month</span>
              </div>

              <p className="text-xs text-muted-foreground">
                Billed monthly. Cancel anytime with no long-term commitment.
              </p>

              <div className="space-y-3 pt-2">
                {planFeatures.slice(0, 6).map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-foreground/90">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-subtle/40">
              <Link
                href={getCtaLink("monthly")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-elevated hover:bg-surface text-foreground font-bold text-xs border border-subtle/70 transition-all duration-200"
              >
                <span>Choose Monthly Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Annual Pass Card (Featured) */}
          <div className="rounded-3xl border border-primary/40 bg-surface p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative ring-1 ring-primary/25">
            {/* Top highlight pill */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md">
              <Crown className="w-3.5 h-3.5" />
              <span>Most Popular Choice</span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-subtle/40">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Annual Pass</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Maximum savings for serious web pros</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-primary/15 text-primary text-[10px] font-bold uppercase border border-primary/25">
                  Save 20%
                </span>
              </div>

              <div className="flex items-baseline space-x-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">$200</span>
                <span className="text-sm font-semibold text-muted-foreground">/ year</span>
              </div>

              <p className="text-xs text-emerald-500 font-semibold">
                Only ~$16.67/month effective cost • Saves $400 over monthly billing!
              </p>

              <div className="space-y-3 pt-2">
                {planFeatures.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-foreground/90">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-subtle/40">
              <Link
                href={getCtaLink("annual")}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs shadow-brand-btn transition-all duration-200"
              >
                <span>Get Annual Pass — Instant Access</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Security and Payment Badges */}
        <div className="mt-12 text-center max-w-xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Bank-Grade Security
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Smartphone className="w-4 h-4 text-primary" />
              M-Pesa Supported
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CreditCard className="w-4 h-4 text-primary" />
              Cards &amp; Bank Transfer
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Powered by Kora checkout infrastructure. Instant account provisioning upon completed payment.
          </p>
        </div>

      </div>
    </section>
  );
}
