import { IOnlineJobProvider } from "./types";
import { OnlineJobLead, OnlineSearchParams } from "@/lib/types";
import { classifyLocation } from "@/lib/geo/classifier";

export class WeWorkRemotelyJobProvider implements IOnlineJobProvider {
  name = "We Work Remotely Public RSS Feeds";
  providerKey = "weworkremotely";

  isConfigured(): boolean {
    return true; // Public syndicated RSS feeds
  }

  private selectWwrFeeds(query: string, category?: string): string[] {
    const q = (query || "").toLowerCase();
    const cat = (category || "").toLowerCase();
    const feeds: string[] = [];

    if (q.includes("front") || q.includes("react") || q.includes("vue") || q.includes("angular") || q.includes("next") || q.includes("ui")) {
      feeds.push("https://weworkremotely.com/categories/remote-front-end-programming-jobs.rss");
      feeds.push("https://weworkremotely.com/categories/remote-full-stack-programming-jobs.rss");
    } else if (q.includes("back") || q.includes("node") || q.includes("python") || q.includes("django") || q.includes("golang") || q.includes("java") || q.includes("ruby")) {
      feeds.push("https://weworkremotely.com/categories/remote-back-end-programming-jobs.rss");
      feeds.push("https://weworkremotely.com/categories/remote-programming-jobs.rss");
    } else if (q.includes("devops") || q.includes("cloud") || q.includes("aws") || q.includes("docker") || q.includes("kubernetes") || q.includes("sysadmin")) {
      feeds.push("https://weworkremotely.com/categories/remote-devops-sysadmin-jobs.rss");
    } else if (q.includes("design") || q.includes("ux") || q.includes("product designer") || cat.includes("design")) {
      feeds.push("https://weworkremotely.com/categories/remote-design-jobs.rss");
    } else if (q.includes("sales") || q.includes("marketing") || q.includes("seo") || q.includes("growth") || cat.includes("marketing")) {
      feeds.push("https://weworkremotely.com/categories/remote-sales-and-marketing-jobs.rss");
    } else if (q.includes("support") || q.includes("customer") || cat.includes("support")) {
      feeds.push("https://weworkremotely.com/categories/remote-customer-support-jobs.rss");
    } else {
      feeds.push("https://weworkremotely.com/categories/remote-programming-jobs.rss");
      feeds.push("https://weworkremotely.com/remote-jobs.rss");
    }

    return Array.from(new Set(feeds));
  }

  async fetchJobs(params: OnlineSearchParams): Promise<OnlineJobLead[]> {
    try {
      const query = (params.query || "").trim();
      const targetFeeds = this.selectWwrFeeds(query, params.category);

      console.log(`[WeWorkRemotely] Querying ${targetFeeds.length} targeted RSS feeds for "${query}"`);

      const feedPromises = targetFeeds.map(async (feedUrl) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6500);

          const response = await fetch(feedUrl, {
            headers: {
              "Accept": "application/rss+xml, application/xml, text/xml",
              "User-Agent": "WebHunt-Discovery/2.0 (JobDiscovery)",
            },
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (!response.ok) return "";
          return await response.text();
        } catch {
          return "";
        }
      });

      const xmlTexts = await Promise.all(feedPromises);
      const items: OnlineJobLead[] = [];
      const seenLinks = new Set<string>();

      for (const xmlText of xmlTexts) {
        if (!xmlText) continue;
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;

        while ((match = itemRegex.exec(xmlText)) !== null) {
          const itemBlock = match[1];

        const titleMatch = /<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i.exec(itemBlock) || /<title>([\s\S]*?)<\/title>/i.exec(itemBlock);
        const linkMatch = /<link>([\s\S]*?)<\/link>/i.exec(itemBlock);
        const descMatch = /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i.exec(itemBlock) || /<description>([\s\S]*?)<\/description>/i.exec(itemBlock);
        const pubDateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/i.exec(itemBlock);
        const regionMatch = /<region>([\s\S]*?)<\/region>/i.exec(itemBlock);

        const fullTitle = titleMatch ? titleMatch[1].trim() : "Remote Role";
        const link = linkMatch ? linkMatch[1].trim() : "https://weworkremotely.com";
        if (seenLinks.has(link)) continue;
        seenLinks.add(link);

        const rawDesc = descMatch ? descMatch[1] : "";
        const pubDate = pubDateMatch ? new Date(pubDateMatch[1]).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
        const regionText = regionMatch ? regionMatch[1].trim() : "Anywhere in the World";

        // Parse "Company: Job Title" format
        let company = "Remote Company";
        let jobTitle = fullTitle;
        if (fullTitle.includes(":")) {
          const parts = fullTitle.split(":");
          company = parts[0].trim();
          jobTitle = parts.slice(1).join(":").trim();
        }

        if (query) {
          const q = query.toLowerCase();
          const matchQuery =
            jobTitle.toLowerCase().includes(q) ||
            company.toLowerCase().includes(q) ||
            rawDesc.toLowerCase().includes(q);
          if (!matchQuery) continue;
        }

        const cleanSnippet = rawDesc.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim().slice(0, 260) + "...";
        const locClassification = classifyLocation(regionText, true);

        items.push({
          id: `wwr-${Buffer.from(link).toString("base64").slice(0, 16)}`,
          type: "online",
          title: jobTitle,
          company,
          companyLogo: null,
          location: locClassification.displayLocation,
          country: locClassification.country || "Worldwide",
          isRemote: true,
          remoteType: locClassification.remoteType,
          category: "Software & Remote",
          tags: ["remote", "weworkremotely"],
          url: link,
          postedDate: pubDate,
          salary: "Competitive",
          source: "weworkremotely",
          sources: ["weworkremotely"],
          sourceId: link,
          sourceUrl: link,
          sourceType: "public_feed",
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
        });

        if (items.length >= (params.maxResults || 25)) break;
      }
      if (items.length >= (params.maxResults || 25)) break;
    }

    return items;
  } catch (err) {
    console.error("[WeWorkRemotely] RSS parse error:", err);
    return [];
  }
}
}
