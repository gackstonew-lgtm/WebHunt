"use client";

import React, { useState } from "react";
import LegalModal from "./LegalModal";

export default function Footer() {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<"privacy" | "terms">("privacy");

  const openLegalModal = (tab: "privacy" | "terms") => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <>
      <footer className="border-t border-white/[0.08] bg-[#08090B] py-6 text-xs text-[#989BA3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>© {new Date().getFullYear()} WebHunt Delta • Worldwide Intelligence Radar</span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-[#989BA3]">
            <button
              onClick={() => openLegalModal("privacy")}
              className="hover:text-[#EEEEEE] transition underline-offset-4 hover:underline focus:outline-none"
            >
              Privacy Policy
            </button>
            <span className="text-white/20">•</span>
            <button
              onClick={() => openLegalModal("terms")}
              className="hover:text-[#EEEEEE] transition underline-offset-4 hover:underline focus:outline-none"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </footer>

      {legalModalOpen && (
        <LegalModal
          initialTab={legalModalTab}
          onClose={() => setLegalModalOpen(false)}
        />
      )}
    </>
  );
}
