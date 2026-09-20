"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function LandingFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does WebHunt Delta find businesses without websites?",
      a: "WebHunt Delta continuously queries global commercial registry endpoints, Google Business profiles, and local directories across 170+ trade classifications. We verify whether a domain exists, check for broken URLs or placeholder pages, and cross-reference phone numbers and physical addresses to deliver verified, high-intent leads ready for website pitches.",
    },
    {
      q: "What niches and trades can I search for?",
      a: "You can prospect across 170+ physical trade categories including auto repair, plumbing, HVAC, roofing, dental clinics, barbershops, landscaping, restaurants, bakeries, law offices, and specialty contractors. In Online Radar mode, you can query remote software engineering, UI/UX, AI, and copywriting gigs.",
    },
    {
      q: "How does the Online Radar mode work for remote gigs?",
      a: "Online Radar connects directly to public developer and remote work feeds (including Remotive, Arbeitnow, Himalayas, RemoteOK, and WeWorkRemotely). You can filter contracts by technology keyword (React, Next.js, Python, Tailwind, etc.) and generate instant custom proposals with our built-in AI assistant.",
    },
    {
      q: "Which countries and locations are supported?",
      a: "WebHunt Delta covers 240+ countries and thousands of metropolitan areas. Whether you are hunting local trades in Nairobi, Mombasa, or Kisumu, or targeting high-ticket clients across the United States, United Kingdom, Canada, or Australia, our radar scans worldwide.",
    },
    {
      q: "How does the buy-likelihood Opportunity Score work?",
      a: "Our scoring engine calculates a 0-100 rating based on review volume, star ratings, business age, and the presence of direct owner contact channels. A business with a 4.8-star rating, 100+ positive reviews, and no website scores in the 90s because they have proven customer demand but lose after-hours business due to missing web visibility.",
    },
    {
      q: "Can I export leads to CSV or use my own CRM?",
      a: "Yes! WebHunt Delta includes both an in-session Kanban CRM pipeline and a 1-click CSV export feature. You can download all discovered leads with business names, phone numbers, trade classifications, locations, and notes formatted for instant import into Google Sheets, Excel, Notion, or HubSpot.",
    },
    {
      q: "What payment methods are supported for subscriptions?",
      a: "We accept M-Pesa mobile money, major Credit and Debit cards (Visa, MasterCard), and direct Bank Transfers securely processed via Kora infrastructure. Your subscription is activated immediately upon payment completion.",
    },
    {
      q: "Can I install WebHunt Delta on my phone or tablet?",
      a: "Yes! WebHunt Delta is a full Progressive Web App (PWA). You can install it directly onto your iOS device (via Safari 'Add to Home Screen'), Android phone (via Chrome 'Install'), or Chromium desktop browser for a fast, full-screen native app experience.",
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="scroll-mt-20 py-20 sm:py-28 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Everything You Need to Know
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Have questions about WebHunt Delta? Here are the most common answers about our data, lead radar, and subscription.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="mt-14 space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-subtle/70 bg-surface/60 overflow-hidden transition-all duration-200 hover:border-subtle"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-foreground pr-4">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl bg-surface-elevated flex items-center justify-center shrink-0 border border-subtle/50 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-primary border-primary/30" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-subtle/30 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
