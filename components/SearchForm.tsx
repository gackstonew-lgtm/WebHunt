"use client";

import React, { useState } from "react";
import { 
  Search, 
  MapPin, 
  Globe, 
  Layers, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  ArrowRight,
  Store,
  Terminal,
  Briefcase
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

const POPULAR_CITIES: Record<string, string[]> = {
  "Kenya": ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"],
  "United States": ["Austin, TX", "Miami, FL", "Chicago, IL", "Atlanta, GA", "Phoenix, AZ"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Leeds", "Glasgow"],
  "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary"],
  "Nigeria": ["Lagos", "Abuja", "Port Harcourt", "Ibadan"],
  "South Africa": ["Johannesburg", "Cape Town", "Durban", "Pretoria"],
  "Germany": ["Berlin", "Munich", "Frankfurt", "Hamburg"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah"],
};

export default function SearchForm({ onSearch, isLoading, providersStatus }: SearchFormProps) {
  const [mode, setMode] = useState<LeadMode>("physical");

  // Physical mode state
  const [niche, setNiche] = useState("Plumbers & Plumbing Services");
  const [physicalIndustryIds, setPhysicalIndustryIds] = useState<string[]>(["plumbing"]);
  const [country, setCountry] = useState("Kenya");
  const [city, setCity] = useState("Nairobi");
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

  const citiesForCountry = POPULAR_CITIES[country] || [];

  return (
    <div className="bg-[#0D0D0D] border border-[rgba(228,222,210,0.12)] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Subtle ambient gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#161616]/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F95C4B]/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Mode Switcher Banner */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(228,222,210,0.12)]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#161616] border border-[rgba(228,222,210,0.12)] text-[#A8A196] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F95C4B]" />
            <span>Multi-Channel Lead Discovery Radar</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F6F4F1] tracking-tight">
            Discover High-Conversion Leads
          </h2>
        </div>

        {/* Dual Mode Toggle Buttons */}
        <div className="bg-[#000000] p-1.5 rounded-2xl border border-[rgba(228,222,210,0.12)] flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setMode("physical")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              mode === "physical"
                ? "bg-[#F95C4B] text-white shadow-md shadow-[#F95C4B]/20"
                : "text-[#A8A196] hover:text-[#F6F4F1] hover:bg-[#161616]/50"
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Physical Mode (No Website)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("online")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              mode === "online"
                ? "bg-[#F95C4B] text-white shadow-md shadow-[#F95C4B]/20"
                : "text-[#A8A196] hover:text-[#F6F4F1] hover:bg-[#161616]/50"
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Online Mode (Remote Gigs)</span>
          </button>
        </div>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSubmit} className="relative z-10 space-y-6 pt-6">
        {mode === "physical" ? (
          /* ================= PHYSICAL MODE INPUTS ================= */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Niche Input with Interactive Taxonomy Selector */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-semibold text-[#A8A196] flex items-center space-x-1.5">
                  <Search className="w-3.5 h-3.5 text-[#F95C4B]" />
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
                <label className="text-xs font-semibold text-[#A8A196] flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#F95C4B]" />
                  <span>Target Country (Worldwide)</span>
                </label>
                <div className="relative">
                  <select
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      const defaultCity = POPULAR_CITIES[e.target.value]?.[0] || "";
                      setCity(defaultCity);
                    }}
                    className="w-full bg-[#080808] border border-[rgba(228,222,210,0.12)] rounded-xl px-4 py-3 text-sm text-[#F6F4F1] focus:outline-none focus:ring-2 focus:ring-[#F95C4B]/40 focus:border-[#F95C4B] appearance-none cursor-pointer transition"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name} className="bg-[#0D0D0D] text-[#F6F4F1]">
                        {c.flag} {c.name} {c.dialCode ? `(${c.dialCode})` : ""}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-3.5 pointer-events-none text-[#A8A196] text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* City / Region Input */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-semibold text-[#A8A196] flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#F95C4B]" />
                  <span>City / Region / ZIP (Optional)</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Nairobi, Mombasa, Austin..."
                  className="w-full bg-[#080808] border border-[rgba(228,222,210,0.12)] rounded-xl px-4 py-3 text-sm text-[#F6F4F1] placeholder-[#A8A196]/50 focus:outline-none focus:ring-2 focus:ring-[#F95C4B]/40 focus:border-[#F95C4B] transition"
                />
              </div>
            </div>

            {/* Provider and Location Options */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Quick City Presets */}
              {citiesForCountry.length > 0 ? (
                <div className="flex items-center space-x-2 text-xs text-[#A8A196] flex-1 min-w-[240px]">
                  <span className="font-medium shrink-0">Popular in {country}:</span>
                  <div className="flex flex-wrap gap-1">
                    {citiesForCountry.map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setCity(c)}
                        className={`text-xs px-2 py-0.5 rounded-lg border transition ${
                          city.toLowerCase() === c.toLowerCase()
                            ? "bg-[#161616] text-[#F6F4F1] border-[rgba(249,92,75,0.4)] font-semibold"
                            : "bg-[#080808] border-[rgba(228,222,210,0.12)] text-[#A8A196] hover:text-[#F6F4F1] hover:bg-[#161616]"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1" />
              )}

              {/* Physical Provider Dropdown */}
              <div className="space-y-1.5 shrink-0 w-full sm:w-auto">
                <span className="text-xs text-[#A8A196] font-medium mr-2">Business Provider:</span>
                <select
                  value={physicalProvider}
                  onChange={(e) => setPhysicalProvider(e.target.value as PhysicalProviderType)}
                  className="bg-[#080808] border border-[rgba(228,222,210,0.12)] rounded-xl px-3 py-1.5 text-xs text-[#F6F4F1] focus:outline-none focus:ring-1 focus:ring-[#F95C4B] cursor-pointer"
                >
                  <option value="all" className="bg-[#0D0D0D]">⚡ All Configured Business Providers</option>
                  <option value="osm" className="bg-[#0D0D0D]">🌐 OpenStreetMap Overpass (Free Worldwide)</option>
                  <option value="google" className="bg-[#0D0D0D]">🏢 Google Places API</option>
                  <option value="yelp" className="bg-[#0D0D0D]">⭐ Yelp Fusion API</option>
                  <option value="foursquare" className="bg-[#0D0D0D]">📍 Foursquare Places API</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          /* ================= ONLINE MODE INPUTS ================= */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Job Keyword / Industry Selector */}
              <div className="md:col-span-8 space-y-1.5">
                <label className="text-xs font-semibold text-[#A8A196] flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#F95C4B]" />
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

              {/* Online Provider Selector */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-semibold text-[#A8A196] flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#F95C4B]" />
                  <span>Job Source Feed</span>
                </label>
                <div className="relative">
                  <select
                    value={onlineProvider}
                    onChange={(e) => setOnlineProvider(e.target.value as OnlineProviderType)}
                    className="w-full bg-[#080808] border border-[rgba(228,222,210,0.12)] rounded-xl px-4 py-3 text-sm text-[#F6F4F1] focus:outline-none focus:ring-2 focus:ring-[#F95C4B]/40 focus:border-[#F95C4B] appearance-none cursor-pointer transition"
                  >
                    <option value="all" className="bg-[#0D0D0D]">⚡ All Public Job Feeds & APIs</option>
                    <option value="remotive" className="bg-[#0D0D0D]">🌐 Remotive Public API (Worldwide)</option>
                    <option value="arbeitnow" className="bg-[#0D0D0D]">💼 Arbeitnow Job API (Tech)</option>
                    <option value="himalayas" className="bg-[#0D0D0D]">🏔️ Himalayas Remote Jobs API</option>
                    <option value="weworkremotely" className="bg-[#0D0D0D]">📰 We Work Remotely Feeds</option>
                    <option value="jobspresso" className="bg-[#0D0D0D]">☕ Jobspresso Remote Feed</option>
                    <option value="remoteok" className="bg-[#0D0D0D]">⚡ Remote OK Public API</option>
                    <option value="africa" className="bg-[#0D0D0D]">🇰🇪 Africa & Kenya Remote Discovery</option>
                  </select>
                  <div className="absolute right-3.5 top-3.5 pointer-events-none text-[#A8A196] text-xs">
                    ▼
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls Strip */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[rgba(228,222,210,0.12)]">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs text-[#5EBA8C] bg-[#161616] border border-[rgba(228,222,210,0.12)] px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#5EBA8C]" />
              <span>
                {mode === "physical"
                  ? "Real verified businesses with phone number & no website"
                  : "Genuine public feeds & official developer APIs (100% Real Data)"}
              </span>
            </div>

            <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-[#A8A196] hover:text-[#F6F4F1] select-none">
              <input
                type="checkbox"
                checked={forceRefresh}
                onChange={(e) => setForceRefresh(e.target.checked)}
                className="rounded border-[rgba(228,222,210,0.2)] text-[#F95C4B] focus:ring-0 bg-[#080808]"
              />
              <span>Fresh Scan</span>
            </label>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-[#F95C4B] hover:bg-[#E04838] text-white font-bold text-sm shadow-md shadow-[#F95C4B]/25 disabled:opacity-50 transition duration-150"
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
