"use client";

import React, { useState } from "react";
import { Search, Filter, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export default function LandingWorkflow() {
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>({ threshold: 0.1 });
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      step: 1,
      icon: Search,
      title: "1. Discover",
      subtitle: "Scan Physical & Remote Sources",
      description: "Query nearby physical business trades with zero website on record or tap into live remote contract feeds across 240+ countries.",
      detail: "Indexes 170+ physical trade categories and aggregates live developer feeds in real time."
    },
    {
      step: 2,
      icon: Filter,
      title: "2. Analyze",
      subtitle: "Evaluate Buy Intent & Contact Data",
      description: "Filter leads by opportunity likelihood score, business age, phone availability, and verified decision-maker information.",
      detail: "Scores each opportunity from 0-100 based on digital presence gaps and contactability."
    },
    {
      step: 3,
      icon: FileText,
      title: "3. Grounded Proposals",
      subtitle: "Generate Verified Pitches",
      description: "Produce grounded proposals and structured pitches built directly from authentic profile information.",
      detail: "Strict zero-hallucination proposal generation using verified workspace inputs."
    }
  ];

  return (
    <section 
      id="workflow" 
      ref={sectionRef}
      className="py-16 sm:py-24 bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div 
          className={`text-center max-w-2xl mx-auto mb-14 space-y-3 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Product Workflow
          </h2>
          <p className="text-sm sm:text-base font-medium text-muted-foreground">
            From raw intelligence to sent proposal in three clear steps.
          </p>
        </div>

        {/* 3 Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isCurrent = activeStep === s.step;
            const delayClass = idx === 0 ? "delay-100" : idx === 1 ? "delay-200" : "delay-300";

            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`text-left p-6 rounded-2xl border transition-all duration-300 ${
                  isCurrent
                    ? "bg-surface border-primary ring-1 ring-primary shadow-sm"
                    : "bg-surface-elevated/40 border-border hover:border-border-strong hover:bg-surface"
                } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${delayClass}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border font-bold text-sm ${
                    isCurrent 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-surface border-border text-muted-foreground"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
                    isCurrent
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-background text-muted-foreground border-border"
                  }`}>
                    STEP 0{s.step}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground mb-1">
                  {s.title}
                </h3>
                <p className="text-xs font-semibold text-primary mb-2">
                  {s.subtitle}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {s.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Visual Explanation Display */}
        <div 
          className={`p-6 sm:p-8 rounded-2xl bg-surface border border-border transition-all duration-700 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Active Step Focus</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-extrabold text-foreground">
                {steps[activeStep - 1].subtitle}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {steps[activeStep - 1].detail}
              </p>
            </div>

            <div className="w-full lg:w-auto flex items-center justify-center gap-2 p-4 rounded-xl bg-surface-elevated border border-border">
              <div className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeStep === 1 ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground border border-border"
              }`}>
                1. Discover
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeStep === 2 ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground border border-border"
              }`}>
                2. Analyze
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeStep === 3 ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground border border-border"
              }`}>
                3. Proposal
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
