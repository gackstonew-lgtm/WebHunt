"use client";

import React from "react";
import LandingHeader from "./LandingHeader";
import LandingHero from "./LandingHero";
import LandingCapabilities from "./LandingCapabilities";
import LandingWorkflow from "./LandingWorkflow";
import LandingCta from "./LandingCta";
import LandingFooter from "./LandingFooter";

interface LandingPageProps {
  isAuthenticated?: boolean;
}

export default function LandingPage({ isAuthenticated = false }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* 1. Sticky Navigation */}
      <LandingHeader isAuthenticated={isAuthenticated} />

      <main className="flex-1 w-full">
        {/* 2. Hero with Integrated Live Remote Sources Logo Banner & UI Visual */}
        <LandingHero />

        {/* 3. Core Capabilities */}
        <LandingCapabilities />

        {/* 4. Product Workflow */}
        <LandingWorkflow />

        {/* 5. Final CTA */}
        <LandingCta />
      </main>

      {/* 6. Minimal Footer */}
      <LandingFooter />
    </div>
  );
}
