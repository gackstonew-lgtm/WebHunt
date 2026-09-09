"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Radar, 
  KanbanSquare, 
  History, 
  ShieldAlert, 
  Download, 
  Globe
} from "lucide-react";
import LegalModal from "./LegalModal";
import { getStoredPipelineLeads } from "@/lib/pipeline-store";
import { exportLeadsToCsv } from "@/lib/export";

export default function Navbar() {
  const pathname = usePathname();
  const [showLegal, setShowLegal] = useState(false);
  const [leadCount, setLeadCount] = useState(0);

  useEffect(() => {
    const stored = getStoredPipelineLeads();
    setLeadCount(stored.length);

    const handleStorage = () => {
      const updated = getStoredPipelineLeads();
      setLeadCount(updated.length);
    };

    window.addEventListener("storage", handleStorage);
    const interval = setInterval(handleStorage, 2000);
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  const handleExportAll = () => {
    const leads = getStoredPipelineLeads();
    if (leads.length === 0) {
      alert("No leads currently in pipeline to export. Discover and save leads first!");
      return;
    }
    exportLeadsToCsv(leads, "webhunt-leads-full-pipeline");
  };

  const navLinks = [
    { href: "/", label: "Lead Finder Radar", icon: Radar },
    { href: "/pipeline", label: "Lead Pipeline CRM", icon: KanbanSquare, badge: leadCount > 0 ? leadCount : undefined },
    { href: "/searches", label: "Search History", icon: History },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[rgba(228,222,210,0.12)] bg-[#000000]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-[#F95C4B] p-0.5 shadow-md shadow-[#F95C4B]/20 group-hover:bg-[#E04838] transition-colors duration-200">
                  <div className="w-full h-full bg-[#0D0D0D] rounded-[10px] flex items-center justify-center">
                    <Radar className="w-5 h-5 text-[#F6F4F1] group-hover:text-[#F95C4B] transition-colors" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-lg text-[#F6F4F1] tracking-tight">WebHunt</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#161616] text-[#A8A196] border border-[rgba(228,222,210,0.12)]">
                      WORLDWIDE
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A8A196] hidden sm:block">Physical & Online Lead Discovery</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[#161616] text-[#F6F4F1] border border-[rgba(249,92,75,0.4)] shadow-sm"
                        : "text-[#A8A196] hover:text-[#F6F4F1] hover:bg-[#161616]/60"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#F95C4B]" : "text-[#A8A196]"}`} />
                    <span>{link.label}</span>
                    {link.badge !== undefined && (
                      <span className="ml-1.5 px-2 py-0.5 text-xs font-semibold rounded-full bg-[#F95C4B] text-white">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportAll}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#0D0D0D] text-[#F6F4F1] hover:bg-[#161616] border border-[rgba(228,222,210,0.12)] transition"
                title="Download in-session leads as CSV"
              >
                <Download className="w-3.5 h-3.5 text-[#A8A196]" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setShowLegal(true)}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium text-[#A8A196] hover:text-[#F6F4F1] bg-[#161616]/50 hover:bg-[#161616] border border-[rgba(228,222,210,0.12)] rounded-xl transition"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#A8A196]" />
                <span className="hidden sm:inline">Compliance & ToS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden border-t border-[rgba(228,222,210,0.12)] bg-[#000000] px-4 py-2 flex items-center justify-around">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1.5 py-1 px-2.5 rounded-lg text-xs font-medium ${
                  isActive ? "text-[#F6F4F1] bg-[#161616] font-semibold border border-[rgba(249,92,75,0.4)]" : "text-[#A8A196]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
                {link.badge !== undefined && (
                  <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-[#F95C4B] text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </header>

      {showLegal && <LegalModal onClose={() => setShowLegal(false)} />}
    </>
  );
}
