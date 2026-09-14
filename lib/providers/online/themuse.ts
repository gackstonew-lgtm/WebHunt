import { IOnlineJobProvider } from "./types";
import { OnlineJobLead, OnlineSearchParams } from "@/lib/types";
import { classifyLocation } from "@/lib/geo/classifier";

export class TheMuseJobProvider implements IOnlineJobProvider {
  name = "The Muse Jobs API (Free Worldwide)";
  providerKey = "themuse";

  isConfigured(): boolean {
    return true; // The Muse public jobs endpoint is unauthenticated
  }

  async fetchJobs(params: OnlineSearchParams): Promise<OnlineJobLead[]> {
    try {
      const query = (params.query || "").trim().toLowerCase();
      const maxResults = Math.min(params.maxResults || 25, 50);
      const url = new URL("https://www.themuse.com/api/public/jobs");
      url.searchParams.set("page", "1");
      url.searchParams.set("descending", "true");

      if (params.category && params.category !== "all") {
        url.searchParams.set("category", params.category);
      }

      console.log(`[TheMuse] Fetching curated jobs: "${url.toString()}"`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      const response = await fetch(url.toString(), {
        headers: {
          "Accept": "application/json",
          "User-Agent": "WebHunt-Discovery/2.0 (JobDiscovery)",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[TheMuse] HTTP ${response.status}: ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      const rawJobs: any[] = Array.isArray(data.results) ? data.results : [];

      const filtered = query
        ? rawJobs.filter((j: any) => {
            const title = (j.name || "").toLowerCase();
            const company = (j.company?.name || "").toLowerCase();
            const contents = (j.contents || "").toLowerCase();
            const categories = Array.isArray(j.categories)
              ? j.categories.map((c: any) => (c.name || "").toLowerCase()).join(" ")
              : "";
            return title.includes(query) || company.includes(query) || contents.includes(query) || categories.includes(query);
          })
        : rawJobs;

      return filtered.slice(0, maxResults).map((job: any): OnlineJobLead => {
        const rawDesc = job.contents || "";
        const cleanSnippet = rawDesc
          .replace(/<[^>]*>?/gm, " ")
          .replace(/&[a-z0-9#]+;/gi, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 260) + "...";

        // Location extraction
        const locNames = Array.isArray(job.locations) && job.locations.length > 0
          ? job.locations.map((l: any) => l.name).filter(Boolean)
          : ["Flexible / Remote"];
        const locStr = locNames.join(", ");
        const isRemoteJob = locStr.toLowerCase().includes("remote") || locStr.toLowerCase().includes("flexible");
        const locClassification = classifyLocation(locStr, isRemoteJob);

        // Tags
        const tags: string[] = [];
        if (Array.isArray(job.categories)) {
          tags.push(...job.categories.map((c: any) => c.name).filter(Boolean));
        }
        if (Array.isArray(job.levels)) {
          tags.push(...job.levels.map((lvl: any) => lvl.name).filter(Boolean));
        }
        if (tags.length === 0) tags.push("remote", "curated");

        const applyUrl = job.refs?.landing_page || `https://www.themuse.com/jobs/${job.short_name || job.id}`;
        const primaryCat = Array.isArray(job.categories) && job.categories.length > 0
          ? job.categories[0].name
          : "Professional Opportunities";

        return {
          id: `themuse-${job.id}`,
          type: "online",
          title: (job.name || "Professional Opportunity").trim(),
          company: job.company?.name || "Verified Employer",
          companyLogo: null,
          location: locClassification.displayLocation,
          country: locClassification.country || "Worldwide",
          isRemote: isRemoteJob,
          remoteType: locClassification.remoteType,
          category: primaryCat,
          tags: tags.slice(0, 6),
          url: applyUrl,
          postedDate: job.publication_date ? job.publication_date.split("T")[0] : new Date().toISOString().split("T")[0],
          salary: "Competitive",
          source: "themuse",
          sourceId: String(job.id),
          sourceUrl: applyUrl,
          sourceType: "job_board",
          opportunityType: "full_time",
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
    } catch (error) {
      console.error("[TheMuse] Fetch jobs failed:", error);
      return [];
    }
  }
}
