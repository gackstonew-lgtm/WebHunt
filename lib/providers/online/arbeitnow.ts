import { IOnlineJobProvider } from "./types";
import { OnlineJobLead, OnlineSearchParams } from "@/lib/types";

export class ArbeitnowJobProvider implements IOnlineJobProvider {
  name = "Arbeitnow Public API (Free)";
  providerKey = "arbeitnow";

  isConfigured(): boolean {
    return true; // Arbeitnow public JSON endpoint is free and unauthenticated
  }

  async fetchJobs(params: OnlineSearchParams): Promise<OnlineJobLead[]> {
    try {
      const query = params.query.trim();
      const url = new URL("https://www.arbeitnow.com/api/job-board-api");
      if (query) {
        url.searchParams.set("search", query);
      }

      console.log(`[Arbeitnow] Querying job API: "${query}"`);

      const response = await fetch(url.toString(), {
        headers: {
          "Accept": "application/json",
          "User-Agent": "GacksLeads/1.0 (JobDiscovery)",
        },
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        console.warn(`[Arbeitnow] HTTP ${response.status}: ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      const items = data.data || [];

      return items.slice(0, params.maxResults || 25).map((item: any): OnlineJobLead => {
        const rawDesc = item.description || "";
        const cleanSnippet = rawDesc.replace(/<[^>]*>?/gm, "").slice(0, 240) + "...";

        return {
          id: `arbeitnow-${item.slug || Math.random().toString(36).substring(2, 9)}`,
          type: "online",
          title: item.title || "Web / Software Engineer",
          company: item.company_name || "Technology Client",
          companyLogo: null,
          location: item.location || (item.remote ? "Remote" : "Global"),
          country: item.remote ? "Worldwide" : (item.location || "Worldwide"),
          isRemote: Boolean(item.remote),
          category: "Web & Software Engineering",
          tags: Array.isArray(item.tags) ? item.tags.slice(0, 6) : ["remote", "tech"],
          url: item.url,
          postedDate: item.created_at ? new Date(item.created_at * 1000).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          salary: "Competitive",
          source: "arbeitnow",
          descriptionSnippet: cleanSnippet,
          status: "NEW",
          estimatedValue: 4000,
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });
    } catch (error) {
      console.error("[Arbeitnow] Fetch jobs error:", error);
      return [];
    }
  }
}
