"use client";

import React from "react";
import LandingHeader from "./LandingHeader";
import LandingHero from "./LandingHero";
import LandingMetrics from "./LandingMetrics";
import LandingLoop from "./LandingLoop";
import LandingCompare from "./LandingCompare";
import LandingModes from "./LandingModes";
import LandingCalculator from "./LandingCalculator";
import LandingFeatures from "./LandingFeatures";
import LandingPricing from "./LandingPricing";
import LandingFaq from "./LandingFaq";
import LandingContact from "./LandingContact";
import LandingCta from "./LandingCta";
import LandingFooter from "./LandingFooter";

interface LandingPageProps {
  isAuthenticated?: boolean;
}

export default function LandingPage({ isAuthenticated = false }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* Landing Sticky Navigation */}
      <LandingHeader isAuthenticated={isAuthenticated} />

      <main className="flex-1 w-full">
        {/* 1. Hero with Interactive UI Card Preview */}
        <LandingHero />

        {/* 2. Key Metrics & Niches */}
        <LandingMetrics />

        {/* 3. The 6-Step WebHunt Loop */}
        <LandingLoop />

        {/* 4. Comparison: The Manual Way vs The WebHunt Way */}
        <LandingCompare />

        {/* 5. Dual Modes Deep-Dive (Physical & Online) */}
        <LandingModes />

        {/* 6. Interactive Revenue Potential Simulator */}
        <LandingCalculator />

        {/* 7. Platform Capabilities Bento Grid */}
        <LandingFeatures />

        {/* 8. Transparent Real Pricing ($50/mo, $200/yr) */}
        <LandingPricing isAuthenticated={isAuthenticated} />

        {/* 9. FAQ Accordion */}
        <LandingFaq />

        {/* 10. Direct Contact Form */}
        <LandingContact />

        {/* 11. High-Impact Closing CTA Banner */}
        <LandingCta />
      </main>

      {/* Landing Comprehensive Footer */}
      <LandingFooter />
    </div>
  );
}
