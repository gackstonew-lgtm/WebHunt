import { ILeadProvider } from "./types";
import { GooglePlacesProvider } from "./google-places";
import { YelpFusionProvider } from "./yelp-fusion";
import { OsmOverpassProvider } from "./osm-overpass";
import { DemoSandboxProvider } from "./demo-provider";
import { LeadItem, ProviderRawPlace, ProviderType, SearchParams, SearchResult } from "../types";
import { formatPhoneNumber, normalizeBusinessName, normalizePhoneNumber } from "../utils";
import prisma from "../db";

export class ProviderAggregator {
  private providers: Map<string, ILeadProvider> = new Map();

  constructor() {
    this.register(new GooglePlacesProvider());
    this.register(new YelpFusionProvider());
    this.register(new OsmOverpassProvider());
    this.register(new DemoSandboxProvider());
  }

  register(provider: ILeadProvider) {
    this.providers.set(provider.providerKey, provider);
  }

  getProvider(key: string): ILeadProvider | undefined {
    return this.providers.get(key);
  }

  getProviderStatus(): { key: string; name: string; configured: boolean; isFree: boolean }[] {
    return [
      {
        key: "demo",
        name: "Demo Sandbox (Offline)",
        configured: true,
        isFree: true,
      },
      {
        key: "osm",
        name: "OpenStreetMap Overpass",
        configured: true,
        isFree: true,
      },
      {
        key: "google",
        name: "Google Places API",
        configured: this.providers.get("google")?.isConfigured() || false,
        isFree: false,
      },
      {
        key: "yelp",
        name: "Yelp Fusion API",
        configured: this.providers.get("yelp")?.isConfigured() || false,
        isFree: false,
      },
    ];
  }

  async search(params: SearchParams): Promise<SearchResult> {
    const niche = params.niche.trim();
    const location = params.location.trim();
    const selectedProvider = (params.provider || "all") as ProviderType;

    const cacheKey = `search:${selectedProvider}:${niche.toLowerCase()}:${location.toLowerCase()}:${params.radius || 25}`;

    // 1. Check API Cache
    const enableCache = process.env.ENABLE_API_CACHE !== "false";
    if (enableCache && !params.forceRefresh) {
      try {
        const cached = await prisma.apiCache.findUnique({
          where: { cacheKey },
        });

        if (cached && new Date(cached.expiresAt) > new Date()) {
          const parsed = JSON.parse(cached.payload);
          return {
            ...parsed,
            fromCache: true,
          };
        }
      } catch (cacheErr) {
        console.warn("[Cache] Cache lookup warning:", cacheErr);
      }
    }

    // 2. Determine target providers
    const targetProviders: ILeadProvider[] = [];
    if (selectedProvider === "all") {
      for (const p of Array.from(this.providers.values())) {
        if (p.isConfigured()) {
          // In "all" mode, if paid providers aren't configured, skip them
          targetProviders.push(p);
        }
      }
    } else {
      const p = this.providers.get(selectedProvider);
      if (p) targetProviders.push(p);
      else targetProviders.push(this.providers.get("demo")!);
    }

    if (targetProviders.length === 0) {
      targetProviders.push(this.providers.get("demo")!);
    }

    // 3. Execute searches in parallel
    const searchPromises = targetProviders.map(async (provider) => {
      try {
        const places = await provider.search(params);
        return places;
      } catch (err) {
        console.error(`[Aggregator] Error from provider ${provider.name}:`, err);
        return [] as ProviderRawPlace[];
      }
    });

    const resultsByProvider = await Promise.allSettled(searchPromises);
    const allRawPlaces: ProviderRawPlace[] = [];

    for (const res of resultsByProvider) {
      if (res.status === "fulfilled") {
        allRawPlaces.push(...res.value);
      }
    }

    // 4. Filter: Must have NO website and MUST have a phone number
    const qualifiedRawPlaces = allRawPlaces.filter((p) => {
      // Must not have a website
      const hasWebsite = Boolean(
        p.website &&
          p.website.trim() !== "" &&
          p.website.trim() !== "null" &&
          p.website.trim() !== "none" &&
          p.website.includes(".")
      );

      // Must have an actual phone number with at least 7 digits
      const phoneDigits = (p.phone || "").replace(/\D/g, "");
      const hasPhone = phoneDigits.length >= 7;

      return !hasWebsite && hasPhone;
    });

    // 5. De-duplicate across providers by normalized phone & normalized name
    const seenPhones = new Set<string>();
    const seenNames = new Set<string>();
    const deduplicatedLeads: LeadItem[] = [];

    const now = new Date();

    for (const raw of qualifiedRawPlaces) {
      const normPhone = normalizePhoneNumber(raw.phone);
      const normName = `${normalizeBusinessName(raw.name)}_${(raw.city || "").toLowerCase()}`;

      if (normPhone && seenPhones.has(normPhone)) {
        continue; // duplicate phone
      }
      if (normName && seenNames.has(normName)) {
        continue; // duplicate name in same city
      }

      if (normPhone) seenPhones.add(normPhone);
      if (normName) seenNames.add(normName);

      const leadItem: LeadItem = {
        id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        businessName: raw.name,
        phone: normPhone || raw.phone || "",
        phoneFormatted: formatPhoneNumber(raw.formattedPhone || raw.phone),
        address: raw.address || null,
        city: raw.city || location,
        state: raw.state || null,
        postalCode: raw.postalCode || null,
        category: raw.category || niche,
        rating: raw.rating || null,
        reviewCount: raw.reviewCount || 0,
        hasWebsite: false,
        noWebsiteConfidence: raw.provider === "google" ? "Verified" : "High",
        sourceProvider: raw.provider,
        providerPlaceId: raw.providerId || null,
        status: "NEW",
        estimatedValue: 1500,
        notes: null,
        tags: "no-website",
        createdAt: now,
        updatedAt: now,
      };

      deduplicatedLeads.push(leadItem);
    }

    const searchResult: SearchResult = {
      niche,
      location,
      provider: selectedProvider,
      totalFetched: allRawPlaces.length,
      qualifiedLeads: deduplicatedLeads.length,
      fromCache: false,
      leads: deduplicatedLeads,
    };

    // 6. Save in API Cache
    if (enableCache) {
      try {
        const ttl = parseInt(process.env.CACHE_TTL_SECONDS || "86400", 10);
        const expiresAt = new Date(Date.now() + ttl * 1000);

        await prisma.apiCache.upsert({
          where: { cacheKey },
          create: {
            cacheKey,
            provider: selectedProvider,
            query: niche,
            location,
            payload: JSON.stringify(searchResult),
            expiresAt,
          },
          update: {
            payload: JSON.stringify(searchResult),
            expiresAt,
          },
        });
      } catch (cacheSaveErr) {
        console.warn("[Cache] Failed saving to cache:", cacheSaveErr);
      }
    }

    return searchResult;
  }
}

export const aggregator = new ProviderAggregator();
export default aggregator;
