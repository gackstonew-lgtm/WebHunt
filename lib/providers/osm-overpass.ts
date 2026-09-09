import { ILeadProvider } from "./types";
import { ProviderRawPlace, SearchParams } from "../types";

export class OsmOverpassProvider implements ILeadProvider {
  name = "OpenStreetMap Overpass API (Free)";
  providerKey = "osm" as const;

  isConfigured(): boolean {
    return true; // OpenStreetMap Overpass is free and requires no API key!
  }

  async search(params: SearchParams): Promise<ProviderRawPlace[]> {
    console.log(`[OSM] Searching Overpass for "${params.niche}" in "${params.location}"`);

    try {
      // Step 1: Geocode location via Nominatim to get bounding box / coordinates
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        params.location
      )}&format=json&limit=1`;

      const geoRes = await fetch(nominatimUrl, {
        headers: {
          "User-Agent": "GacksLeadsApp/1.0 (leadgen-discovery)",
        },
      });

      if (!geoRes.ok) {
        console.warn("[OSM] Nominatim geocode failed.");
        return [];
      }

      const geoData = await geoRes.json();
      if (!geoData || geoData.length === 0) {
        console.warn(`[OSM] Location "${params.location}" not resolved.`);
        return [];
      }

      const lat = parseFloat(geoData[0].lat);
      const lon = parseFloat(geoData[0].lon);
      const radiusMeters = (params.radius || 25) * 1609.34; // convert miles to meters

      // Step 2: Build Overpass QL query around (lat, lon) within radius
      // Filter for nodes/ways that have phone/contact:phone and have NO website tag
      const query = `
        [out:json][timeout:25];
        (
          node(around:${radiusMeters},${lat},${lon})["phone"]["website"!~"."];
          node(around:${radiusMeters},${lat},${lon})["contact:phone"]["contact:website"!~"."]["website"!~"."];
          way(around:${radiusMeters},${lat},${lon})["phone"]["website"!~"."];
          way(around:${radiusMeters},${lat},${lon})["contact:phone"]["contact:website"!~"."]["website"!~"."];
        );
        out body 50;
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
          console.warn(`[OSM] Failed endpoint ${endpoint}, trying next...`);
        }
      }

      if (!overpassData || !overpassData.elements) {
        return [];
      }

      const elements = overpassData.elements || [];
      const nicheLower = params.niche.toLowerCase();

      const results: ProviderRawPlace[] = [];

      for (const el of elements) {
        const tags = el.tags || {};
        const name = tags.name || tags["brand"] || tags["operator"];
        if (!name) continue;

        const phone = tags.phone || tags["contact:phone"] || tags["phone:mobile"];
        if (!phone) continue;

        const category =
          tags.shop ||
          tags.amenity ||
          tags.craft ||
          tags.office ||
          tags.service ||
          "local business";

        // Filter or prioritize if niche matches keywords
        const isMatch =
          !nicheLower ||
          name.toLowerCase().includes(nicheLower) ||
          category.toLowerCase().includes(nicheLower) ||
          (tags.description && tags.description.toLowerCase().includes(nicheLower));

        // Format address from OSM addr tags
        const street = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");
        const city = tags["addr:city"] || params.location;
        const state = tags["addr:state"] || "";
        const postalCode = tags["addr:postcode"] || "";

        results.push({
          name: name,
          phone: phone,
          formattedPhone: phone,
          address: street || `${city}, ${state}`.trim(),
          city: city,
          state: state,
          postalCode: postalCode,
          category: category,
          rating: tags["stars"] ? parseFloat(tags["stars"]) : undefined,
          reviewCount: 0,
          website: tags.website || tags["contact:website"] || null,
          provider: "osm",
          providerId: `osm-${el.type}-${el.id}`,
          raw: tags,
        });

        if (results.length >= (params.maxResults || 20)) break;
      }

      return results;
    } catch (error) {
      console.error("[OSM] Overpass search error:", error);
      return [];
    }
  }
}
