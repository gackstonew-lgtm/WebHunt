"use client";

import React from "react";
import { X, ShieldAlert, CheckCircle2, Globe, ShieldCheck } from "lucide-react";

interface LegalModalProps {
  onClose: () => void;
}

export default function LegalModal({ onClose }: LegalModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#111F1A] border border-[rgba(120,200,170,0.2)] rounded-2xl shadow-2xl overflow-hidden text-[#EAF2EE] max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(120,200,170,0.14)] bg-[#0F1A16]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-[#16302A] text-[#0251B8] border border-[rgba(120,200,170,0.14)]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#EAF2EE] text-base">Worldwide Legal & Compliance Guidelines</h3>
              <p className="text-xs text-[#8AA79A]">Outreach Laws & API Terms of Service</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8AA79A] hover:text-[#EAF2EE] hover:bg-[#16302A] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm leading-relaxed text-[#8AA79A]">
          <div className="p-4 rounded-xl bg-[#0F1A16] border border-[rgba(120,200,170,0.14)] text-xs flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-[#5EBA8C] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#EAF2EE]">100% Zero-Scraping Guarantee:</span> Gacks Leads does NOT scrape LinkedIn, Upwork, or Fiverr. We query official, public APIs (Remotive, Arbeitnow) for remote jobs, and public geodata sources (OpenStreetMap Overpass, Google Places) for local business listings with missing websites.
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-[#EAF2EE] flex items-center space-x-2">
              <Globe className="w-4 h-4 text-[#0251B8]" />
              <span>Worldwide B2B Telemarketing & Outreach Regulations</span>
            </h4>
            <ul className="space-y-2 text-xs text-[#8AA79A] list-disc list-inside">
              <li>
                <strong className="text-[#EAF2EE]">Kenya & East Africa:</strong> B2B commercial outreach to publicly listed business phone numbers is standard practice. Comply with the Kenya Data Protection Act (2019) by immediately honoring opt-out requests.
              </li>
              <li>
                <strong className="text-[#EAF2EE]">United States (TCPA & DNC):</strong> Calling published commercial business lines for B2B offers is permitted. Respect requests to be removed from your calling list and abide by calling hours (8:00 AM – 9:00 PM local time).
              </li>
              <li>
                <strong className="text-[#EAF2EE]">UK & European Union (PECR & GDPR):</strong> Corporate subscribers (limited companies) can be contacted for B2B services, provided an immediate opt-out mechanism is available.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-[#EAF2EE] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#0251B8]" />
              <span>Data Provider Terms of Service</span>
            </h4>
            <ul className="space-y-2 text-xs text-[#8AA79A] list-disc list-inside">
              <li><strong className="text-[#EAF2EE]">OpenStreetMap Overpass:</strong> Used under the Open Database License (ODbL). Queries are cached server-side to prevent server load.</li>
              <li><strong className="text-[#EAF2EE]">Remotive & Arbeitnow:</strong> Queried via official public JSON developer endpoints with user-agent attribution.</li>
              <li><strong className="text-[#EAF2EE]">Google Places API:</strong> Optional; queries are rate-limited and cached according to Google Cloud terms.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[rgba(120,200,170,0.14)] bg-[#0F1A16] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0251B8] hover:bg-[#013F92] text-white font-medium text-xs shadow-md shadow-[#0251B8]/20 transition"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
}
