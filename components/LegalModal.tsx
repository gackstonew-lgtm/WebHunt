"use client";

import React from "react";
import { X, ShieldAlert, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";

interface LegalModalProps {
  onClose: () => void;
}

export default function LegalModal({ onClose }: LegalModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-200 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Legal Compliance & Cold Outreach Guidelines</h3>
              <p className="text-xs text-slate-400">TCPA, Do-Not-Call (DNC) Registry & Provider API ToS</p>
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
              <span className="font-semibold text-white">Why Gacks Leads is Legal & Safe:</span> We query official data sources (Google Places API, Yelp Fusion, OpenStreetMap) and filter for businesses where the owner has not registered a website. We do not engage in unauthorized bulk web scraping.
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-white flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Telemarketing & B2B Phone Outreach Rules</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
              <li>
                <strong className="text-white">B2B Exemption:</strong> Calling a commercial business main line to offer B2B services (e.g. web design, POS systems) is generally permitted in the US, but you must respect explicit requests to not be called back.
              </li>
              <li>
                <strong className="text-white">National Do-Not-Call (DNC) Registry:</strong> When calling cell phones or sole proprietors, ensure compliance with national/state DNC registries and maintain an internal do-not-call list.
              </li>
              <li>
                <strong className="text-white">Calling Hours:</strong> Telemarketing calls are restricted in most jurisdictions to between 8:00 AM and 9:00 PM local recipient time.
              </li>
              <li>
                <strong className="text-white">Immediate Identification:</strong> Always state your name, your company name, and the purpose of your call at the beginning.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-white">Provider Terms of Service</h4>
            <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
              <li>Google Places API: API responses are cached locally to respect Google rate limits and quota terms.</li>
              <li>Yelp Fusion API: Content is displayed in compliance with Yelp developer terms.</li>
              <li>OpenStreetMap: Data is licensed under Open Database License (ODbL).</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
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
