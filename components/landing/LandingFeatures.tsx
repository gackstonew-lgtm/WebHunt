"use client";

import React from "react";
import { 
  Store, 
  Terminal, 
  UserCheck, 
  KanbanSquare, 
  Wand2, 
  Download, 
  Smartphone, 
  History,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap
} from "lucide-react";

export default function LandingFeatures() {
  const features = [
    {
      icon: Store,
      title: "Worldwide Physical Radar",
      badge: "Core Engine",
      description: "Scan local markets in Kenya, the US, UK, and 240+ countries. Filter for businesses with active phones but zero recorded website.",
    },
    {
      icon: Terminal,
      title: "Remote Opportunities Radar",
      badge: "Tech Feeds",
      description: "Direct API hooks to Remotive, Arbeitnow, Himalayas, RemoteOK, and WWR to surface remote contracts, engineering gigs, and design roles.",
    },
    {
      icon: UserCheck,
      title: "Verified Decision-Maker Intel",
      badge: "Enrichment",
      description: "Stop speaking to gatekeepers. Get owner names, direct lines, and an AI opportunity brief explaining exactly why the business needs your service.",
    },
    {
      icon: KanbanSquare,
      title: "In-Session CRM Pipeline",
      badge: "Workflow",
      description: "Track leads through custom stages (New → Contacted → Interested → Closed Deal). Keep notes, deal values, and statuses in one place.",
    },
    {
      icon: Wand2,
      title: "Instant Pitch & Script Generator",
      badge: "AI Powered",
      description: "Generate proven cold-call teleprompters, WhatsApp messages, and site prompts ready to paste into Replit, Lovable, v0, or Bolt.",
    },
    {
      icon: Download,
      title: "Fast CSV & Spreadsheet Export",
      badge: "Data Portability",
      description: "Export discovered lead batches with clean formatting. Ready for instant import into Google Sheets, Notion, HubSpot, or your dialer.",
    },
    {
      icon: Smartphone,
      title: "Mobile PWA Architecture",
      badge: "Cross-Device",
      description: "Install WebHunt Delta on your iPhone, Android, iPad, or desktop. Work seamlessly on the go with lightweight offline fallback support.",
    },
    {
      icon: History,
      title: "Search Analytics & History",
      badge: "Analytics",
      description: "Every query is logged to your session history. Re-open past scans, view qualified lead ratios, and refine your prospecting angles.",
    },
  ];

  return (
    <section id="features" className="scroll-mt-20 py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Built for Modern Web Pros &amp; Agencies
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Everything you need to discover untapped clients, pitch them with confidence, and close recurring retainers.
          </p>
        </div>

        {/* Feature Bento Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="flex flex-col justify-between p-6 rounded-3xl bg-surface/60 border border-subtle/70 hover:bg-surface hover:border-strong/60 hover:shadow-xl transition-all duration-200 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-surface-elevated text-primary flex items-center justify-center border border-subtle/50 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-surface-elevated text-muted-foreground border border-subtle/50 uppercase tracking-wider">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-subtle/30 flex items-center text-[11px] font-semibold text-primary">
                  <span>Included in all plans</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
