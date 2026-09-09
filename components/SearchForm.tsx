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
  Sliders, 
  ArrowRight,
  Store,
  Terminal
} from "lucide-react";
import { LeadMode, PhysicalProviderType, OnlineProviderType, SearchParams } from "@/lib/types";
import { COUNTRIES } from "@/lib/countries";

interface SearchFormProps {
  onSearch: (params: SearchParams) => Promise<any>;
  isLoading: boolean;
  providersStatus: {
    physical: { key: string; name: string; configured: boolean; isFree: boolean }[];
    online: { key: string; name: string; configured: boolean; isFree: boolean }[];
  };
}

const PHYSICAL_PRESETS = [
  "Plumbers",
  "Electricians",
  "Auto Repair",
  "Barbershops",
  "Bakeries",
  "Roofing Contractors",
  "Dentists",
  "Landscaping",
  "Restaurants & Cafes",
  "HVAC Services",
];

const ONLINE_PRESETS = [
  "Next.js",
  "React Developer",
  "WordPress",
  "Full Stack",
  "Python Backend",
  "Shopify / E-Commerce",
  "POS Integration",
  "Tailwind CSS",
  "Mobile App (Flutter/React Native)",
];

const POPULAR_CITIES: Record<string, string[]> = {
  "Kenya": ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"],
  "United States": ["Austin, TX", "Miami, FL", "Chicago, IL", "Atlanta, GA", "Phoenix, AZ"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Leeds", "Glasgow"],
  "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary"],
  "Nigeria": ["Lagos", "Abuja", "Port Harcourt", "Ibadan"],
  "South Africa": ["Johannesburg", "Cape Town", "Durban", "Pretoria"],
};

