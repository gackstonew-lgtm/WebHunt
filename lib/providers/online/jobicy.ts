import { IOnlineJobProvider } from "./types";
import { OnlineJobLead, OnlineSearchParams } from "@/lib/types";
import { classifyLocation } from "@/lib/geo/classifier";

export class JobicyJobProvider implements IOnlineJobProvider {
  name = "Jobicy Remote Jobs API (Free Worldwide)";
  providerKey = "jobicy";

  isConfigured(): boolean {
    return true; // Jobicy public API v2 is free and unauthenticated
  }

  async fetchJobs(params: OnlineSearchParams): Promise<OnlineJobLead[]> {
    const query = (params.query || "").trim().toLowerCase();
    const maxResults = Math.min(params.maxResults || 25, 50);

    // Primary attempt: Official Jobicy API v2 (JSON)
    try {
      const url = new URL("https://jobicy.com/api/v2/remote-jobs");
      url.searchParams.set("count", String(maxResults));

      if (query) {
        url.searchParams.set("tag", query);
      }

      // Map country/geo where applicable
      if (params.country) {
        const c = params.country.toLowerCase();
        if (c.includes("us") || c.includes("united states") || c.includes("america")) {
          url.searchParams.set("geo", "usa");
        } else if (c.includes("uk") || c.includes("united kingdom") || c.includes("england")) {
          url.searchParams.set("geo", "uk");
        } else if (c.includes("canada")) {
          url.searchParams.set("geo", "canada");
        } else if (c.includes("europe") || c.includes("eu")) {
          url.searchParams.set("geo", "emea");
        } else if (c.includes("asia") || c.includes("apac")) {
          url.searchParams.set("geo", "apac");
        } else if (c.includes("latam") || c.includes("latin")) {
          url.searchParams.set("geo", "latam");
        }
      }

      console.log(`[Jobicy] Fetching remote jobs via API v2: "${url.toString()}"`);

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

      if (response.ok) {
        const data = await response.json();
        const rawJobs: any[] = Array.isArray(data.jobs) ? data.jobs : [];

        if (rawJobs.length > 0) {
          return this.normalizeApiJobs(rawJobs, query, maxResults);
        }
      } else {
        console.warn(`[Jobicy] API returned HTTP ${response.status}: ${response.statusText}. Attempting RSS fallback.`);
      }
    } catch (apiErr) {
      console.warn("[Jobicy] API v2 request failed, falling back to RSS feed:", apiErr);
    }

    // Fallback attempt: Official Jobicy syndicated RSS feed
    return this.fetchFromRss(query, maxResults);
  }

