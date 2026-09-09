import { ILeadProvider } from "./types";
import { ProviderRawPlace, SearchParams } from "../types";

export class DemoSandboxProvider implements ILeadProvider {
  name = "Demo Sandbox Provider (Offline)";
  providerKey = "demo" as const;

  isConfigured(): boolean {
    return true;
  }

  async search(params: SearchParams): Promise<ProviderRawPlace[]> {
    const niche = (params.niche || "local service").toLowerCase();
    const location = params.location || "Austin, TX";

    // Dynamic generation templates for high realism
    const templates = [
      { prefix: "Apex", rating: 4.8, reviews: 34 },
      { prefix: "Heritage & Sons", rating: 4.9, reviews: 52 },
      { prefix: "Precision", rating: 4.6, reviews: 19 },
      { prefix: "Lone Star", rating: 4.7, reviews: 41 },
      { prefix: "Champion", rating: 4.5, reviews: 28 },
      { prefix: "ProCraft", rating: 4.9, reviews: 63 },
      { prefix: "Elite Quality", rating: 4.4, reviews: 15 },
      { prefix: "Metro Area", rating: 4.7, reviews: 39 },
      { prefix: "Family First", rating: 4.8, reviews: 47 },
      { prefix: "Pioneer", rating: 4.5, reviews: 22 },
      { prefix: "Summit", rating: 4.6, reviews: 31 },
      { prefix: "Reliable Hand", rating: 4.9, reviews: 58 },
    ];

    const streets = [
      "Oakridge Blvd",
      "Industrial Way",
      "Commerce St",
      "Main Ave",
      "Market Square",
      "Broadway Suite 200",
      "Pinecrest Rd",
      "Highland Terrace",
      "Sycamore Lane",
      "Riverview Dr",
    ];

    // Capitalize words for nice display
    const capitalize = (s: string) =>
      s
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    const cleanNiche = capitalize(niche);
    const results: ProviderRawPlace[] = [];

    // Parse city & state from location
    const parts = location.split(",").map((s) => s.trim());
    const city = parts[0] || "Austin";
    const state = parts[1] || "TX";

    // Deterministic pseudo-random seed based on niche & location
    const hash = (niche + location)
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const count = Math.min(params.maxResults || 8, 12);

    for (let i = 0; i < count; i++) {
      const template = templates[(hash + i) % templates.length];
      const streetNum = 100 + ((hash * 7 + i * 31) % 8900);
      const street = streets[(hash + i) % streets.length];
      const areaCode = 200 + ((hash + i * 13) % 700);
      const prefix = 200 + ((hash * 3 + i * 17) % 700);
      const line = 1000 + ((hash * 11 + i * 29) % 8999);
      const phone = `${areaCode}${prefix}${line}`;
      const formattedPhone = `(${areaCode}) ${prefix}-${line}`;

      const businessName = `${template.prefix} ${cleanNiche}`;

      // 85% of results have no website (which qualifies them for the lead list)
      // 15% have website to verify our filter actually discards them properly!
      const hasDummyWebsite = i === 1 || i === 6;
      const website = hasDummyWebsite ? `https://www.${template.prefix.toLowerCase().replace(/\s+/g, "")}${niche.replace(/\s+/g, "")}.com` : null;

      results.push({
        name: businessName,
        phone: phone,
        formattedPhone: formattedPhone,
        address: `${streetNum} ${street}`,
        city: city,
        state: state,
        postalCode: `${70000 + ((hash + i * 5) % 9000)}`,
        category: cleanNiche,
        rating: template.rating,
        reviewCount: template.reviews,
        website: website,
        provider: "demo",
        providerId: `demo-${hash}-${i}`,
        raw: { source: "Demo Sandbox", generatedAt: new Date().toISOString() },
      });
    }

    return results;
  }
}
