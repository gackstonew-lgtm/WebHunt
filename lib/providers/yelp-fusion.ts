import { ILeadProvider } from "./types";
import { ProviderRawPlace, SearchParams } from "../types";

export class YelpFusionProvider implements ILeadProvider {
  name = "Yelp Fusion API";
  providerKey = "yelp" as const;

  isConfigured(): boolean {
    return Boolean(process.env.YELP_API_KEY && process.env.YELP_API_KEY.trim() !== "");
  }

  async search(params: SearchParams): Promise<ProviderRawPlace[]> {
    const apiKey = process.env.YELP_API_KEY;
    if (!apiKey) {
      console.warn("[YelpFusion] API key not found. Skipping Yelp search.");
      return [];
    }

    try {
      const url = new URL("https://api.yelp.com/v3/businesses/search");
      url.searchParams.set("term", params.niche);
      url.searchParams.set("location", params.location);
      url.searchParams.set("limit", String(Math.min(params.maxResults || 20, 50)));
      if (params.radius) {
        // Yelp radius is in meters, max 40000m (~25 miles)
        const radiusMeters = Math.min(Math.round(params.radius * 1609.34), 40000);
        url.searchParams.set("radius", String(radiusMeters));
      }

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[YelpFusion] HTTP Error ${res.status}: ${errorText}`);
        return [];
      }

      const data = await res.json();
      const businesses = data.businesses || [];

      return businesses.map((b: any) => {
        const address = [b.location?.address1, b.location?.address2]
          .filter(Boolean)
          .join(", ");
        const primaryCat = b.categories?.[0]?.title || params.niche;

        return {
          name: b.name || "Unknown Business",
          phone: b.phone || undefined,
          formattedPhone: b.display_phone || b.phone || undefined,
          address: address || b.location?.address1 || "",
          city: b.location?.city || params.location,
          state: b.location?.state || "",
          postalCode: b.location?.zip_code || "",
          category: primaryCat,
          rating: typeof b.rating === "number" ? b.rating : undefined,
          reviewCount: typeof b.review_count === "number" ? b.review_count : 0,
          // Yelp search provides yelp profile url, not external business website
          website: b.external_website || null,
          provider: "yelp",
          providerId: b.id,
          raw: b,
        };
      });
    } catch (error) {
      console.error("[YelpFusion] Search error:", error);
      return [];
    }
  }
}
