"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import SearchForm from "@/components/SearchForm";
import ResultsTable from "@/components/ResultsTable";
import { LeadItem, SearchParams, SearchResult } from "@/lib/types";
import { executeSearchAction, getProviderStatusesAction } from "./actions/search";
import { useLeadPipeline } from "@/lib/pipeline-store";
import { logSearchHistory } from "@/lib/search-history-store";
import { 
  AlertCircle, 
  Store, 
  Terminal, 
  Layers, 
  ArrowRight, 
  LogIn
} from "lucide-react";


export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState<boolean>(false);
  const [lastSearchMode, setLastSearchMode] = useState<string>("physical");


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
    setAuthRequired(false);
    setLastSearchMode(params.mode || "physical");

    try {
      const res = await executeSearchAction(params);

      if (res.requireAuth) {
        setAuthRequired(true);
        setErrorMessage(res.error || "Please sign in to launch lead radar scans.");
        return;
      }

      if (res.requireSubscription) {
        // Immediately redirect to the subscription/pricing page.
        // No banner is shown. The backend guard already blocked the scan.
        const mode = res.returnTo || params.mode || "physical";
        router.push("/subscription?returnTo=" + encodeURIComponent(mode));
        return;
      }

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

      {/* Authentication Required Notice Banner */}
      {authRequired && (
        <div className="p-5 rounded-2xl bg-[#111214] border border-white/[0.14] text-[#EEEEEE] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#18191D] text-[#EEEEEE] border border-white/[0.12] flex items-center justify-center shrink-0">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#EEEEEE]">Sign In Required</div>
              <p className="text-xs text-[#989BA3] mt-0.5">
                Please sign in or create an account with your email to launch lead scans and save CRM contacts.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <a
              href={"/auth?mode=signin&returnTo=" + encodeURIComponent("/?mode=" + lastSearchMode)}
              className="px-4 py-2 bg-[#EEEEEE] hover:bg-white text-[#08090B] font-bold text-xs rounded-lg shadow-sm transition flex items-center space-x-1.5"
            >
              <span>Sign In / Register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Standard Error Notice */}
      {errorMessage && !authRequired && (
        <div className="p-4 rounded-xl bg-[#111214] border border-red-500/25 text-red-300 text-xs flex items-center space-x-3">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          <div className="bg-[#111214] border border-white/[0.08] rounded-2xl p-6 space-y-3 hover:border-white/[0.18] transition duration-150">
            <div className="w-10 h-10 rounded-xl bg-[#18191D] border border-white/[0.1] text-[#EEEEEE] flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#EEEEEE] text-base tracking-tight">Worldwide Physical Radar</h3>
            <p className="text-xs text-[#989BA3] leading-relaxed">
              Find local businesses across Kenya and 240+ countries that have an active phone number but zero website on record to pitch custom websites and POS systems.
            </p>
          </div>

          <div className="bg-[#111214] border border-white/[0.08] rounded-2xl p-6 space-y-3 hover:border-white/[0.18] transition duration-150">
            <div className="w-10 h-10 rounded-xl bg-[#18191D] border border-white/[0.1] text-[#EEEEEE] flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#EEEEEE] text-base tracking-tight">Remote Opportunities Radar</h3>
            <p className="text-xs text-[#989BA3] leading-relaxed">
              Query official public developer endpoints (Remotive, Arbeitnow, Himalayas, RemoteOK, WWR) for genuine remote software, writing, design, and AI gigs.
            </p>
          </div>

          <div className="bg-[#111214] border border-white/[0.08] rounded-2xl p-6 space-y-3 hover:border-white/[0.18] transition duration-150">
            <div className="w-10 h-10 rounded-xl bg-[#18191D] border border-white/[0.1] text-[#EEEEEE] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#EEEEEE] text-base tracking-tight">In-Session Pipeline CRM</h3>
            <p className="text-xs text-[#989BA3] leading-relaxed">
              Track outreach stages (New to Contacted to Interested to Closed), generate customized pitch scripts and job proposals, and export to CSV instantly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
