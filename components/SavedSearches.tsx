"use client";

import React, { useState, useEffect } from "react";
import { History, Search, ArrowRight, Calendar, Compass, Layers, Store, Terminal } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { getStoredSearchHistory, SearchHistoryItem } from "@/lib/search-history-store";

export default function SavedSearches() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    setHistory(getStoredSearchHistory());
  }, []);

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
              Audit past queries, geographical yields, and provider metrics.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-950 text-slate-300 border border-slate-800">
          {history.length} Scans Logged
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((s) => (
          <div
            key={s.id}
            className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 group transition"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded flex items-center space-x-1 ${
                  s.mode === "physical"
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                }`}>
                  {s.mode === "physical" ? <Store className="w-3 h-3" /> : <Terminal className="w-3 h-3" />}
                  <span>{s.mode === "physical" ? "Local Physical" : "Remote Job"}</span>
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {s.provider}
                </span>
              </div>

              <h4 className="font-bold text-white text-base mt-2">
                {s.query}
              </h4>

              <div className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{s.location}</span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Scanned</span>
                  <div className="font-bold text-white">{s.totalFetched}</div>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-semibold">Qualified Leads</span>
                  <div className="font-bold text-emerald-400">{s.qualifiedCount}</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-1 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{formatDate(s.createdAt)}</span>
              </div>

              <Link
                href="/"
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center space-x-1"
              >
                <span>Re-scan</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
