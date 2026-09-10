"use client";

import React, { useState, useEffect } from "react";
import SearchForm from "@/components/SearchForm";
import ResultsTable from "@/components/ResultsTable";
import { LeadItem, SearchParams, SearchResult } from "@/lib/types";
import { executeSearchAction, getProviderStatusesAction } from "./actions/search";
import { useLeadPipeline } from "@/lib/pipeline-store";
import { logSearchHistory } from "@/lib/search-history-store";
import { AlertCircle, Store, Terminal, Layers } from "lucide-react";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [providersStatus, setProvidersStatus] = useState<{
    physical: { key: string; name: string; configured: boolean; isFree: boolean }[];
    online: { key: string; name: string; configured: boolean; isFree: boolean }[];
  }>({
    physical: [],
    online: [],
  });

  const { leads: pipelineLeads, saveLead, bulkSaveLeads } = useLeadPipeline();

  const savedLeadIds = new Set(pipelineLeads.map((l) => l.id));

  useEffect(() => {
    async function loadStatus() {
      try {
        const statuses = await getProviderStatusesAction();
        setProvidersStatus(statuses);
      } catch (err) {
        console.warn(err);
      }
    }
    loadStatus();
  }, []);

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await executeSearchAction(params);
      if (res.success && res.data) {
        setSearchResult(res.data);
        // Log to client search history
        logSearchHistory({
          mode: res.data.mode,
          query: res.data.query,
          location: res.data.location,
          provider: res.data.provider,
          totalFetched: res.data.totalFetched,
          qualifiedCount: res.data.qualifiedCount,
        });
      } else {
        setErrorMessage(res.error || "No leads found matching your search parameters.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to execute lead discovery search.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Search Input Hero Form */}
      <SearchForm
        onSearch={handleSearch}
        isLoading={isLoading}
        providersStatus={providersStatus}
      />

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-red-500/30 text-red-300 text-xs flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Results View */}
      {searchResult ? (
        <ResultsTable
          searchResult={searchResult}
          onSaveLead={saveLead}
          onBulkSave={bulkSaveLeads}
          savedLeadIds={savedLeadIds}
        />
      ) : (
        /* Feature Highlights Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-[#0D0D0D] border border-[rgba(248,243,240,0.12)] rounded-3xl p-6 space-y-3 hover:border-[rgba(248,243,240,0.22)] transition">
            <div className="w-10 h-10 rounded-2xl bg-[#161616] border border-[rgba(248,243,240,0.12)] text-[#0048BB] flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#F8F3F0] text-base">Worldwide Physical Radar</h3>
            <p className="text-xs text-[#A8A196] leading-relaxed">
              Find local businesses across Kenya and 240+ countries that have an active phone number but zero website on record to pitch custom websites & POS systems.
            </p>
          </div>

          <div className="bg-[#0D0D0D] border border-[rgba(248,243,240,0.12)] rounded-3xl p-6 space-y-3 hover:border-[rgba(248,243,240,0.22)] transition">
            <div className="w-10 h-10 rounded-2xl bg-[#161616] border border-[rgba(248,243,240,0.12)] text-[#0048BB] flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#F8F3F0] text-base">Remote Opportunities Radar</h3>
            <p className="text-xs text-[#A8A196] leading-relaxed">
              Query official public developer endpoints (Remotive, Arbeitnow, Himalayas, RemoteOK, WWR) for genuine remote software, writing, design, and AI gigs.
            </p>
          </div>

          <div className="bg-[#0D0D0D] border border-[rgba(248,243,240,0.12)] rounded-3xl p-6 space-y-3 hover:border-[rgba(248,243,240,0.22)] transition">
            <div className="w-10 h-10 rounded-2xl bg-[#161616] border border-[rgba(248,243,240,0.12)] text-[#0048BB] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#F8F3F0] text-base">In-Session Pipeline CRM</h3>
            <p className="text-xs text-[#A8A196] leading-relaxed">
              Track outreach stages (New ➔ Contacted ➔ Interested ➔ Closed), generate customized pitch scripts & job proposals, and export to CSV instantly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
