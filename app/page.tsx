"use client";

import React, { useState, useEffect } from "react";
import SearchForm from "@/components/SearchForm";
import ResultsTable from "@/components/ResultsTable";
import { LeadItem, PipelineStatus, SearchParams, SearchResult } from "@/lib/types";
import { executeSearchAction, getProvidersStatusAction } from "./actions/search";
import { bulkSaveLeadsAction, saveLeadToPipelineAction, updateLeadStatusAction } from "./actions/leads";
import { Sparkles, PhoneCall, CheckCircle2, ShieldCheck, Zap, Layers, AlertCircle } from "lucide-react";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [providersStatus, setProvidersStatus] = useState<
    { key: string; name: string; configured: boolean; isFree: boolean }[]
  >([]);

  useEffect(() => {
    async function loadStatus() {
      try {
        const statuses = await getProvidersStatusAction();
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
      } else {
        setErrorMessage(res.error || "No leads found matching your criteria.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to execute search.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLead = async (lead: LeadItem) => {
    await saveLeadToPipelineAction(lead);
  };

  const handleBulkSave = async (leads: LeadItem[]) => {
    await bulkSaveLeadsAction(leads);
  };

  const handleUpdateStatus = async (leadId: string, status: PipelineStatus) => {
    await updateLeadStatusAction(leadId, status);
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
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Results View */}
      {searchResult ? (
        <ResultsTable
          searchResult={searchResult}
          onSaveLead={handleSaveLead}
          onBulkSave={handleBulkSave}
          onUpdateStatus={handleUpdateStatus}
        />
      ) : (
        /* Empty / Hero Feature Highlights */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Zero Scraping Friction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We query verified API endpoints (Google Places, Yelp, OpenStreetMap) and filter out entries that have a website URL registered.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Phone Numbers Attached</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every lead returned is verified to have an active direct phone number formatted for one-click calling or CSV export into your dialer.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Built-in Cold Call Pipeline</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Move discovered prospects through New, Contacted, Interested, and Closed stages while generating custom high-converting pitch scripts on the fly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
