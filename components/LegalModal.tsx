"use client";

import React from "react";
import { X, ShieldAlert, CheckCircle2, Globe, ShieldCheck } from "lucide-react";

interface LegalModalProps {
  onClose: () => void;
}

export default function LegalModal({ onClose }: LegalModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0D0D0D] border border-[rgba(228,222,210,0.14)] rounded-3xl shadow-2xl overflow-hidden text-[#F6F4F1] max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(228,222,210,0.10)] bg-[#080808]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#161616] text-[#F95C4B] border border-[rgba(228,222,210,0.10)]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#F6F4F1] text-base">Worldwide Legal & Compliance Guidelines</h3>
              <p className="text-xs text-[#A8A196]">Outreach Laws & Data Provenance Terms</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#A8A196] hover:text-[#F6F4F1] hover:bg-[#161616] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm leading-relaxed text-[#A8A196]">
          <div className="p-4 rounded-2xl bg-[#080808] border border-[rgba(228,222,210,0.10)] text-xs flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#F6F4F1]">100% Genuine, Verifiable Data Guarantee:</span> WebHunt only displays real, traceable businesses and job opportunities. We query official, public developer APIs (Remotive, Arbeitnow, Himalayas, RemoteOK), public feeds (WeWorkRemotely, Jobspresso), and global open geodata (OpenStreetMap Overpass, Google Places, Yelp, Foursquare). No fake data or synthetic fallbacks are ever generated.
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-[#F6F4F1] flex items-center space-x-2">
              <Globe className="w-4 h-4 text-[#F95C4B]" />
              <span>Worldwide B2B Telemarketing & Outreach Regulations</span>
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A196] list-disc list-inside">
              <li>
                <strong className="text-[#F6F4F1]">Kenya & East Africa:</strong> B2B commercial outreach to publicly listed business phone numbers is standard practice. Comply with the Kenya Data Protection Act (2019) by immediately honoring opt-out requests.
              </li>
              <li>
                <strong className="text-[#F6F4F1]">United States (TCPA & DNC):</strong> Calling published commercial business lines for B2B offers is permitted. Respect requests to be removed from your calling list and abide by calling hours (8:00 AM – 9:00 PM local time).
              </li>
              <li>
                <strong className="text-[#F6F4F1]">UK & European Union (PECR & GDPR):</strong> Corporate subscribers (limited companies) can be contacted for B2B services, provided an immediate opt-out mechanism is available.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-[#F6F4F1] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#F95C4B]" />
              <span>Data Provider Terms of Service</span>
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A196] list-disc list-inside">
              <li><strong className="text-[#F6F4F1]">OpenStreetMap Overpass:</strong> Used under the Open Database License (ODbL). Queries are cached server-side to prevent server load.</li>
              <li><strong className="text-[#F6F4F1]">Remotive, Arbeitnow, Himalayas & RemoteOK:</strong> Queried via official public JSON developer endpoints with user-agent attribution.</li>
              <li><strong className="text-[#F6F4F1]">We Work Remotely & Jobspresso:</strong> Syndicated via official public RSS feeds.</li>
              <li><strong className="text-[#F6F4F1]">Google Places, Yelp & Foursquare:</strong> Optional commercial APIs; requests are rate-limited and cached according to developer terms.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[rgba(228,222,210,0.10)] bg-[#080808] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#F95C4B] hover:bg-[#E04838] text-white font-semibold text-xs shadow-md shadow-[#F95C4B]/20 transition"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
}
