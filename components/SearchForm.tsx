"use client";

import React, { useState } from "react";
import { 
  Search, 
  MapPin, 
  Globe, 
  Layers, 
  Sparkles, 
  RefreshCw, 
  ArrowRight,
  Store,
  Terminal
} from "lucide-react";
import { LeadMode, PhysicalProviderType, OnlineProviderType, SearchParams } from "@/lib/types";
import { COUNTRIES } from "@/lib/countries";
import IndustrySelector from "./IndustrySelector";

interface SearchFormProps {
  onSearch: (params: SearchParams) => Promise<any>;
  isLoading: boolean;
  providersStatus: {
    physical: { key: string; name: string; configured: boolean; isFree: boolean }[];
    online: { key: string; name: string; configured: boolean; isFree: boolean }[];
  };
}

export default function SearchForm({ onSearch, isLoading, providersStatus }: SearchFormProps) {
  const [mode, setMode] = useState<LeadMode>("physical");

  // Physical mode state
  const [niche, setNiche] = useState("Plumbers & Plumbing Services");
  const [physicalIndustryIds, setPhysicalIndustryIds] = useState<string[]>(["plumbing"]);
  const [country, setCountry] = useState("Kenya");
  const [city, setCity] = useState("");
  const [radius, setRadius] = useState<number>(25);
  const [physicalProvider, setPhysicalProvider] = useState<PhysicalProviderType>("all");

  // Online mode state
  const [query, setQuery] = useState("React / Next.js Developer");
  const [onlineIndustryIds, setOnlineIndustryIds] = useState<string[]>(["software_development"]);
  const [category, setCategory] = useState<string>("all");
  const [onlineProvider, setOnlineProvider] = useState<OnlineProviderType>("all");

  const [forceRefresh, setForceRefresh] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "physical") {
      if (!niche.trim() || !country) return;
      onSearch({
        mode: "physical",
        niche: niche.trim(),
        industryIds: physicalIndustryIds,
        country,
        city: city.trim(),
        radius,
        provider: physicalProvider,
        forceRefresh,
      });
    } else {
      if (!query.trim()) return;
      onSearch({
        mode: "online",
        query: query.trim(),
        industryIds: onlineIndustryIds,
        category: category !== "all" ? category : undefined,
        provider: onlineProvider,
        forceRefresh,
      });
    }
  };

  return (
    <div className="bg-[#111214] border border-white/[0.08] rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Mode Switcher Banner */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-[#18191D] border border-white/[0.08] text-[#989BA3] text-[11px] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#EEEEEE]" />
            <span>Multi-Channel Lead Discovery Radar</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#EEEEEE] tracking-tight">
            Discover High-Conversion Leads
          </h2>
        </div>

        {/* Dual Mode Toggle Buttons */}
        <div className="bg-[#0D0E11] p-1 rounded-xl border border-white/[0.08] flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setMode("physical")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              mode === "physical"
                ? "bg-[#18191D] text-[#EEEEEE] border border-white/[0.14] shadow-sm"
                : "text-[#989BA3] hover:text-[#EEEEEE] hover:bg-white/[0.04]"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Physical Mode (No Website)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("online")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              mode === "online"
                ? "bg-[#18191D] text-[#EEEEEE] border border-white/[0.14] shadow-sm"
                : "text-[#989BA3] hover:text-[#EEEEEE] hover:bg-white/[0.04]"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Online Mode (Remote Gigs)</span>
          </button>
        </div>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSubmit} className="relative z-10 space-y-5 pt-5">
        {mode === "physical" ? (
          /* ================= PHYSICAL MODE INPUTS ================= */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
              {/* Niche Input with Interactive Taxonomy Selector */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-semibold text-[#989BA3] flex items-center space-x-1.5">
                  <Search className="w-3.5 h-3.5 text-[#989BA3]" />
                  <span>Target Industry / Business Type</span>
                </label>
                <IndustrySelector
                  mode="physical"
                  value={niche}
                  selectedIndustryIds={physicalIndustryIds}
                  onChange={(newNiche, newIds) => {
                    setNiche(newNiche);
                    setPhysicalIndustryIds(newIds);
                  }}
                  placeholder="Search industries (e.g. Plumbers, Auto Repair)..."
                />
              </div>

              {/* Worldwide Country Selector */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-semibold text-[#989BA3] flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#989BA3]" />
                  <span>Target Country (Worldwide)</span>
                </label>
                <div className="relative">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#0D0E11] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 appearance-none cursor-pointer transition"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name} className="bg-[#111214] text-[#EEEEEE]">
                        {c.name} {c.dialCode ? `(${c.dialCode})` : ""}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-3 pointer-events-none text-[#989BA3] text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* City / Region Input */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-semibold text-[#989BA3] flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#989BA3]" />
                  <span>City / Region / ZIP (Optional)</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Nairobi, Mombasa, Austin..."
                  className="w-full bg-[#0D0E11] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-[#EEEEEE] placeholder-[#989BA3]/50 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition"
                />
              </div>
            </div>
          </div>
        ) : (
          /* ================= ONLINE MODE INPUTS ================= */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
              {/* Job Keyword / Industry Selector */}
              <div className="md:col-span-12 space-y-1.5">
                <label className="text-xs font-semibold text-[#989BA3] flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#989BA3]" />
                  <span>Job Role, Field or Service Keyword</span>
                </label>
                <IndustrySelector
                  mode="online"
                  value={query}
                  selectedIndustryIds={onlineIndustryIds}
                  onChange={(newQuery, newIds) => {
                    setQuery(newQuery);
                    setOnlineIndustryIds(newIds);
                  }}
                  placeholder="Search job fields (e.g. Software Development, AI Data, Writing)..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Controls Strip */}
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/[0.08]">
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-[#989BA3] hover:text-[#EEEEEE] select-none">
              <input
                type="checkbox"
                checked={forceRefresh}
                onChange={(e) => setForceRefresh(e.target.checked)}
                className="rounded border-white/20 text-white focus:ring-0 bg-[#0D0E11]"
              />
              <span>Fresh Scan</span>
            </label>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-[#EEEEEE] hover:bg-white text-[#08090B] font-bold text-sm shadow-sm disabled:opacity-50 transition duration-150"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>
                  {mode === "physical"
                    ? `Scanning ${country} for Real Businesses...`
                    : "Scanning Live Remote Opportunities..."}
                </span>
              </>
            ) : (
              <>
                <span>
                  {mode === "physical" ? "Launch Local Lead Radar" : "Scan Remote Opportunities"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
