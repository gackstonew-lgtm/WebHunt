"use client";

import React from "react";
import { History, Search, ArrowRight, Calendar, Compass, Layers, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface SavedSearchesProps {
  searches: Array<{
    id: string;
    niche: string;
    location: string;
    provider: string;
    radius: number;
    totalFetched: number;
    qualifiedLeads: number;
    createdAt: string | Date;
  }>;
  onRerunSearch?: (niche: string, location: string, provider: string) => void;
}

export default function SavedSearches({ searches, onRerunSearch }: SavedSearchesProps) {
  if (!searches || searches.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
          <History className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-white">No search history yet</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Run your first lead discovery radar scan on the home page to start logging queries and lead metrics.
        </p>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition mt-2"
        >
          <span>Go to Lead Radar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Historical Radar Scans</h3>
            <p className="text-xs text-slate-400">
              Audit past search parameters, provider performance, and lead yields.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-950 text-slate-300 border border-slate-800">
          {searches.length} Scans Logged
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searches.map((s) => (
          <div
            key={s.id}
            className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 group transition"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  {s.niche}
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {s.provider}
                </span>
              </div>

              <h4 className="font-bold text-white text-base mt-1 flex items-center space-x-1.5">
                <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{s.location}</span>
              </h4>

              <div className="mt-3 grid grid-cols-2 gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Scanned</span>
                  <div className="font-bold text-white">{s.totalFetched}</div>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-semibold">Qualified Leads</span>
                  <div className="font-bold text-emerald-400">{s.qualifiedLeads}</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-1 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{formatDate(s.createdAt)}</span>
              </div>

              {onRerunSearch ? (
                <button
                  onClick={() => onRerunSearch(s.niche, s.location, s.provider)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center space-x-1"
                >
                  <span>Re-scan</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ) : (
                <Link
                  href={`/?niche=${encodeURIComponent(s.niche)}&location=${encodeURIComponent(s.location)}`}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center space-x-1"
                >
                  <span>Re-scan</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