  private normalizeApiJobs(rawJobs: any[], query: string, maxResults: number): OnlineJobLead[] {
    const filtered = query
      ? rawJobs.filter((j: any) => {
          const q = query.toLowerCase();
          const title = (j.jobTitle || "").toLowerCase();
          const company = (j.companyName || "").toLowerCase();
          const excerpt = (j.jobExcerpt || "").toLowerCase();
          const industry = Array.isArray(j.jobIndustry) ? j.jobIndustry.join(" ").toLowerCase() : "";
          const level = (j.jobLevel || "").toLowerCase();
          return title.includes(q) || company.includes(q) || excerpt.includes(q) || industry.includes(q) || level.includes(q);
        })
      : rawJobs;

    return filtered.slice(0, maxResults).map((job: any): OnlineJobLead => {
      const rawExcerpt = job.jobExcerpt || job.jobDescription || "";
      const cleanSnippet = rawExcerpt
        .replace(/<[^>]*>?/gm, " ")
        .replace(/&[a-z0-9#]+;/gi, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 260) + "...";

      const locClassification = classifyLocation(job.jobGeo || "Worldwide Remote", true);

      // Salary formatting
      let salaryStr = "Competitive";
      if (job.annualSalaryMin && job.annualSalaryMax) {
        const curr = job.salaryCurrency || "USD";
        salaryStr = `${curr} $${(job.annualSalaryMin / 1000).toFixed(0)}k - $${(job.annualSalaryMax / 1000).toFixed(0)}k/yr`;
      } else if (job.annualSalaryMin) {
        const curr = job.salaryCurrency || "USD";
        salaryStr = `${curr} From $${(job.annualSalaryMin / 1000).toFixed(0)}k/yr`;
      }

      // Opportunity type detection
      const jobTypes = Array.isArray(job.jobType) ? job.jobType.join(" ").toLowerCase() : (job.jobType || "").toLowerCase();
      let oppType: OnlineJobLead["opportunityType"] = "full_time";
      if (jobTypes.includes("freelance")) {
        oppType = "freelance";
      } else if (jobTypes.includes("contract")) {
        oppType = "contract";
      } else if (jobTypes.includes("part-time") || jobTypes.includes("part time")) {
        oppType = "part_time";
      } else if (jobTypes.includes("internship")) {
        oppType = "internship";
      }

      const tags: string[] = [];
      if (Array.isArray(job.jobIndustry)) tags.push(...job.jobIndustry);
      if (Array.isArray(job.jobType)) tags.push(...job.jobType);
      if (job.jobLevel) tags.push(job.jobLevel);
      if (job.jobGeo) tags.push(job.jobGeo);
      if (tags.length === 0) tags.push("remote", "tech");

      const applyUrl = job.url || `https://jobicy.com/jobs/${job.id}`;

      return {
        id: `jobicy-${job.id || Math.random().toString(36).substring(2, 9)}`,
        type: "online",
        title: job.jobTitle || "Remote Role",
        company: job.companyName || "Remote Employer",
        companyLogo: job.companyLogo || null,
        location: locClassification.displayLocation,
        country: locClassification.country || "Worldwide",
        isRemote: true,
        remoteType: locClassification.remoteType,
        category: Array.isArray(job.jobIndustry) && job.jobIndustry.length > 0 ? job.jobIndustry[0] : "Software & Technology",
        tags: tags.slice(0, 6),
        url: applyUrl,
        postedDate: job.pubDate ? job.pubDate.split("T")[0] : new Date().toISOString().split("T")[0],
        salary: salaryStr,
        source: "jobicy",
        sourceId: String(job.id || ""),
        sourceUrl: applyUrl,
        sourceType: "job_board",
        opportunityType: oppType,
        descriptionSnippet: cleanSnippet,
        status: "NEW",
        estimatedValue: 4200,
        notes: null,
        dataQualityScore: 0.95,
        verificationStatus: "VERIFIED",
        retrievedAt: new Date(),
        lastVerifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
  }

  private async fetchFromRss(query: string, maxResults: number): Promise<OnlineJobLead[]> {
    try {
      console.log("[Jobicy] Querying syndicated RSS fallback feed...");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      const res = await fetch("https://jobicy.com/jobs/feed", {
        headers: {
          "Accept": "application/rss+xml, application/xml, text/xml",
          "User-Agent": "WebHunt-Discovery/2.0 (JobDiscovery)",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        console.warn(`[Jobicy RSS] HTTP ${res.status}: ${res.statusText}`);
        return [];
      }

      const xml = await res.text();
      const items = this.parseRssItems(xml);

      const filtered = query
        ? items.filter(
            (i) =>
              i.title.toLowerCase().includes(query) ||
              i.company.toLowerCase().includes(query) ||
              i.description.toLowerCase().includes(query)
          )
        : items;

      return filtered.slice(0, maxResults).map((item, idx) => {
        const cleanSnippet = item.description
          .replace(/<[^>]*>?/gm, " ")
          .replace(/&[a-z0-9#]+;/gi, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 260) + "...";

        const locClassification = classifyLocation("Worldwide Remote", true);

        return {
          id: `jobicy-rss-${idx}-${Date.now()}`,
          type: "online",
          title: item.title,
          company: item.company || "Remote Company",
          companyLogo: null,
          location: locClassification.displayLocation,
          country: "Worldwide",
          isRemote: true,
          remoteType: "worldwide",
          category: "Software & Technology",
          tags: ["remote", "jobicy-feed"],
          url: item.link,
          postedDate: item.pubDate ? new Date(item.pubDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          salary: "Competitive",
          source: "jobicy",
          sourceId: item.link,
          sourceUrl: item.link,
          sourceType: "job_board",
          opportunityType: "full_time",
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
    } catch (rssErr) {
      console.error("[Jobicy] RSS fallback failed:", rssErr);
      return [];
    }
  }

  private parseRssItems(xml: string): Array<{ title: string; link: string; description: string; pubDate: string; company: string }> {
    const results: Array<{ title: string; link: string; description: string; pubDate: string; company: string }> = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match: RegExpExecArray | null;

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemContent = match[1];
      const titleMatch = /<title>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/title>/i.exec(itemContent);
      const linkMatch = /<link>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/link>/i.exec(itemContent);
      const descMatch = /<description>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/description>/i.exec(itemContent);
      const pubDateMatch = /<pubDate>(.*?)<\/pubDate>/i.exec(itemContent);

      const rawTitle = titleMatch ? (titleMatch[1] || titleMatch[2] || "").trim() : "Remote Job";
      const link = linkMatch ? (linkMatch[1] || linkMatch[2] || "").trim() : "https://jobicy.com";
      const description = descMatch ? (descMatch[1] || descMatch[2] || "").trim() : "";
      const pubDate = pubDateMatch ? pubDateMatch[1].trim() : "";

      // Parse "Title at Company" or "Company: Title" patterns
      let title = rawTitle;
      let company = "Remote Employer";
      if (rawTitle.includes(" at ")) {
        const parts = rawTitle.split(" at ");
        title = parts[0].trim();
        company = parts.slice(1).join(" at ").trim();
      } else if (rawTitle.includes(": ")) {
        const parts = rawTitle.split(": ");
        company = parts[0].trim();
        title = parts.slice(1).join(": ").trim();
      }

      results.push({ title, link, description, pubDate, company });
    }

    return results;
  }
}
