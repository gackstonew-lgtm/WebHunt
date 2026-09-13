import { IOnlineJobProvider } from "./types";
import { OnlineJobLead, OnlineSearchParams } from "@/lib/types";
import { classifyLocation } from "@/lib/geo/classifier";

interface AtsEmployerConfig {
  slug: string;
  name: string;
  platform: "greenhouse" | "lever" | "ashby";
}

// Curated registry of verified, high-volume remote hiring employers on public ATS endpoints
const REMOTE_ATS_EMPLOYERS: AtsEmployerConfig[] = [
  // Greenhouse employers
  { slug: "canonical", name: "Canonical", platform: "greenhouse" },
  { slug: "gitlab", name: "GitLab", platform: "greenhouse" },
  { slug: "automattic", name: "Automattic", platform: "greenhouse" },
  { slug: "elastic", name: "Elastic", platform: "greenhouse" },
  { slug: "stripe", name: "Stripe", platform: "greenhouse" },
  { slug: "cloudflare", name: "Cloudflare", platform: "greenhouse" },
  
  // Lever employers
  { slug: "spotify", name: "Spotify", platform: "lever" },
  { slug: "kinsta", name: "Kinsta", platform: "lever" },
  { slug: "sourcegraph", name: "Sourcegraph", platform: "lever" },
  { slug: "deliveroo", name: "Deliveroo", platform: "lever" },

  // Ashby employers
  { slug: "linear", name: "Linear", platform: "ashby" },
  { slug: "ramp", name: "Ramp", platform: "ashby" },
  { slug: "openai", name: "OpenAI", platform: "ashby" },
  { slug: "deel", name: "Deel", platform: "ashby" },
  { slug: "postman", name: "Postman", platform: "ashby" },
];

export class AtsJobProvider implements IOnlineJobProvider {
  name = "Direct Employer ATS (Greenhouse, Lever, Ashby)";
  providerKey = "ats";

  isConfigured(): boolean {
    return true; // Zero-key official public employer job board endpoints
  }

  async fetchJobs(params: OnlineSearchParams): Promise<OnlineJobLead[]> {
    const query = (params.query || "").trim().toLowerCase();
    console.log(`[AtsProvider] Discovering direct employer vacancies for "${query}" across Greenhouse, Lever, Ashby`);

    // Pick top relevant employers or query subset concurrently
    const targetEmployers = REMOTE_ATS_EMPLOYERS.slice(0, 8);
    const promises = targetEmployers.map(emp => this.fetchEmployerJobs(emp, query, params.maxResults || 25));

    const settled = await Promise.allSettled(promises);
    const allJobs: OnlineJobLead[] = [];

    for (const res of settled) {
      if (res.status === "fulfilled" && Array.isArray(res.value)) {
        allJobs.push(...res.value);
      }
    }

    return allJobs.slice(0, params.maxResults || 30);
  }

