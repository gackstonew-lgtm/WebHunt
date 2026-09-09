"use client";

import React, { useState } from "react";
import { X, Copy, Check, Sparkles, PhoneCall, MessageSquareQuote, Lightbulb, ShieldCheck } from "lucide-react";
import { LeadItem } from "@/lib/types";
import { generatePitchScript } from "@/lib/utils";

interface PitchScriptModalProps {
  lead: LeadItem;
  onClose: () => void;
}

export default function PitchScriptModal({ lead, onClose }: PitchScriptModalProps) {
  const [copied, setCopied] = useState(false);
  const script = generatePitchScript(lead);

  const fullScriptText = `COLD CALL SCRIPT FOR ${lead.businessName.toUpperCase()}:
Phone: ${lead.phoneFormatted || lead.phone}
Target Niche: ${lead.category || "Local Business"}

1. OPENER:
${script.opener}

2. THE VALUE HOOK (MISSING WEBSITE / LOST CUSTOMERS):
${script.valueHook}

3. THE SOFT CLOSE:
${script.close}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullScriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base">{lead.businessName}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  No Website Lead
                </span>
              </div>
              <p className="text-xs text-slate-400">Custom Pitch Script & Cold Calling Strategy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Script Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Quick Call Action Strip */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center space-x-2.5">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-sm font-semibold text-white">
                {lead.phoneFormatted || lead.phone}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href={`tel:${lead.phone}`}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md shadow-emerald-600/20 transition flex items-center space-x-1"
              >
                <span>Call Business</span>
              </a>
              <button
                onClick={copyToClipboard}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Full Script"}</span>
              </button>
            </div>
          </div>

          {/* 3 Step Script Cards */}
          <div className="space-y-3">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>The Opener (Pattern Interrupt & Praise)</span>
              </div>
              <p className="text-slate-200 text-xs leading-relaxed italic bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                {script.opener}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>The Problem Hook (Missing Website / Lost Customers)</span>
              </div>
              <p className="text-slate-200 text-xs leading-relaxed italic bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                {script.valueHook}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>The Soft Close (Free No-Risk Video Mockup)</span>
              </div>
              <p className="text-slate-200 text-xs leading-relaxed italic bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                {script.close}
              </p>
            </div>
          </div>

          {/* Quick Objection Handling */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400">
              <Lightbulb className="w-4 h-4" />
              <span>Handling Top Objections</span>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div>
                <span className="font-semibold text-white">"We only get business from word-of-mouth":</span>
                <p className="text-slate-400 mt-0.5">
                  "That makes complete sense! A simple website isn't just for ads—it's so that when people hear your name, they can immediately tap to call or see your license without getting confused by competitors."
                </p>
              </div>
              <div>
                <span className="font-semibold text-white">"We already have a Facebook page":</span>
                <p className="text-slate-400 mt-0.5">
                  "Facebook is great for social, but 85% of people searching on Google Maps click a direct website link first. Having your own custom domain establishes credibility and captures direct phone bookings."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
