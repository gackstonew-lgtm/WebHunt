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
  Sparkles,
  Store,
  Terminal,
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
    // Initial read
    const stored = getStoredPipelineLeads();
    setLeadCount(stored.length);

    // Polling / custom event listener
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
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Radar className="w-5 h-5 text-cyan-400 group-hover:rotate-45 transition-transform duration-500" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-lg text-white tracking-tight">Gacks Leads</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      WORLDWIDE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 hidden sm:block">Physical & Online Lead Radar</p>
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
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm"
                        : "text-slate-300 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                    <span>{link.label}</span>
                    {link.badge !== undefined && (
                      <span className="ml-1.5 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-600 text-white">
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
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-700 transition"
                title="Download in-session leads as CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setShowLegal(true)}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Compliance & ToS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-2 flex items-center justify-around">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1.5 py-1 px-2.5 rounded-md text-xs font-medium ${
                  isActive ? "text-blue-400 bg-blue-500/10 font-semibold" : "text-slate-400"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
                {link.badge !== undefined && (
                  <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-blue-600 text-white">
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