export default function SearchForm({ onSearch, isLoading, providersStatus }: SearchFormProps) {
  const [mode, setMode] = useState<LeadMode>("physical");

  // Physical mode state
  const [niche, setNiche] = useState("Plumbers");
  const [country, setCountry] = useState("Kenya");
  const [city, setCity] = useState("Nairobi");
  const [radius, setRadius] = useState<number>(25);
  const [physicalProvider, setPhysicalProvider] = useState<PhysicalProviderType>("all");

  // Online mode state
  const [query, setQuery] = useState("Next.js");
  const [onlineProvider, setOnlineProvider] = useState<OnlineProviderType>("all");

  const [forceRefresh, setForceRefresh] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "physical") {
      if (!niche.trim() || !country) return;
      onSearch({
        mode: "physical",
        niche: niche.trim(),
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
        provider: onlineProvider,
        forceRefresh,
      });
    }
  };

  const citiesForCountry = POPULAR_CITIES[country] || [];

  return (
    <div className="bg-[#111F1A] border border-[rgba(120,200,170,0.14)] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Subtle ambient gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#16302A]/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0251B8]/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Mode Switcher Banner */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(120,200,170,0.14)]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#16302A] border border-[rgba(120,200,170,0.14)] text-[#8AA79A] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#0251B8]" />
            <span>Multi-Channel Lead Discovery Radar</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#EAF2EE] tracking-tight">
            Discover High-Conversion Leads
          </h2>
        </div>

        {/* Dual Mode Toggle Buttons */}
        <div className="bg-[#0B1512] p-1.5 rounded-2xl border border-[rgba(120,200,170,0.14)] flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setMode("physical")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              mode === "physical"
                ? "bg-[#0251B8] text-white shadow-md"
                : "text-[#8AA79A] hover:text-[#EAF2EE]"
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
                ? "bg-[#0251B8] text-white shadow-md"
                : "text-[#8AA79A] hover:text-[#EAF2EE]"
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
              {/* Niche Input */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-semibold text-[#8AA79A] flex items-center space-x-1.5">
                  <Search className="w-3.5 h-3.5 text-[#0251B8]" />
                  <span>Target Industry / Business Type</span>
                </label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g. Plumbers, Auto Repair, Bakeries..."
                  required
                  className="w-full bg-[#0F1A16] border border-[rgba(120,200,170,0.14)] rounded-xl px-4 py-3 text-sm text-[#EAF2EE] placeholder-[#8AA79A]/50 focus:outline-none focus:ring-2 focus:ring-[#0251B8]/40 focus:border-[#0251B8] transition"
                />
              </div>

              {/* Worldwide Country Selector */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-semibold text-[#8AA79A] flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#0251B8]" />
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
                    className="w-full bg-[#0F1A16] border border-[rgba(120,200,170,0.14)] rounded-xl px-4 py-3 text-sm text-[#EAF2EE] focus:outline-none focus:ring-2 focus:ring-[#0251B8]/40 focus:border-[#0251B8] appearance-none cursor-pointer transition"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name} className="bg-[#111F1A] text-[#EAF2EE]">
                        {c.flag} {c.name} {c.dialCode ? `(${c.dialCode})` : ""}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-3.5 pointer-events-none text-[#8AA79A] text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* City / Region Input */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-semibold text-[#8AA79A] flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0251B8]" />
                  <span>City / Region / ZIP (Optional)</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Nairobi, Mombasa, Austin..."
                  className="w-full bg-[#0F1A16] border border-[rgba(120,200,170,0.14)] rounded-xl px-4 py-3 text-sm text-[#EAF2EE] placeholder-[#8AA79A]/50 focus:outline-none focus:ring-2 focus:ring-[#0251B8]/40 focus:border-[#0251B8] transition"
                />
              </div>
            </div>

            {/* Quick Industry Presets */}
            <div className="space-y-1.5">
              <span className="text-xs text-[#8AA79A] font-medium">Quick industry presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {PHYSICAL_PRESETS.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setNiche(tag)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                      niche.toLowerCase() === tag.toLowerCase()
                        ? "bg-[#0251B8] text-white border-[#0251B8] font-semibold shadow-sm"
                        : "bg-[#0F1A16] text-[#8AA79A] border-[rgba(120,200,170,0.14)] hover:border-[rgba(120,200,170,0.28)] hover:text-[#EAF2EE] hover:bg-[#16302A]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick City Presets */}
            {citiesForCountry.length > 0 && (
              <div className="flex items-center space-x-2 text-xs text-[#8AA79A]">
                <span className="font-medium shrink-0">Popular in {country}:</span>
                <div className="flex flex-wrap gap-1">
                  {citiesForCountry.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setCity(c)}
                      className={`text-xs px-2 py-0.5 rounded-lg border transition ${
                        city.toLowerCase() === c.toLowerCase()
                          ? "bg-[#16302A] text-[#EAF2EE] border-[rgba(120,200,170,0.3)] font-semibold"
                          : "bg-[#0F1A16] border-[rgba(120,200,170,0.14)] text-[#8AA79A] hover:text-[#EAF2EE] hover:bg-[#16302A]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ================= ONLINE MODE INPUTS ================= */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Job Keyword / Tech Stack Input */}
              <div className="md:col-span-8 space-y-1.5">
                <label className="text-xs font-semibold text-[#8AA79A] flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#0251B8]" />
                  <span>Job Role, Framework or Service Keyword</span>
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Next.js, React Developer, WordPress, POS integration, Python..."
                  required
                  className="w-full bg-[#0F1A16] border border-[rgba(120,200,170,0.14)] rounded-xl px-4 py-3 text-sm text-[#EAF2EE] placeholder-[#8AA79A]/50 focus:outline-none focus:ring-2 focus:ring-[#0251B8]/40 focus:border-[#0251B8] transition"
                />
              </div>

              {/* Online Provider Selector */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-semibold text-[#8AA79A] flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#0251B8]" />
                  <span>Job Source API</span>
                </label>
                <div className="relative">
                  <select
                    value={onlineProvider}
                    onChange={(e) => setOnlineProvider(e.target.value as OnlineProviderType)}
                    className="w-full bg-[#0F1A16] border border-[rgba(120,200,170,0.14)] rounded-xl px-4 py-3 text-sm text-[#EAF2EE] focus:outline-none focus:ring-2 focus:ring-[#0251B8]/40 focus:border-[#0251B8] appearance-none cursor-pointer transition"
                  >
                    <option value="all" className="bg-[#111F1A]">⚡ All Public Job APIs (Remotive + Arbeitnow)</option>
                    <option value="remotive" className="bg-[#111F1A]">🌐 Remotive API (Worldwide Remote)</option>
                    <option value="arbeitnow" className="bg-[#111F1A]">💼 Arbeitnow API (Tech Jobs)</option>
                    <option value="demo" className="bg-[#111F1A]">🧪 Demo Sandbox (Offline Tech Gigs)</option>
                  </select>
                  <div className="absolute right-3.5 top-3.5 pointer-events-none text-[#8AA79A] text-xs">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tech Chips */}
            <div className="space-y-1.5">
              <span className="text-xs text-[#8AA79A] font-medium">Popular tech stack queries:</span>
              <div className="flex flex-wrap gap-1.5">
                {ONLINE_PRESETS.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                      query.toLowerCase() === tag.toLowerCase()
                        ? "bg-[#0251B8] text-white border-[#0251B8] font-semibold shadow-sm"
                        : "bg-[#0F1A16] text-[#8AA79A] border-[rgba(120,200,170,0.14)] hover:border-[rgba(120,200,170,0.28)] hover:text-[#EAF2EE] hover:bg-[#16302A]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Controls Strip */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[rgba(120,200,170,0.14)]">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs text-[#5EBA8C] bg-[#16302A] border border-[rgba(120,200,170,0.14)] px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#5EBA8C]" />
              <span>
                {mode === "physical"
                  ? "Auto-filters for businesses with phone but NO website"
                  : "Uses official public JSON endpoints (No scraping)"}
              </span>
            </div>

            <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-[#8AA79A] hover:text-[#EAF2EE] select-none">
              <input
                type="checkbox"
                checked={forceRefresh}
                onChange={(e) => setForceRefresh(e.target.checked)}
                className="rounded border-[rgba(120,200,170,0.2)] text-[#0251B8] focus:ring-0 bg-[#0F1A16]"
              />
              <span>Fresh Scan</span>
            </label>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-[#0251B8] hover:bg-[#013F92] text-white font-bold text-sm shadow-md shadow-[#0251B8]/25 disabled:opacity-50 transition duration-150"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>
                  {mode === "physical"
                    ? `Scanning ${country} Overpass for Leads...`
                    : "Scanning Public Job Feeds..."}
                </span>
              </>
            ) : (
              <>
                <span>
                  {mode === "physical" ? "Launch Local Lead Radar" : "Scan Remote Job Feeds"}
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
