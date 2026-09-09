import { IPhysicalLeadProvider } from "./types";
import { PhysicalLead, PhysicalSearchParams } from "../types";
import { formatPhoneNumber } from "../utils";

export class DemoSandboxProvider implements IPhysicalLeadProvider {
  name = "Demo Sandbox Provider (Offline)";
  providerKey = "demo" as const;

  isConfigured(): boolean {
    return true;
  }

  async search(params: PhysicalSearchParams): Promise<PhysicalLead[]> {
    const niche = (params.niche || "local service").toLowerCase();
    const country = params.country || "Kenya";
    const city = params.city || params.locationQuery || (country === "Kenya" ? "Nairobi" : "Austin");

    const isKenya = country.toLowerCase().includes("kenya") || country === "KE";

    // Dynamic templates based on region
    const templates = isKenya
      ? [
          { prefix: "Safari View", rating: 4.8, reviews: 26, phonePrefix: "0722", street: "Moi Avenue, CBD" },
          { prefix: "Nairobi Central", rating: 4.9, reviews: 42, phonePrefix: "0733", street: "Kenyatta Avenue" },
          { prefix: "Kilimani Premier", rating: 4.7, reviews: 18, phonePrefix: "0710", street: "Argwings Kodhek Rd" },
          { prefix: "Westlands Elite", rating: 4.9, reviews: 64, phonePrefix: "0724", street: "Mpaka Road" },
          { prefix: "Karen & Sons", rating: 4.8, reviews: 31, phonePrefix: "0715", street: "Ngong Road" },
          { prefix: "Rift Valley Hand", rating: 4.6, reviews: 15, phonePrefix: "0729", street: "Enterprise Road" },
          { prefix: "Apex Coast", rating: 4.7, reviews: 29, phonePrefix: "0701", street: "Digo Road" },
          { prefix: "Mombasa Gateway", rating: 4.5, reviews: 12, phonePrefix: "0788", street: "Nyali Links Rd" },
        ]
      : [
          { prefix: "Apex", rating: 4.8, reviews: 34, phonePrefix: "512", street: "Oakridge Blvd" },
          { prefix: "Heritage & Sons", rating: 4.9, reviews: 52, phonePrefix: "512", street: "Commerce St" },
          { prefix: "Precision", rating: 4.6, reviews: 19, phonePrefix: "737", street: "Main Ave" },
          { prefix: "Lone Star", rating: 4.7, reviews: 41, phonePrefix: "512", street: "Market Square" },
          { prefix: "Champion", rating: 4.5, reviews: 28, phonePrefix: "737", street: "Broadway Suite 200" },
          { prefix: "ProCraft", rating: 4.9, reviews: 63, phonePrefix: "512", street: "Pinecrest Rd" },
          { prefix: "Family First", rating: 4.8, reviews: 47, phonePrefix: "512", street: "Highland Terrace" },
          { prefix: "Reliable Hand", rating: 4.9, reviews: 58, phonePrefix: "737", street: "Riverview Dr" },
        ];

    const capitalize = (s: string) =>
      s
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    const cleanNiche = capitalize(niche);
    const results: PhysicalLead[] = [];

    const hash = (niche + country + city)
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const count = Math.min(params.maxResults || 8, templates.length);

    for (let i = 0; i < count; i++) {
      const tpl = templates[(hash + i) % templates.length];
      const suffix = 1000 + ((hash * 11 + i * 29) % 8999);
      const rawPhone = isKenya
        ? `${tpl.phonePrefix}${suffix.toString().padStart(6, "0")}`
        : `${tpl.phonePrefix}555${suffix.toString().slice(0, 4)}`;

      results.push({
        id: `demo-${country}-${hash}-${i}`,
        type: "physical",
        businessName: `${tpl.prefix} ${cleanNiche}`,
        phone: rawPhone,
        phoneFormatted: formatPhoneNumber(rawPhone, isKenya ? "KE" : undefined),
        address: `${tpl.street}`,
        city: city,
        state: isKenya ? "Nairobi" : "TX",
        country: country,
        postalCode: isKenya ? "00100" : "78701",
        category: cleanNiche,
        rating: tpl.rating,
        reviewCount: tpl.reviews,
        hasWebsite: false,
        noWebsiteConfidence: "Verified",
        sourceProvider: "demo",
        providerPlaceId: `demo-${hash}-${i}`,
        status: "NEW",
        estimatedValue: isKenya ? 1200 : 1500,
        notes: null,
        tags: "demo-verified-no-website",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return results;
  }
}
