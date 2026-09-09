import { IPhysicalLeadProvider } from "./types";
import { PhysicalLead, PhysicalSearchParams } from "../types";
import { formatPhoneNumber, normalizeBusinessName, normalizePhoneNumber } from "../utils";

export class OsmOverpassProvider implements IPhysicalLeadProvider {
  name = "OpenStreetMap Overpass API (Free Worldwide)";
  providerKey = "osm" as const;

  isConfigured(): boolean {
    return true; // Free, worldwide, zero API key required!
  }

  async search(params: PhysicalSearchParams): Promise<PhysicalLead[]> {
    const country = params.country || "Kenya";
    const city = params.city || params.locationQuery || "";
    const fullLocationQuery = [city, country].filter(Boolean).join(", ");
    const niche = params.niche || "business";

    console.log(`[OSM] Searching Overpass worldwide for "${niche}" in "${fullLocationQuery}"`);

    try {
      // Step 1: Geocode location via Nominatim
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        fullLocationQuery
      )}&format=json&limit=1`;

      const geoRes = await fetch(nominatimUrl, {
        headers: {
          "User-Agent": "GacksLeadsWorldwide/2.0 (leadgen-discovery)",
        },
      });

      if (!geoRes.ok) {
        console.warn("[OSM] Nominatim geocode request failed.");
        return [];
      }

      const geoData = await geoRes.json();
      if (!geoData || geoData.length === 0) {
        console.warn(`[OSM] Location "${fullLocationQuery}" could not be geocoded.`);
        return [];
      }

      const lat = parseFloat(geoData[0].lat);
      const lon = parseFloat(geoData[0].lon);
      const radiusMeters = (params.radius || 25) * 1609.34; // convert miles to meters (default 25 miles ~40km)

      // Step 2: Build Overpass QL query around (lat, lon) within radius
      // Filter for nodes/ways that have phone/contact:phone and NO website tag
      const query = `
        [out:json][timeout:25];
        (
          node(around:${radiusMeters},${lat},${lon})["phone"]["website"!~"."]["contact:website"!~"."];
          node(around:${radiusMeters},${lat},${lon})["contact:phone"]["contact:website"!~"."]["website"!~"."];
          way(around:${radiusMeters},${lat},${lon})["phone"]["website"!~"."]["contact:website"!~"."];
          way(around:${radiusMeters},${lat},${lon})["contact:phone"]["contact:website"!~"."]["website"!~"."];
        );
        out body 60;
      `;

      const overpassEndpoints = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter",
      ];

      let overpassData = null;
      for (const endpoint of overpassEndpoints) {
        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `data=${encodeURIComponent(query)}`,
          });
          if (res.ok) {
            overpassData = await res.json();
            break;
          }
        } catch (e) {
          console.warn(`[OSM] Failed endpoint ${endpoint}, trying fallback...`);
        }
      }

      if (!overpassData || !overpassData.elements) {
        return [];
      }

      const elements = overpassData.elements || [];
      const nicheLower = niche.toLowerCase();
      const results: PhysicalLead[] = [];
      const seenPhones = new Set<string>();

      for (const el of elements) {
        const tags = el.tags || {};
        const name = tags.name || tags["brand"] || tags["operator"] || tags["shop"] || tags["amenity"];
        if (!name) continue;

        const rawPhone = tags.phone || tags["contact:phone"] || tags["phone:mobile"];
        if (!rawPhone) continue;

        // Ensure no website exists
        if (tags.website || tags["contact:website"] || tags["url"]) {
          continue;
        }

        const normPhone = normalizePhoneNumber(rawPhone);
        if (normPhone && seenPhones.has(normPhone)) {
          continue;
        }
        if (normPhone) seenPhones.add(normPhone);

        const category =
          tags.shop ||
          tags.amenity ||
          tags.craft ||
          tags.office ||
          tags.healthcare ||
          tags.tourism ||
          tags.leisure ||
          niche;

        // Format address from OSM addr tags
        const street = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");
        const itemCity = tags["addr:city"] || city || tags["addr:suburb"] || country;
        const itemState = tags["addr:state"] || tags["addr:province"] || "";
        const postalCode = tags["addr:postcode"] || "";

        results.push({
          id: `osm-${el.type}-${el.id}`,
          type: "physical",
          businessName: name,
          phone: normPhone || rawPhone,
          phoneFormatted: formatPhoneNumber(rawPhone, country === "Kenya" ? "KE" : undefined),
          address: street || `${itemCity}, ${country}`.trim(),
          city: itemCity,
          state: itemState,
          country: country,
          postalCode: postalCode,
          category: category,
          rating: tags["stars"] ? parseFloat(tags["stars"]) : null,
          reviewCount: 0,
          hasWebsite: false,
          noWebsiteConfidence: "Verified",
          sourceProvider: "osm",
          providerPlaceId: `osm-${el.id}`,
          status: "NEW",
          estimatedValue: country === "Kenya" ? 1200 : 1500,
          notes: null,
          tags: "no-website",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        if (results.length >= (params.maxResults || 25)) break;
      }

      return results;
    } catch (error) {
      console.error("[OSM] Overpass worldwide query error:", error);
      return [];
    }
  }
}
