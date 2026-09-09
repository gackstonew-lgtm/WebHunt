import { IPhysicalLeadProvider } from "./types";
import { PhysicalLead, PhysicalSearchParams } from "../types";
import { formatPhoneNumber, normalizePhoneNumber } from "../utils";

export class GooglePlacesProvider implements IPhysicalLeadProvider {
  name = "Google Places API";
  providerKey = "google" as const;

  isConfigured(): boolean {
    return Boolean(process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACES_API_KEY.trim() !== "");
  }

  async search(params: PhysicalSearchParams): Promise<PhysicalLead[]> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.warn("[GooglePlaces] API key not found. Skipping Google Places search.");
      return [];
    }

    const country = params.country || "Kenya";
    const city = params.city || params.locationQuery || "";
    const locationStr = [city, country].filter(Boolean).join(", ");
    const query = `${params.niche} in ${locationStr}`;

    console.log(`[GooglePlaces] Querying: "${query}"`);

    try {
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
        const errText = await response.text();
        console.error(`[GooglePlaces] HTTP error ${response.status}: ${errText}`);
        return [];
      }

      const data = await response.json();
      const places = data.places || [];

      const qualified: PhysicalLead[] = [];

      for (const place of places) {
        // Filter: Keep ONLY if websiteUri is empty/null AND phone exists
        if (place.websiteUri && place.websiteUri.trim() !== "") {
          continue; // Has website -> skip!
        }

        const phone = place.nationalPhoneNumber || place.internationalPhoneNumber;
        if (!phone) continue;

        let itemCity = city;
        let state = "";
        let postalCode = "";

        if (Array.isArray(place.addressComponents)) {
          for (const comp of place.addressComponents) {
            if (comp.types?.includes("locality")) itemCity = comp.longText;
            if (comp.types?.includes("administrative_area_level_1")) state = comp.shortText;
            if (comp.types?.includes("postal_code")) postalCode = comp.longText;
          }
        }

        const normPhone = normalizePhoneNumber(phone);

        qualified.push({
          id: `google-${place.id}`,
          type: "physical",
          businessName: place.displayName?.text || "Unknown Business",
          phone: normPhone || phone,
          phoneFormatted: formatPhoneNumber(phone, country === "Kenya" ? "KE" : undefined),
          address: place.formattedAddress || "",
          city: itemCity || country,
          state: state,
          country: country,
          postalCode: postalCode,
          category: place.primaryTypeDisplayName?.text || params.niche,
          rating: typeof place.rating === "number" ? place.rating : null,
          reviewCount: typeof place.userRatingCount === "number" ? place.userRatingCount : 0,
          hasWebsite: false,
          noWebsiteConfidence: "Verified",
          sourceProvider: "google",
          providerPlaceId: place.id,
          status: "NEW",
          estimatedValue: 1500,
          notes: null,
          tags: "google-verified-no-website",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      return qualified;
    } catch (error) {
      console.error("[GooglePlaces] Search error:", error);
      return [];
    }
  }
}
