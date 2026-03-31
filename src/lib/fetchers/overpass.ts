import { loadConfig } from "./config";
import { upsertListings, logFetch } from "./store";

/**
 * OpenStreetMap Overpass API fetcher.
 * 100% free, no API key, no signup required.
 * Queries OSM for Chinese/Asian restaurants, grocery stores, and services.
 */

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

// Overpass QL queries for each listing type
function buildQuery(type: string, lat: number, lng: number, radius: number): string {
  const area = `(around:${radius},${lat},${lng})`;

  switch (type) {
    case "restaurant":
      return `[out:json][timeout:30];
(
  node["amenity"="restaurant"]["cuisine"~"chinese|asian|sichuan|cantonese|japanese|korean|vietnamese|thai|noodle|dumpling",i]${area};
  way["amenity"="restaurant"]["cuisine"~"chinese|asian|sichuan|cantonese|japanese|korean|vietnamese|thai|noodle|dumpling",i]${area};
  node["amenity"="restaurant"]["name"~"chinese|china|wok|noodle|dumpling|dim sum|bao|ramen|sushi|pho|thai|asia",i]${area};
  way["amenity"="restaurant"]["name"~"chinese|china|wok|noodle|dumpling|dim sum|bao|ramen|sushi|pho|thai|asia",i]${area};
  node["amenity"="fast_food"]["cuisine"~"chinese|asian|noodle",i]${area};
  node["amenity"="cafe"]["cuisine"~"bubble_tea",i]${area};
);
out center;`;

    case "grocery":
      return `[out:json][timeout:30];
(
  node["shop"~"supermarket|convenience|grocery"]["name"~"asia|asian|chinese|oriental|han|china|eastern|world food",i]${area};
  way["shop"~"supermarket|convenience|grocery"]["name"~"asia|asian|chinese|oriental|han|china|eastern|world food",i]${area};
  node["shop"="supermarket"]["origin"~"asian|chinese",i]${area};
);
out center;`;

    case "service":
      return `[out:json][timeout:30];
(
  node["office"~"lawyer|accountant|estate_agent|insurance"]["name"~"chinese|china|asia",i]${area};
  way["office"~"lawyer|accountant|estate_agent|insurance"]["name"~"chinese|china|asia",i]${area};
);
out center;`;

    default:
      return "";
  }
}

function extractAddress(tags: Record<string, string>): string {
  const parts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:city"] || tags["addr:suburb"],
    tags["addr:postcode"],
  ].filter(Boolean);
  return parts.join(", ") || "";
}

export async function fetchFromOverpass(type?: string): Promise<number> {
  const config = loadConfig();
  const { lat, lng, radiusMeters } = config.location;
  const types = type ? [type] : ["restaurant", "grocery", "service"];
  let totalCount = 0;

  for (const listingType of types) {
    const start = Date.now();
    const query = buildQuery(listingType, lat, lng, radiusMeters);
    if (!query) continue;

    try {
      console.log(`[Overpass] Fetching ${listingType}s near ${config.location.city}...`);

      const res = await fetch(OVERPASS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(`[Overpass] Error for ${listingType}:`, err.slice(0, 200));
        await logFetch("overpass", listingType, "error", 0, err.slice(0, 500), Date.now() - start);
        continue;
      }

      const data = await res.json();
      const elements: OverpassElement[] = data.elements || [];

      const items = elements
        .filter((el) => el.tags?.name)
        .map((el) => {
          const tags = el.tags || {};
          const elLat = el.lat || el.center?.lat || 0;
          const elLng = el.lon || el.center?.lon || 0;

          return {
            source: "overpass",
            sourceId: `osm-${el.type}-${el.id}`,
            type: listingType,
            name: tags.name || "",
            nameZh: tags["name:zh"] || tags["name:zh-Hans"] || "",
            description: tags.description || tags.cuisine || "",
            address: extractAddress(tags),
            city: tags["addr:city"] || config.location.city,
            phone: tags.phone || tags["contact:phone"] || "",
            lat: elLat,
            lng: elLng,
            categories: [tags.cuisine, tags.shop, tags.amenity, tags.office].filter(Boolean).join(","),
            sourceUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
            rawData: JSON.stringify(el),
          };
        });

      const count = await upsertListings(items);
      totalCount += count;

      await logFetch("overpass", listingType, "success", count, `Found ${elements.length} elements, ${count} with names`, Date.now() - start);
      console.log(`[Overpass] ${listingType}: ${count} listings saved (${elements.length} raw)`);

      // Be nice to the free API — wait between queries
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[Overpass] Error for ${listingType}:`, msg);
      await logFetch("overpass", listingType, "error", 0, msg, Date.now() - start);
    }
  }

  return totalCount;
}
