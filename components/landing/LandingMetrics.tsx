"use client";

import React from "react";
import { 
  Building, 
  Globe2, 
  Target, 
  Zap, 
  CheckCircle2, 
  Sparkles,
  Shield
} from "lucide-react";

export default function LandingMetrics() {
  const stats = [
    {
      value: "170+",
      label: "Industries & Local Trades",
      description: "Plumbing, auto repair, clinics, roofing, restaurants & more",
      icon: Building,
    },
    {
      value: "240+",
      label: "Countries & Global Metros",
      description: "Comprehensive coverage across Kenya, US, UK, Canada & worldwide",
      icon: Globe2,
    },
    {
      value: "98%",
      label: "Contact Data Precision",
      description: "Direct verified phone numbers & decision-maker identity",
      icon: Target,
    },
    {
      value: "$0",
      label: "Cost to Start Prospecting",
      description: "Free in-session radar scans with zero card required upfront",
      icon: Zap,
    },
  ];

  const niches = [
    "Auto Repair & Mechanics",
    "Dentists & Clinics",
    "Roofing & Construction",
    "Fine Dining & Bakeries",
    "Law Firms & Notaries",
    "Salons & Barbershops",
    "HVAC & Electricians",
    "Next.js & React Remote",
  ];

  return (
    <section className="border-y border-subtle/60 bg-surface/40 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className="flex flex-col items-center sm:items-start p-4 sm:p-6 rounded-2xl bg-surface/60 border border-subtle/40 hover:border-subtle hover:bg-surface transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-foreground mt-1">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground mt-1 text-center sm:text-left">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* Niche Trust Chips */}
        <div className="mt-12 pt-8 border-t border-subtle/40 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Scouting Opportunities Across 170+ High-Ticket Niches
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {niches.map((niche, i) => (
              <span 
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-subtle/60 text-xs font-semibold text-foreground/80 hover:border-primary/40 hover:text-foreground transition-all shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <span>{niche}</span>
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
