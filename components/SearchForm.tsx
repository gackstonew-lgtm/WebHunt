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
  Briefcase,
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
    <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/20 backdrop-blur-xl relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Mode Switcher Banner */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Multi-Channel B2B Sales Prospecting Radar</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Discover High-Conversion Leads
          </h2>
        </div>

        {/* Dual Mode Toggle Buttons */}
        <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800 flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setMode("physical")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              mode === "physical"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
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
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30"
                : "text-slate-400 hover:text-white"
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
                <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <Search className="w-3.5 h-3.5 text-blue-400" />
                  <span>Target Industry / Business Type</span>
                </label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g. Plumbers, Auto Repair, Bakeries..."
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              {/* Worldwide Country Selector */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
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
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name} className="bg-slate-900 text-white">
                        {c.flag} {c.name} {c.dialCode ? `(${c.dialCode})` : ""}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-3.5 pointer-events-none text-slate-500 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* City / Region Input */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>City / Region / ZIP (Optional)</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Nairobi, Mombasa, Austin..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            {/* Quick Industry Presets */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-400 font-medium">Quick industry presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {PHYSICAL_PRESETS.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setNiche(tag)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                      niche.toLowerCase() === tag.toLowerCase()
                        ? "bg-blue-600 text-white border-blue-500 font-semibold shadow-sm"
                        : "bg-slate-950/70 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick City Presets */}
            {citiesForCountry.length > 0 && (
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span className="font-medium shrink-0">Popular in {country}:</span>
                <div className="flex flex-wrap gap-1">
                  {citiesForCountry.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setCity(c)}
                      className={`text-xs px-2 py-0.5 rounded border transition ${
                        city.toLowerCase() === c.toLowerCase()
                          ? "bg-emerald-600/30 text-emerald-300 border-emerald-500"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
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
                <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Job Role, Framework or Service Keyword</span>
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Next.js, React Developer, WordPress, POS integration, Python..."
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              {/* Online Provider Selector */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Job Source API</span>
                </label>
                <div className="relative">
                  <select
                    value={onlineProvider}
                    onChange={(e) => setOnlineProvider(e.target.value as OnlineProviderType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
                  >
                    <option value="all">⚡ All Public Job APIs (Remotive + Arbeitnow)</option>
                    <option value="remotive">🌐 Remotive API (Worldwide Remote)</option>
                    <option value="arbeitnow">💼 Arbeitnow API (Tech Jobs)</option>
                    <option value="demo">🧪 Demo Sandbox (Offline Tech Gigs)</option>
                  </select>
                  <div className="absolute right-3.5 top-3.5 pointer-events-none text-slate-500 text-xs">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tech Chips */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-400 font-medium">Popular tech stack queries:</span>
              <div className="flex flex-wrap gap-1.5">
                {ONLINE_PRESETS.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                      query.toLowerCase() === tag.toLowerCase()
                        ? "bg-cyan-600 text-white border-cyan-500 font-semibold shadow-sm"
                        : "bg-slate-950/70 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800"
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
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800/80">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                {mode === "physical"
                  ? "Auto-filters for businesses with phone but NO website"
                  : "Uses official public JSON endpoints (No LinkedIn/Upwork scraping)"}
              </span>
            </div>

            <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-slate-400 hover:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={forceRefresh}
                onChange={(e) => setForceRefresh(e.target.checked)}
                className="rounded border-slate-700 text-blue-600 focus:ring-0 bg-slate-950"
              />
              <span>Fresh Scan</span>
            </label>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-blue-600/30 disabled:opacity-50 transition duration-200"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>
                  {mode === "physical"
                    ? `Scanning ${country} Overpass for No-Website Leads...`
                    : "Scanning Remotive & Arbeitnow Public Job Feeds..."}
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
