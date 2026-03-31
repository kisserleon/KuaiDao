import { loadConfig } from "./config";
import { upsertListings, logFetch } from "./store";

/**
 * OpenStreetMap Overpass API fetcher.
 * 100% free, no API key, no signup required.
 * Queries OSM for Chinese/Asian restaurants, grocery stores, and services.
 */

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const OVERPASS_FALLBACK = "https://overpass.kumi.systems/api/interpreter";

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

const QUERIES: Record<string, string[]> = {
  restaurant: [
    '["amenity"="restaurant"]["cuisine"~"chinese|asian|sichuan|cantonese|japanese|korean|vietnamese|thai",i]',
    '["amenity"="restaurant"]["name"~"chinese|china|wok|noodle|dumpling|bao|ramen|sushi|pho|thai|asia",i]',
    '["amenity"="fast_food"]["cuisine"~"chinese|asian",i]',
    '["amenity"="cafe"]["cuisine"~"bubble_tea",i]',
  ],
  grocery: [
    '["shop"~"supermarket|convenience"]["name"~"asia|asian|chinese|oriental|china|eastern",i]',
  ],
  service: [
    '["office"~"lawyer|accountant|estate_agent"]["name"~"chinese|china|asia",i]',
  ],
};

function buildQuery(type: string, lat: number, lng: number, radius: number): string {
  const filters = QUERIES[type];
  if (!filters) return "";
  const area = `(around:${radius},${lat},${lng})`;
  const parts = filters.flatMap(f => [
    `node${f}${area}`,
    `way${f}${area}`,
  ]);
  return `[out:json][timeout:30];(${parts.join(";")};);out center;`;
}

async function queryOverpass(query: string): Promise<OverpassElement[]> {
  for (const url of [OVERPASS_URL, OVERPASS_FALLBACK]) {
    try {
      const res = await fetch(url, {
        method: "POST",
        body: new URLSearchParams({ data: query }),
      });

      const text = await res.text();
      if (!res.ok || text.startsWith("<?xml") || text.startsWith("<!")) {
        console.warn(`[Overpass] ${url} returned non-JSON (status ${res.status}), trying fallback...`);
        continue;
      }

      const data = JSON.parse(text);
      return data.elements || [];
    } catch (err) {
      console.warn(`[Overpass] ${url} failed:`, err instanceof Error ? err.message : err);
    }
  }
  return [];
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

      const elements = await queryOverpass(query);

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
