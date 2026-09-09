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
    exportLeadsToCsv(leads, "gacks-leads-full-pipeline");
  };

  const navLinks = [
    { href: "/", label: "Lead Finder Radar", icon: Radar },
    { href: "/pipeline", label: "Lead Pipeline CRM", icon: KanbanSquare, badge: leadCount > 0 ? leadCount : undefined },
    { href: "/searches", label: "Search History", icon: History },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[rgba(120,200,170,0.14)] bg-[#0B1512]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-[#0251B8] p-0.5 shadow-md shadow-[#0251B8]/20 group-hover:bg-[#013F92] transition-colors duration-200">
                  <div className="w-full h-full bg-[#111F1A] rounded-[10px] flex items-center justify-center">
                    <Radar className="w-5 h-5 text-[#EAF2EE] group-hover:text-[#0251B8] transition-colors" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-lg text-[#EAF2EE] tracking-tight">Gacks Leads</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#16302A] text-[#8AA79A] border border-[rgba(120,200,170,0.14)]">
                      WORLDWIDE
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8AA79A] hidden sm:block">Physical & Online Lead Discovery</p>
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
                        ? "bg-[#16302A] text-[#EAF2EE] border border-[rgba(120,200,170,0.28)] shadow-sm"
                        : "text-[#8AA79A] hover:text-[#EAF2EE] hover:bg-[#16302A]/60"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#0251B8]" : "text-[#8AA79A]"}`} />
                    <span>{link.label}</span>
                    {link.badge !== undefined && (
                      <span className="ml-1.5 px-2 py-0.5 text-xs font-semibold rounded-full bg-[#0251B8] text-white">
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
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#111F1A] text-[#EAF2EE] hover:bg-[#16302A] border border-[rgba(120,200,170,0.14)] transition"
                title="Download in-session leads as CSV"
              >
                <Download className="w-3.5 h-3.5 text-[#8AA79A]" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setShowLegal(true)}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium text-[#8AA79A] hover:text-[#EAF2EE] bg-[#16302A]/50 hover:bg-[#16302A] border border-[rgba(120,200,170,0.14)] rounded-xl transition"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#8AA79A]" />
                <span className="hidden sm:inline">Compliance & ToS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden border-t border-[rgba(120,200,170,0.14)] bg-[#0B1512] px-4 py-2 flex items-center justify-around">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1.5 py-1 px-2.5 rounded-lg text-xs font-medium ${
                  isActive ? "text-[#EAF2EE] bg-[#16302A] font-semibold border border-[rgba(120,200,170,0.2)]" : "text-[#8AA79A]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
                {link.badge !== undefined && (
                  <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-[#0251B8] text-white">
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
