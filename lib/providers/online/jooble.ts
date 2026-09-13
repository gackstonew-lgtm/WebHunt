import { IOnlineJobProvider } from "./types";
import { OnlineJobLead, OnlineSearchParams } from "@/lib/types";
import { classifyLocation } from "@/lib/geo/classifier";

export class JoobleJobProvider implements IOnlineJobProvider {
  name = "Jooble Job Board API";
  providerKey = "jooble";

  isConfigured(): boolean {
    return Boolean(process.env.JOOBLE_API_KEY && process.env.JOOBLE_API_KEY.trim() !== "");
  }

  async fetchJobs(params: OnlineSearchParams): Promise<OnlineJobLead[]> {
    const apiKey = process.env.JOOBLE_API_KEY;
    if (!apiKey) {
      console.warn("[Jooble] JOOBLE_API_KEY not found in environment. Skipping Jooble provider.");
      return [];
    }

    try {
      const query = (params.query || "").trim();
      const location = params.country || "Remote";

      console.log(`[Jooble] Querying official API for "${query}" in "${location}"`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      const url = `https://jooble.org/api/${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "WebHunt-Discovery/2.0",
        },
        body: JSON.stringify({
          keywords: query,
          location: location,
          radius: "25",
          page: 1,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[Jooble] HTTP error ${response.status}: ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      const jobs = data.jobs || [];

      return jobs.slice(0, params.maxResults || 20).map((job: any): OnlineJobLead => {
        const rawSnippet = job.snippet || "";
        const cleanSnippet = rawSnippet.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim().slice(0, 260) + "...";
        const locClassification = classifyLocation(job.location || "Remote", true);

        return {
          id: `jooble-${job.id || Math.random().toString(36).substring(2, 9)}`,
          type: "online",
          title: job.title || "Remote Specialist",
          company: job.company || "Employer",
          companyLogo: null,
          location: locClassification.displayLocation,
          country: locClassification.country || "Worldwide",
          isRemote: true,
          remoteType: locClassification.remoteType,
          category: "Employment & Remote",
          tags: ["jooble", "verified-job"],
          url: job.link || `https://jooble.org`,
          postedDate: job.updated ? job.updated.split("T")[0] : new Date().toISOString().split("T")[0],
          salary: job.salary || "Competitive",
          source: "jooble",
          sources: ["jooble"],
          sourceId: String(job.id),
          sourceUrl: job.link,
          sourceType: "official_api",
          descriptionSnippet: cleanSnippet,
          status: "NEW",
          estimatedValue: 4000,
          notes: null,
          dataQualityScore: 0.90,
          verificationStatus: "VERIFIED",
          retrievedAt: new Date(),
          lastVerifiedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });
    } catch (err) {
      console.error("[Jooble] Search error:", err);
      return [];
    }
  }
}
