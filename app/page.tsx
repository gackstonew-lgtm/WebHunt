"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SearchForm from "@/components/SearchForm";
import ResultsTable from "@/components/ResultsTable";
import KoraCheckoutModal from "@/components/payments/KoraCheckoutModal";
import { LeadItem, SearchParams, SearchResult } from "@/lib/types";
import { executeSearchAction, getProviderStatusesAction } from "./actions/search";
import { useLeadPipeline } from "@/lib/pipeline-store";
import { logSearchHistory } from "@/lib/search-history-store";
import { 
  AlertCircle, 
  Store, 
  Terminal, 
  Layers, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  LogIn,
  Crown
} from "lucide-react";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState<boolean>(false);
  const [subRequired, setSubRequired] = useState<boolean>(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
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
    setSubRequired(false);
    setLastSearchMode(params.mode || "physical");

    try {
      const res = await executeSearchAction(params);

      if (res.requireAuth) {
        setAuthRequired(true);
        setErrorMessage(res.error || "Please sign in to launch lead radar scans.");
        return;
      }

      if (res.requireSubscription) {
        setSubRequired(true);
        setErrorMessage(res.error || "Active subscription required to run lead radar scans.");
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
        <div className="p-5 rounded-3xl bg-[#10192A] border border-[#0048BB]/50 text-[#F8F3F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0048BB]/20 text-[#0048BB] border border-[#0048BB]/40 flex items-center justify-center shrink-0">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#F8F3F0]">Sign In Required</div>
              <p className="text-xs text-[#A8A196] mt-0.5">
                Please sign in or create an account with your email to launch lead scans and save CRM contacts.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <Link
              href={"/auth?mode=signin&returnTo=" + encodeURIComponent("/?mode=" + lastSearchMode)}
              className="px-4 py-2.5 bg-[#0048BB] hover:bg-[#00388A] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
            >
              <span>Sign In / Register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Subscription Required Notice Banner */}
      {subRequired && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-[#10192A] via-[#0D0D0D] to-[#10192A] border border-[#0048BB] text-[#F8F3F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl animate-in slide-in-from-top-2">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#0048BB] text-white flex items-center justify-center shadow-md shadow-[#0048BB]/30 shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-[#F8F3F0]">Active Subscription Required</span>
                <span className="px-2 py-0.5 rounded-full bg-[#0048BB]/20 text-[#0048BB] text-[10px] font-bold uppercase tracking-wider border border-[#0048BB]/30">
                  Monthly $50 • Annual $200
                </span>
              </div>
              <p className="text-xs text-[#A8A196] mt-0.5">
                Subscribe to unlock uncapped Physical Lead Radar &amp; Remote Opportunities scans with contact enrichment.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowCheckoutModal(true)}
              className="px-3.5 py-2 text-xs font-semibold text-[#A8A196] hover:text-[#F8F3F0] bg-[#161616] hover:bg-[#202020] rounded-xl border border-[rgba(248,243,240,0.1)] transition"
            >
              Quick Pay
            </button>

            <Link
              href={"/subscription?returnTo=" + encodeURIComponent(lastSearchMode)}
              className="px-4 py-2 bg-[#0048BB] hover:bg-[#00388A] text-white font-bold text-xs rounded-xl shadow-md shadow-[#0048BB]/25 transition flex items-center space-x-1.5"
            >
              <span>View Plans ($50/mo)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Standard Error Notice (if not auth or sub required) */}
      {errorMessage && !authRequired && !subRequired && (
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
              Find local businesses across Kenya and 240+ countries that have an active phone number but zero website on record to pitch custom websites &amp; POS systems.
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
              Track outreach stages (New ➔ Contacted ➔ Interested ➔ Closed), generate customized pitch scripts &amp; job proposals, and export to CSV instantly.
            </p>
          </div>
        </div>
      )}

      {/* Checkout Modal Trigger */}
      {showCheckoutModal && (
        <KoraCheckoutModal
          onClose={() => setShowCheckoutModal(false)}
          defaultPlanId="annual"
          returnTo={lastSearchMode}
          onSuccess={() => {
            setShowCheckoutModal(false);
            setSubRequired(false);
          }}
        />
      )}
    </div>
  );
}
