import { IPhysicalLeadProvider } from "./types";
import { IOnlineJobProvider } from "./online/types";
import { OsmOverpassProvider } from "./osm-overpass";
import { GooglePlacesProvider } from "./google-places";
import { DemoSandboxProvider } from "./demo-provider";
import { RemotiveJobProvider } from "./online/remotive";
import { ArbeitnowJobProvider } from "./online/arbeitnow";
import { DemoOnlineJobProvider } from "./online/demo-jobs";
import { 
  LeadItem, 
  OnlineJobLead, 
  OnlineSearchParams, 
  PhysicalLead, 
  PhysicalSearchParams, 
  SearchParams, 
  SearchResult 
} from "../types";
import { normalizeBusinessName, normalizePhoneNumber } from "../utils";

// In-Memory Fast Cache with TTL for production responsiveness
const memoryCache = new Map<string, { data: SearchResult; expiresAt: number }>();

export class LeadProviderAggregator {
  private physicalProviders: Map<string, IPhysicalLeadProvider> = new Map();
  private onlineProviders: Map<string, IOnlineJobProvider> = new Map();

  constructor() {
    // Register Physical Providers
    this.registerPhysical(new OsmOverpassProvider());
    this.registerPhysical(new GooglePlacesProvider());
    this.registerPhysical(new DemoSandboxProvider());

    // Register Online Job Providers
    this.registerOnline(new RemotiveJobProvider());
    this.registerOnline(new ArbeitnowJobProvider());
    this.registerOnline(new DemoOnlineJobProvider());
  }

  registerPhysical(provider: IPhysicalLeadProvider) {
    this.physicalProviders.set(provider.providerKey, provider);
  }

  registerOnline(provider: IOnlineJobProvider) {
    this.onlineProviders.set(provider.providerKey, provider);
  }

  getPhysicalProvidersStatus() {
    return [
      {
        key: "osm",
        name: "OpenStreetMap Overpass (Free Worldwide)",
        configured: true,
        isFree: true,
      },
      {
        key: "google",
        name: "Google Places API (New)",
        configured: this.physicalProviders.get("google")?.isConfigured() || false,
        isFree: false,
      },
      {
        key: "demo",
        name: "Demo Sandbox (Offline)",
        configured: true,
        isFree: true,
      },
    ];
  }

  getOnlineProvidersStatus() {
    return [
      {
        key: "remotive",
        name: "Remotive Public API (Free)",
        configured: true,
        isFree: true,
      },
      {
        key: "arbeitnow",
        name: "Arbeitnow Job Board API (Free)",
        configured: true,
        isFree: true,
      },
      {
        key: "demo",
        name: "Demo Sandbox (Offline)",
        configured: true,
        isFree: true,
      },
    ];
  }

  async search(params: SearchParams): Promise<SearchResult> {
    const cacheKey = params.mode === "physical"
      ? `phys:${params.country}:${params.city || ""}:${params.niche}:${params.provider || "all"}`
      : `online:${params.query}:${params.provider || "all"}`;

    // 1. Check in-memory cache
    if (!params.forceRefresh) {
      const cached = memoryCache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        console.log(`[Cache Hit] Returning cached results for: ${cacheKey}`);
        return {
          ...cached.data,
          fromCache: true,
        };
      }
    }

    if (params.mode === "physical") {
      return this.searchPhysical(params, cacheKey);
    } else {
      return this.searchOnline(params, cacheKey);
    }
  }

  private async searchPhysical(params: PhysicalSearchParams, cacheKey: string): Promise<SearchResult> {
    const selected = params.provider || "all";
    const targets: IPhysicalLeadProvider[] = [];

    if (selected === "all") {
      for (const p of Array.from(this.physicalProviders.values())) {
        if (p.isConfigured()) {
          targets.push(p);
        }
      }
    } else {
      const p = this.physicalProviders.get(selected);
      if (p) targets.push(p);
      else targets.push(this.physicalProviders.get("osm")!);
    }

    if (targets.length === 0) {
      targets.push(this.physicalProviders.get("osm")!);
    }

    // Parallel fetch from all providers
    const promises = targets.map((t) => t.search(params).catch((err) => {
      console.warn(`[PhysicalProvider] ${t.name} failed:`, err);
      return [] as PhysicalLead[];
    }));

    const results = await Promise.all(promises);
    const rawLeads = results.flat();

    // Deduplicate & filter
    const seenPhones = new Set<string>();
    const seenNames = new Set<string>();
    const deduplicated: PhysicalLead[] = [];

    for (const lead of rawLeads) {
      const normPhone = normalizePhoneNumber(lead.phone);
      const normName = `${normalizeBusinessName(lead.businessName)}_${(lead.city || "").toLowerCase()}`;

      if (normPhone && seenPhones.has(normPhone)) continue;
      if (normName && seenNames.has(normName)) continue;

      if (normPhone) seenPhones.add(normPhone);
      if (normName) seenNames.add(normName);

      deduplicated.push(lead);
    }

    const searchResult: SearchResult = {
      mode: "physical",
      query: params.niche,
      location: [params.city, params.country].filter(Boolean).join(", "),
      provider: selected,
      totalFetched: rawLeads.length,
      qualifiedCount: deduplicated.length,
      fromCache: false,
      leads: deduplicated,
    };

    // Cache for 1 hour
    memoryCache.set(cacheKey, { data: searchResult, expiresAt: Date.now() + 3600 * 1000 });

    return searchResult;
  }

  private async searchOnline(params: OnlineSearchParams, cacheKey: string): Promise<SearchResult> {
    const selected = params.provider || "all";
    const targets: IOnlineJobProvider[] = [];

    if (selected === "all") {
      for (const p of Array.from(this.onlineProviders.values())) {
        if (p.isConfigured()) {
          targets.push(p);
        }
      }
    } else {
      const p = this.onlineProviders.get(selected);
      if (p) targets.push(p);
      else targets.push(this.onlineProviders.get("remotive")!);
    }

    if (targets.length === 0) {
      targets.push(this.onlineProviders.get("remotive")!);
    }

    // Parallel fetch from all job providers
    const promises = targets.map((t) => t.fetchJobs(params).catch((err) => {
      console.warn(`[OnlineJobProvider] ${t.name} failed:`, err);
      return [] as OnlineJobLead[];
    }));

    const results = await Promise.all(promises);
    const rawJobs = results.flat();

    // Deduplicate by company + title similarity
    const seenJobs = new Set<string>();
    const deduplicated: OnlineJobLead[] = [];

    for (const job of rawJobs) {
      const key = `${normalizeBusinessName(job.company)}_${job.title.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
      if (seenJobs.has(key)) continue;
      seenJobs.add(key);
      deduplicated.push(job);
    }

    const searchResult: SearchResult = {
      mode: "online",
      query: params.query,
      location: "Worldwide Remote",
      provider: selected,
      totalFetched: rawJobs.length,
      qualifiedCount: deduplicated.length,
      fromCache: false,
      leads: deduplicated,
    };

    // Cache for 1 hour
    memoryCache.set(cacheKey, { data: searchResult, expiresAt: Date.now() + 3600 * 1000 });

    return searchResult;
  }
}

export const aggregator = new LeadProviderAggregator();
export default aggregator;
