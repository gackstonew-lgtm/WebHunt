import { ILeadProvider } from "./types";
import { ProviderRawPlace, SearchParams } from "../types";

export class GooglePlacesProvider implements ILeadProvider {
  name = "Google Places API";
  providerKey = "google" as const;

  isConfigured(): boolean {
    return Boolean(process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACES_API_KEY.trim() !== "");
  }

  async search(params: SearchParams): Promise<ProviderRawPlace[]> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.warn("[GooglePlaces] API key not found. Skipping Google Places search.");
      return [];
    }

    const query = `${params.niche} in ${params.location}`;
    console.log(`[GooglePlaces] Querying: "${query}"`);

    try {
      // Use the Google Places API (New) Text Search which returns phone & website directly in one request
      const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.primaryTypeDisplayName,places.addressComponents",
        },
        body: JSON.stringify({
          textQuery: query,
          maxResultCount: Math.min(params.maxResults || 20, 20),
        }),
      });

      if (!response.ok) {
        // If Places (New) failed, attempt legacy fallback or log error
        const errText = await response.text();
        console.error(`[GooglePlaces] HTTP error ${response.status}: ${errText}`);
        return this.searchLegacyFallback(query, apiKey);
      }

      const data = await response.json();
      const places = data.places || [];

      return places.map((place: any) => {
        let city = "";
        let state = "";
        let postalCode = "";

        if (Array.isArray(place.addressComponents)) {
          for (const comp of place.addressComponents) {
            if (comp.types?.includes("locality")) city = comp.longText;
            if (comp.types?.includes("administrative_area_level_1")) state = comp.shortText;
            if (comp.types?.includes("postal_code")) postalCode = comp.longText;
          }
        }

        return {
          name: place.displayName?.text || "Unknown Business",
          phone: place.nationalPhoneNumber || place.internationalPhoneNumber || undefined,
          formattedPhone: place.nationalPhoneNumber || place.internationalPhoneNumber || undefined,
          address: place.formattedAddress || "",
          city: city || params.location,
          state: state || "",
          postalCode: postalCode || "",
          category: place.primaryTypeDisplayName?.text || params.niche,
          rating: typeof place.rating === "number" ? place.rating : undefined,
          reviewCount: typeof place.userRatingCount === "number" ? place.userRatingCount : 0,
          website: place.websiteUri || null, // null/empty means no website!
          provider: "google",
          providerId: place.id,
          raw: place,
        };
      });
    } catch (error) {
      console.error("[GooglePlaces] Search failed:", error);
      return [];
    }
  }

  private async searchLegacyFallback(query: string, apiKey: string): Promise<ProviderRawPlace[]> {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&key=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      if (!data.results) return [];

      // For legacy text search, we fetch details for the top items to retrieve phone and website
      const detailedPlaces: ProviderRawPlace[] = [];
      for (const item of data.results.slice(0, 10)) {
        try {
          const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&fields=name,formatted_phone_number,international_phone_number,formatted_address,website,rating,user_ratings_total,types&key=${apiKey}`;
          const detailRes = await fetch(detailUrl);
          const detailData = await detailRes.json();
          const detail = detailData.result || {};

          detailedPlaces.push({
            name: detail.name || item.name,
            phone: detail.formatted_phone_number || detail.international_phone_number || undefined,
            formattedPhone: detail.formatted_phone_number || undefined,
            address: detail.formatted_address || item.formatted_address || "",
            city: "",
            state: "",
            postalCode: "",
            category: (detail.types && detail.types[0]) || item.types?.[0] || "",
            rating: detail.rating || item.rating,
            reviewCount: detail.user_ratings_total || item.user_ratings_total || 0,
            website: detail.website || null,
            provider: "google",
            providerId: item.place_id,
            raw: detail,
          });
        } catch (detailErr) {
          console.warn("[GooglePlaces Legacy Detail] Error:", detailErr);
        }
      }
      return detailedPlaces;
    } catch (err) {
      console.error("[GooglePlaces Legacy] Error:", err);
      return [];
    }
  }
}
