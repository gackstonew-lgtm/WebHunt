"use client";

import React from "react";
import { X, ShieldAlert, CheckCircle2, AlertTriangle, ShieldCheck, Globe } from "lucide-react";

interface LegalModalProps {
  onClose: () => void;
}

export default function LegalModal({ onClose }: LegalModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-200 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Worldwide Legal & Compliance Guidelines</h3>
              <p className="text-xs text-slate-400">Outreach Laws & API Terms of Service</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm leading-relaxed text-slate-300">
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/50 text-blue-200 text-xs flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">100% Zero-Scraping Guarantee:</span> Gacks Leads does NOT scrape LinkedIn, Upwork, or Fiverr. We query official, public APIs (Remotive, Arbeitnow) for remote jobs, and public geodata sources (OpenStreetMap Overpass, Google Places) for local business listings with missing websites.
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-white flex items-center space-x-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Worldwide B2B Telemarketing & Outreach Regulations</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
              <li>
                <strong className="text-white">Kenya & East Africa:</strong> B2B commercial outreach to publicly listed business phone numbers is standard practice. Comply with the Kenya Data Protection Act (2019) by immediately honoring opt-out requests.
              </li>
              <li>
                <strong className="text-white">United States (TCPA & DNC):</strong> Calling published commercial business lines for B2B offers is permitted. Respect requests to be removed from your calling list and abide by calling hours (8:00 AM – 9:00 PM local time).
              </li>
              <li>
                <strong className="text-white">UK & European Union (PECR & GDPR):</strong> Corporate subscribers (limited companies) can be contacted for B2B services, provided an immediate opt-out mechanism is available.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Data Provider Terms of Service</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
              <li><strong className="text-white">OpenStreetMap Overpass:</strong> Used under the Open Database License (ODbL). Queries are cached server-side to prevent server load.</li>
              <li><strong className="text-white">Remotive & Arbeitnow:</strong> Queried via official public JSON developer endpoints with user-agent attribution.</li>
              <li><strong className="text-white">Google Places API:</strong> Optional; queries are rate-limited and cached according to Google Cloud terms.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-500/20 transition"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
}
