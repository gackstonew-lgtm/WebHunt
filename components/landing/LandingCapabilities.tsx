"use client";

import React from "react";
import { Radar, Globe, LayoutDashboard } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export default function LandingCapabilities() {
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>({ threshold: 0.1 });

  const capabilities = [
    {
      id: "physical",
      icon: Radar,
      title: "Physical Radar",
      description: "Discover nearby businesses and potential local opportunities.",
    },
    {
      id: "online",
      icon: Globe,
      title: "Online Radar",
      description: "Find remote opportunities from supported sources.",
    },
    {
      id: "workspace",
      icon: LayoutDashboard,
      title: "Opportunity Workspace",
      description: "Review opportunities and create grounded proposals from verified profile information.",
    },
  ];

  return (
    <section 
      id="capabilities" 
      ref={sectionRef}
      className="py-16 sm:py-24 bg-surface-subtle border-y border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div 
          className={`text-center max-w-2xl mx-auto mb-12 space-y-3 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Core Capabilities
          </h2>
          <p className="text-sm sm:text-base font-medium text-muted-foreground">
            Everything you need to discover, evaluate, and act on web opportunities.
          </p>
        </div>

        {/* 3 Core Capability Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {capabilities.map((cap, index) => {
            const Icon = cap.icon;
            const delayClass = 
              index === 0 ? "delay-100" : index === 1 ? "delay-200" : "delay-300";

            return (
              <div
                key={cap.id}
                className={`p-6 sm:p-8 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-all duration-500 shadow-xs group ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                } ${delayClass}`}
              >
                <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 tracking-tight">
                  {cap.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {cap.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
