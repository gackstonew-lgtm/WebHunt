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
  const [physicalFilters, setPhysicalFilters] = useState<{
    website?: 'exists' | 'missing' | 'weak';
    hasSocial?: boolean;
    hasWhatsapp?: boolean;
    hasEmail?: boolean;
    recentlyDiscovered?: boolean;
  }>({});

  // Online mode state
  const [query, setQuery] = useState("React / Next.js Developer");
  const [onlineIndustryIds, setOnlineIndustryIds] = useState<string[]>(["software_development"]);
  const [category, setCategory] = useState<string>("all");
  const [onlineProvider, setOnlineProvider] = useState<OnlineProviderType>("all");
  const [onlineFilters, setOnlineFilters] = useState<{
    salaryMin?: number;
    experienceLevel?: string;
    remoteType?: any;
    employmentType?: string;
  }>({});

  const [forceRefresh, setForceRefresh] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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
        filters: physicalFilters,
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
        filters: onlineFilters as any,
      });
    }
  };

  return (
    <div className="bg-surface rounded-3xl p-6 sm:p-10 shadow-xl border border-subtle/50/50 animate-in fade-in slide-in-from-bottom-4 duration-700 relative overflow-hidden">
      {/* Mode Switcher Banner */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-subtle/50">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-surface border border-subtle/30 shadow-sm text-primary text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-foreground" />
            <span>Multi-Channel Lead Discovery Radar</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tighter text-foreground tracking-tight">
            Discover High-Conversion Leads
          </h2>
        </div>

        {/* Dual Mode Toggle Buttons */}
        <div className="bg-surface-subtle p-1 rounded-xl border border-subtle/50 flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setMode("physical")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              mode === "physical"
                ? "bg-surface-elevated text-foreground border border-strong/60 shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-primary-hover/[0.04]"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Physical Mode (No Website)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("online")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              mode === "online"
                ? "bg-surface-elevated text-foreground border border-strong/60 shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-primary-hover/[0.04]"
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
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Niche Input with Interactive Taxonomy Selector */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center space-x-1.5">
                  <Search className="w-3.5 h-3.5 text-muted-foreground" />
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
                <label className="text-xs font-semibold text-muted-foreground flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Target Country (Worldwide)</span>
                </label>
                <div className="relative">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-surface-subtle border border-subtle/50 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary appearance-none cursor-pointer transition"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name} className="bg-surface text-foreground">
                        {c.name} {c.dialCode ? `(${c.dialCode})` : ""}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-3 pointer-events-none text-muted-foreground text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* City / Region Input */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>City / Region / ZIP (Optional)</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Nairobi, Mombasa, Austin..."
                  className="w-full bg-surface-subtle border border-subtle/50 rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition"
                />
              </div>
            </div>
          </div>
        ) : (
          /* ================= ONLINE MODE INPUTS ================= */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Job Keyword / Industry Selector */}
              <div className="md:col-span-12 space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
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

        {/* Advanced Filters Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center space-x-1.5 transition"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}</span>
          </button>
        </div>

        {/* Advanced Filters Area */}
        {showFilters && (
          <div className="bg-surface-subtle border border-subtle/50 rounded-xl p-4 space-y-4">
            {mode === "physical" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Website Status</label>
                  <select
                    value={physicalFilters.website || ""}
                    onChange={(e) => setPhysicalFilters({ ...physicalFilters, website: e.target.value as any || undefined })}
                    className="w-full bg-surface border border-subtle/50 rounded-xl px-5 py-3 text-xs text-foreground"
                  >
                    <option value="">Any</option>
                    <option value="exists">Website Exists</option>
                    <option value="missing">No Website</option>
                    <option value="weak">Weak Web Presence</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Social Presence</label>
                  <select
                    value={physicalFilters.hasSocial === undefined ? "" : physicalFilters.hasSocial ? "yes" : "no"}
                    onChange={(e) => setPhysicalFilters({ ...physicalFilters, hasSocial: e.target.value === "" ? undefined : e.target.value === "yes" })}
                    className="w-full bg-surface border border-subtle/50 rounded-xl px-5 py-3 text-xs text-foreground"
                  >
                    <option value="">Any</option>
                    <option value="yes">Has Social Media</option>
                    <option value="no">No Social Media</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">WhatsApp</label>
                  <select
                    value={physicalFilters.hasWhatsapp === undefined ? "" : physicalFilters.hasWhatsapp ? "yes" : "no"}
                    onChange={(e) => setPhysicalFilters({ ...physicalFilters, hasWhatsapp: e.target.value === "" ? undefined : e.target.value === "yes" })}
                    className="w-full bg-surface border border-subtle/50 rounded-xl px-5 py-3 text-xs text-foreground"
                  >
                    <option value="">Any</option>
                    <option value="yes">Has WhatsApp</option>
                    <option value="no">No WhatsApp</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Email</label>
                  <select
                    value={physicalFilters.hasEmail === undefined ? "" : physicalFilters.hasEmail ? "yes" : "no"}
                    onChange={(e) => setPhysicalFilters({ ...physicalFilters, hasEmail: e.target.value === "" ? undefined : e.target.value === "yes" })}
                    className="w-full bg-surface border border-subtle/50 rounded-xl px-5 py-3 text-xs text-foreground"
                  >
                    <option value="">Any</option>
                    <option value="yes">Has Email</option>
                    <option value="no">No Email</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Min Salary (USD)</label>
                  <input
                    type="number"
                    value={onlineFilters.salaryMin || ""}
                    onChange={(e) => setOnlineFilters({ ...onlineFilters, salaryMin: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="e.g. 50000"
                    className="w-full bg-surface border border-subtle/50 rounded-xl px-5 py-3 text-xs text-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Experience Level</label>
                  <select
                    value={onlineFilters.experienceLevel || ""}
                    onChange={(e) => setOnlineFilters({ ...onlineFilters, experienceLevel: e.target.value || undefined })}
                    className="w-full bg-surface border border-subtle/50 rounded-xl px-5 py-3 text-xs text-foreground"
                  >
                    <option value="">Any</option>
                    <option value="entry">Entry Level</option>
                    <option value="junior">Junior</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead / Manager</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Remote Type</label>
                  <select
                    value={onlineFilters.remoteType || ""}
                    onChange={(e) => setOnlineFilters({ ...onlineFilters, remoteType: e.target.value || undefined })}
                    className="w-full bg-surface border border-subtle/50 rounded-xl px-5 py-3 text-xs text-foreground"
                  >
                    <option value="">Any</option>
                    <option value="worldwide">Worldwide Remote</option>
                    <option value="regional">Regional Remote</option>
                    <option value="country_specific">Country Specific Remote</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Employment Type</label>
                  <select
                    value={onlineFilters.employmentType || ""}
                    onChange={(e) => setOnlineFilters({ ...onlineFilters, employmentType: e.target.value || undefined })}
                    className="w-full bg-surface border border-subtle/50 rounded-xl px-5 py-3 text-xs text-foreground"
                  >
                    <option value="">Any</option>
                    <option value="full_time">Full-time</option>
                    <option value="part_time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Controls Strip */}
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-subtle/50">
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground select-none">
              <input
                type="checkbox"
                checked={forceRefresh}
                onChange={(e) => setForceRefresh(e.target.checked)}
                className="rounded border-white/20 text-white focus:ring-0 bg-surface-subtle"
              />
              <span>Fresh Scan</span>
            </label>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm shadow-sm disabled:opacity-50 transition duration-150"
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
