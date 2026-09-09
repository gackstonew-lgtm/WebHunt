"use client";

import React, { useState } from "react";
import { X, Copy, Check, Sparkles, PhoneCall, MessageSquareQuote, Lightbulb } from "lucide-react";
import { PhysicalLead } from "@/lib/types";
import { generatePitchScript } from "@/lib/utils";

interface PitchScriptModalProps {
  lead: PhysicalLead;
  onClose: () => void;
}

export default function PitchScriptModal({ lead, onClose }: PitchScriptModalProps) {
  const [copied, setCopied] = useState(false);
  const script = generatePitchScript(lead);

  const fullScriptText = `COLD CALL SCRIPT FOR ${lead.businessName.toUpperCase()} (${lead.country}):
Phone: ${lead.phoneFormatted || lead.phone}
Target Niche: ${lead.category || "Local Business"}
Location: ${lead.city ? `${lead.city}, ` : ""}${lead.country}

1. OPENER:
${script.opener}

2. THE VALUE HOOK (MISSING WEBSITE / LOST REVENUE):
${script.valueHook}

3. THE SOFT CLOSE:
${script.close}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullScriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0D0D0D] border border-[rgba(228,222,210,0.2)] rounded-3xl shadow-2xl overflow-hidden text-[#F6F4F1] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(228,222,210,0.12)] bg-[#080808]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#F95C4B] text-white shadow-md shadow-[#F95C4B]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-[#F6F4F1] text-base">{lead.businessName}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#161616] text-[#5EBA8C] border border-[rgba(228,222,210,0.12)]">
                  {lead.country}
                </span>
              </div>
              <p className="text-xs text-[#A8A196]">Custom Cold Calling Pitch & Value Proposition</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#A8A196] hover:text-[#F6F4F1] hover:bg-[#161616] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Quick Call Action Strip */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#080808] border border-[rgba(228,222,210,0.12)]">
            <div className="flex items-center space-x-2.5">
              <PhoneCall className="w-4 h-4 text-[#5EBA8C]" />
              <span className="font-mono text-sm font-semibold text-[#F6F4F1]">
                {lead.phoneFormatted || lead.phone}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href={`tel:${lead.phone}`}
                className="px-3.5 py-1.5 rounded-xl bg-[#F95C4B] hover:bg-[#E04838] text-white font-medium text-xs shadow-md shadow-[#F95C4B]/20 transition flex items-center space-x-1"
              >
                <span>Call Business</span>
              </a>
              <button
                onClick={copyToClipboard}
                className="px-3 py-1.5 rounded-xl bg-[#161616] hover:bg-[#161616]/80 text-[#F6F4F1] text-xs font-medium border border-[rgba(228,222,210,0.12)] transition flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#5EBA8C]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Pitch"}</span>
              </button>
            </div>
          </div>

          {/* 3 Step Script Cards */}
          <div className="space-y-3">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-[#080808] border border-[rgba(228,222,210,0.12)] space-y-1.5">
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#F95C4B]">
                <span className="w-5 h-5 rounded-full bg-[#161616] text-[#F6F4F1] border border-[rgba(228,222,210,0.12)] flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>The Opener (Praise & Recognition)</span>
              </div>
              <p className="text-[#F6F4F1] text-xs leading-relaxed italic bg-[#0D0D0D] p-3 rounded-xl border border-[rgba(228,222,210,0.08)]">
                {script.opener}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-[#080808] border border-[rgba(228,222,210,0.12)] space-y-1.5">
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#A8A196]">
                <span className="w-5 h-5 rounded-full bg-[#161616] text-[#F6F4F1] border border-[rgba(228,222,210,0.12)] flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>The Problem Hook (No Website / Missed Traffic)</span>
              </div>
              <p className="text-[#F6F4F1] text-xs leading-relaxed italic bg-[#0D0D0D] p-3 rounded-xl border border-[rgba(228,222,210,0.08)]">
                {script.valueHook}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-[#080808] border border-[rgba(228,222,210,0.12)] space-y-1.5">
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#5EBA8C]">
                <span className="w-5 h-5 rounded-full bg-[#161616] text-[#F6F4F1] border border-[rgba(228,222,210,0.12)] flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>The Soft Close (Free 2-Minute Preview Demo)</span>
              </div>
              <p className="text-[#F6F4F1] text-xs leading-relaxed italic bg-[#0D0D0D] p-3 rounded-xl border border-[rgba(228,222,210,0.08)]">
                {script.close}
              </p>
            </div>
          </div>

          {/* Quick Objection Handling */}
          <div className="p-4 rounded-2xl bg-[#080808] border border-[rgba(228,222,210,0.12)] space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#A8A196]">
              <Lightbulb className="w-4 h-4 text-[#F95C4B]" />
              <span>Overcoming Local Objections</span>
            </div>
            <div className="space-y-2 text-xs text-[#A8A196]">
              <div>
                <span className="font-semibold text-[#F6F4F1]">"We do everything on WhatsApp or Instagram":</span>
                <p className="text-[#A8A196] mt-0.5">
                  "WhatsApp is fantastic for chat, but when people search on Google Maps for your services, having a 1-page website with a direct WhatsApp order button and price list doubles your inquiries."
                </p>
              </div>
              <div>
                <span className="font-semibold text-[#F6F4F1]">"How much does a website cost?":</span>
                <p className="text-[#A8A196] mt-0.5">
                  "We have straightforward packages with zero hidden fees, including mobile optimization, fast hosting, and Google Maps ranking. Let me send over a free preview first so you can see if you like it."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[rgba(228,222,210,0.12)] bg-[#080808] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#161616] hover:bg-[#161616]/80 text-[#F6F4F1] text-xs font-medium border border-[rgba(228,222,210,0.12)] transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
