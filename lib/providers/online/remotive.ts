import { IOnlineJobProvider } from "./types";
import { OnlineJobLead, OnlineSearchParams } from "@/lib/types";

export class RemotiveJobProvider implements IOnlineJobProvider {
  name = "Remotive Public API (Free)";
  providerKey = "remotive";

  isConfigured(): boolean {
    return true; // Remotive public JSON endpoint is free and unauthenticated
  }

  async fetchJobs(params: OnlineSearchParams): Promise<OnlineJobLead[]> {
    try {
      const query = params.query.trim();
      const url = new URL("https://remotive.com/api/remote-jobs");
      if (query) {
        url.searchParams.set("search", query);
      }
      url.searchParams.set("limit", String(Math.min(params.maxResults || 25, 50)));

      console.log(`[Remotive] Fetching remote jobs with query: "${query}"`);

      const response = await fetch(url.toString(), {
        headers: {
          "Accept": "application/json",
          "User-Agent": "GacksLeads/1.0 (JobDiscovery)",
        },
        next: { revalidate: 3600 }, // Next.js cache 1 hour
      });

      if (!response.ok) {
        console.warn(`[Remotive] HTTP ${response.status}: ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      const jobs = data.jobs || [];

      return jobs.map((job: any): OnlineJobLead => {
        // Clean description snippet
        const rawDesc = job.description || "";
        const cleanSnippet = rawDesc.replace(/<[^>]*>?/gm, "").slice(0, 240) + "...";

        return {
          id: `remotive-${job.id}`,
          type: "online",
          title: job.title || "Software Developer",
          company: job.company_name || "Remote Company",
          companyLogo: job.company_logo || null,
          location: job.candidate_required_location || "Worldwide Remote",
          country: job.candidate_required_location?.toLowerCase().includes("worldwide") ? "Worldwide" : job.candidate_required_location,
          isRemote: true,
          category: job.category || "Software Development",
          tags: Array.isArray(job.tags) ? job.tags.slice(0, 6) : [],
          url: job.url,
          postedDate: job.publication_date ? job.publication_date.split("T")[0] : new Date().toISOString().split("T")[0],
          salary: job.salary || "Competitive",
          source: "remotive",
          descriptionSnippet: cleanSnippet,
          status: "NEW",
          estimatedValue: 3500,
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });
    } catch (error) {
      console.error("[Remotive] Fetch jobs failed:", error);
      return [];
    }
  }
}
