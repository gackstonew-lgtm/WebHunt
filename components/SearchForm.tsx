"use client";

import React, { useState } from "react";
import { 
  Search, 
  MapPin, 
  Compass, 
  Layers, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  Sliders, 
  ArrowRight,
  Check
} from "lucide-react";
import { ProviderType, SearchParams } from "@/lib/types";

interface SearchFormProps {
  onSearch: (params: SearchParams) => Promise<any>;
  isLoading: boolean;
  providersStatus: { key: string; name: string; configured: boolean; isFree: boolean }[];
}

const QUICK_NICHES = [
  "Plumbers",
  "Roofers",
  "Auto Repair",
  "Barbershops",
  "Bakeries",
  "Landscaping",
  "HVAC Contractors",
  "House Cleaning",
  "Dentists",
  "Towing Services",
];

const POPULAR_LOCATIONS = [
  "Austin, TX",
  "Miami, FL",
  "Chicago, IL",
  "Atlanta, GA",
  "Phoenix, AZ",
  "Dallas, TX",
];

export default function SearchForm({ onSearch, isLoading, providersStatus }: SearchFormProps) {
  const [niche, setNiche] = useState("Plumbers");
  const [location, setLocation] = useState("Austin, TX");
  const [radius, setRadius] = useState<number>(25);
  const [provider, setProvider] = useState<ProviderType>("all");
  const [forceRefresh, setForceRefresh] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim() || !location.trim()) return;

    onSearch({
      niche: niche.trim(),
      location: location.trim(),
      radius,
      provider,
      forceRefresh,
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/20 backdrop-blur-xl relative overflow-hidden">
      {/* Glow highlight background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        {/* Header & Tagline */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Target Verified "No Website" High-Value Prospects</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Local Business Radar Search
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Find business records with active phone numbers but zero web presence to pitch website & software packages.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Auto-filters out businesses with existing websites</span>
          </div>
        </div>

        {/* Input Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Niche Input */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Search className="w-3.5 h-3.5 text-blue-400" />
              <span>Target Industry / Niche</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Plumbers, Auto Repair, Barbers..."
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Location Input */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>City, State or ZIP Code</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Austin, TX or 78701"
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Data Provider Selector */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Data Provider</span>
            </label>
            <div className="relative">
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as ProviderType)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition appearance-none cursor-pointer"
              >
                <option value="all">⚡ All Configured Providers (Auto-Deduplicate)</option>
                <option value="demo">🧪 Demo Sandbox (Offline / Zero Keys)</option>
                <option value="osm">🗺️ OpenStreetMap Overpass (Free / No Key)</option>
                <option value="google">🔍 Google Places API</option>
                <option value="yelp">🔴 Yelp Fusion API</option>
              </select>
              <div className="absolute right-3.5 top-3.5 pointer-events-none text-slate-500 text-xs">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Quick-Pick Tags for Niches */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Quick industry presets:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_NICHES.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => setNiche(tag)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                  niche.toLowerCase() === tag.toLowerCase()
                    ? "bg-blue-600 text-white border-blue-500 font-semibold shadow-sm"
                    : "bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Quick-Pick Locations */}
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span className="font-medium shrink-0">Popular Cities:</span>
          <div className="flex flex-wrap gap-1">
            {POPULAR_LOCATIONS.map((loc) => (
              <button
                type="button"
                key={loc}
                onClick={() => setLocation(loc)}
                className="text-xs px-2 py-0.5 rounded bg-slate-950 border border-slate-800 hover:text-white hover:border-slate-700 transition"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Filter Row: Radius & Force Cache Refresh */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800/80">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-300 font-medium">Search Radius:</span>
              <span className="text-xs font-bold text-blue-400">{radius} miles</span>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-24 sm:w-32 accent-blue-600 cursor-pointer"
              />
            </div>

            <label className="inline-flex items-center space-x-2 cursor-pointer text-xs text-slate-400 hover:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={forceRefresh}
                onChange={(e) => setForceRefresh(e.target.checked)}
                className="rounded border-slate-700 text-blue-600 focus:ring-0 bg-slate-950"
              />
              <span>Bypass Cache</span>
            </label>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Scanning Databases & Filtering Websites...</span>
              </>
            ) : (
              <>
                <span>Launch Lead Radar</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