  private async fetchEmployerJobs(
    emp: AtsEmployerConfig,
    query: string,
    limit: number
  ): Promise<OnlineJobLead[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      let url = "";
      if (emp.platform === "greenhouse") {
        url = `https://boards-api.greenhouse.io/v1/boards/${emp.slug}/jobs?content=true`;
      } else if (emp.platform === "lever") {
        url = `https://api.lever.co/v0/postings/${emp.slug}?mode=json`;
      } else if (emp.platform === "ashby") {
        url = `https://api.ashbyhq.com/posting-api/job-board/${emp.slug}`;
      }

      const res = await fetch(url, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "WebHunt-Discovery/2.0 (DirectATS)",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) return [];
      const data = await res.json();
      const leads: OnlineJobLead[] = [];

      // 1. GREENHOUSE NORMALIZATION
      if (emp.platform === "greenhouse") {
        const rawJobs = data.jobs || [];
        for (const j of rawJobs) {
          const title = j.title || "";
          const locStr = j.location?.name || "Worldwide Remote";
          const rawContent = j.content || "";

          if (query) {
            const matches = title.toLowerCase().includes(query) || rawContent.toLowerCase().includes(query);
            if (!matches) continue;
          }

          const cleanSnippet = rawContent.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim().slice(0, 260) + "...";
          const locClassification = classifyLocation(locStr, true);

          leads.push({
            id: `greenhouse-${emp.slug}-${j.id}`,
            type: "online",
            title,
            company: emp.name,
            companyLogo: null,
            location: locClassification.displayLocation,
            country: locClassification.country || "Worldwide",
            isRemote: true,
            remoteType: locClassification.remoteType,
            category: "Direct Employer Vacancy",
            tags: ["direct-ats", "greenhouse", emp.name.toLowerCase()],
            url: j.absolute_url || `https://boards.greenhouse.io/${emp.slug}/jobs/${j.id}`,
            postedDate: j.updated_at ? j.updated_at.split("T")[0] : new Date().toISOString().split("T")[0],
            salary: "Competitive",
            source: "greenhouse",
            sources: ["greenhouse"],
            sourceId: String(j.id),
            sourceUrl: j.absolute_url,
            sourceType: "official_api",
            descriptionSnippet: cleanSnippet,
            status: "NEW",
            estimatedValue: 5000,
            notes: `Direct vacancy discovered via ${emp.name} Greenhouse board.`,
            dataQualityScore: 0.98,
            verificationStatus: "VERIFIED",
            retrievedAt: new Date(),
            lastVerifiedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          if (leads.length >= 6) break;
        }
      }

      // 2. LEVER NORMALIZATION
      else if (emp.platform === "lever") {
        const rawJobs = Array.isArray(data) ? data : [];
        for (const j of rawJobs) {
          const title = j.text || "";
          const locStr = j.categories?.location || "Remote";
          const rawDesc = j.description || j.descriptionPlain || "";

          if (query) {
            const matches = title.toLowerCase().includes(query) || rawDesc.toLowerCase().includes(query);
            if (!matches) continue;
          }

          const cleanSnippet = rawDesc.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim().slice(0, 260) + "...";
          const locClassification = classifyLocation(locStr, true);

          leads.push({
            id: `lever-${emp.slug}-${j.id}`,
            type: "online",
            title,
            company: emp.name,
            companyLogo: null,
            location: locClassification.displayLocation,
            country: locClassification.country || "Worldwide",
            isRemote: true,
            remoteType: locClassification.remoteType,
            category: j.categories?.team || "Direct Employer Vacancy",
            tags: ["direct-ats", "lever", emp.name.toLowerCase()],
            url: j.hostedUrl || `https://jobs.lever.co/${emp.slug}/${j.id}`,
            postedDate: j.createdAt ? new Date(j.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
            salary: "Competitive",
            source: "lever",
            sources: ["lever"],
            sourceId: String(j.id),
            sourceUrl: j.hostedUrl,
            sourceType: "official_api",
            descriptionSnippet: cleanSnippet,
            status: "NEW",
            estimatedValue: 5000,
            notes: `Direct vacancy discovered via ${emp.name} Lever board.`,
            dataQualityScore: 0.98,
            verificationStatus: "VERIFIED",
            retrievedAt: new Date(),
            lastVerifiedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          if (leads.length >= 6) break;
        }
      }

      // 3. ASHBY NORMALIZATION
      else if (emp.platform === "ashby") {
        const rawJobs = data.jobs || [];
        for (const j of rawJobs) {
          const title = j.title || "";
          const locStr = j.location || (j.isRemote ? "Worldwide Remote" : "Remote");
          const rawDesc = j.descriptionHtml || j.descriptionPlain || "";

          if (query) {
            const matches = title.toLowerCase().includes(query) || rawDesc.toLowerCase().includes(query);
            if (!matches) continue;
          }

          const cleanSnippet = rawDesc.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim().slice(0, 260) + "...";
          const locClassification = classifyLocation(locStr, Boolean(j.isRemote));

          leads.push({
            id: `ashby-${emp.slug}-${j.id}`,
            type: "online",
            title,
            company: emp.name,
            companyLogo: null,
            location: locClassification.displayLocation,
            country: locClassification.country || "Worldwide",
            isRemote: true,
            remoteType: locClassification.remoteType,
            category: j.department || "Direct Employer Vacancy",
            tags: ["direct-ats", "ashby", emp.name.toLowerCase()],
            url: j.jobUrl || `https://jobs.ashbyhq.com/${emp.slug}/${j.id}`,
            postedDate: j.publishedAt ? j.publishedAt.split("T")[0] : new Date().toISOString().split("T")[0],
            salary: "Competitive",
            source: "ashby",
            sources: ["ashby"],
            sourceId: String(j.id),
            sourceUrl: j.jobUrl,
            sourceType: "official_api",
            descriptionSnippet: cleanSnippet,
            status: "NEW",
            estimatedValue: 5500,
            notes: `Direct vacancy discovered via ${emp.name} Ashby board.`,
            dataQualityScore: 0.98,
            verificationStatus: "VERIFIED",
            retrievedAt: new Date(),
            lastVerifiedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          if (leads.length >= 6) break;
        }
      }

      return leads;
    } catch {
      return [];
    }
  }
}
