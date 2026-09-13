import { IOnlineJobProvider } from "./types";
import { OnlineJobLead, OnlineSearchParams } from "@/lib/types";
import { classifyLocation } from "@/lib/geo/classifier";

export class AdzunaJobProvider implements IOnlineJobProvider {
  name = "Adzuna Job Search API";
  providerKey = "adzuna";

  isConfigured(): boolean {
    return Boolean(
      process.env.ADZUNA_APP_ID &&
      process.env.ADZUNA_APP_ID.trim() !== "" &&
      process.env.ADZUNA_APP_KEY &&
      process.env.ADZUNA_APP_KEY.trim() !== ""
    );
  }

  async fetchJobs(params: OnlineSearchParams): Promise<OnlineJobLead[]> {
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;

    if (!appId || !appKey) {
      console.warn("[Adzuna] ADZUNA_APP_ID or ADZUNA_APP_KEY not configured. Skipping Adzuna provider.");
      return [];
    }

    try {
      const query = (params.query || "").trim();
      const countryCode = (params.country || "gb").toLowerCase().slice(0, 2);
      const page = 1;
      
      const url = new URL(`https://api.adzuna.com/v1/api/jobs/${countryCode}/search/${page}`);
      url.searchParams.set("app_id", appId);
      url.searchParams.set("app_key", appKey);
      url.searchParams.set("results_per_page", String(Math.min(params.maxResults || 20, 25)));
      if (query) {
        url.searchParams.set("what", query);
      }
      url.searchParams.set("content-type", "application/json");

      console.log(`[Adzuna] Querying jobs for what="${query}" in country="${countryCode}"`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      const response = await fetch(url.toString(), {
        headers: {
          "Accept": "application/json",
          "User-Agent": "WebHunt-Discovery/2.0",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[Adzuna] HTTP error ${response.status}: ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      const results = data.results || [];

      return results.map((item: any): OnlineJobLead => {
        const rawDesc = item.description || "";
        const cleanSnippet = rawDesc.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim().slice(0, 260) + "...";
        const locName = item.location?.display_name || "Remote / Hybrid";
        const locClassification = classifyLocation(locName, true);

        let salaryStr = "Competitive";
        if (item.salary_min && item.salary_max) {
          salaryStr = `$${(item.salary_min / 1000).toFixed(0)}k - $${(item.salary_max / 1000).toFixed(0)}k`;
        } else if (item.salary_min) {
          salaryStr = `From $${(item.salary_min / 1000).toFixed(0)}k`;
        }

        const applyUrl = item.redirect_url || `https://www.adzuna.com/jobs/details/${item.id}`;

        return {
          id: `adzuna-${item.id}`,
          type: "online",
          title: item.title || "Professional Role",
          company: item.company?.display_name || "Employer",
          companyLogo: null,
          location: locClassification.displayLocation,
          country: locClassification.country || "Worldwide",
          isRemote: true,
          remoteType: locClassification.remoteType,
          category: item.category?.label || "Employment & Tech",
          tags: ["adzuna", "verified-listing"],
          url: applyUrl,
          postedDate: item.created ? item.created.split("T")[0] : new Date().toISOString().split("T")[0],
          salary: salaryStr,
          source: "adzuna",
          sources: ["adzuna"],
          sourceId: String(item.id),
          sourceUrl: applyUrl,
          sourceType: "official_api",
          descriptionSnippet: cleanSnippet,
          status: "NEW",
          estimatedValue: 4500,
          notes: null,
          dataQualityScore: 0.95,
          verificationStatus: "VERIFIED",
          retrievedAt: new Date(),
          lastVerifiedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });
    } catch (err) {
      console.error("[Adzuna] Search error:", err);
      return [];
    }
  }
}
