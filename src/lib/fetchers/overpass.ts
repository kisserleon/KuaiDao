import { loadConfig } from "./config";
import { upsertListings, logFetch } from "./store";

/**
 * OpenStreetMap Overpass API fetcher.
 * 100% free, no API key, no signup required.
 * Uses small focused queries to avoid timeouts.
 */

const OVERPASS_URLS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

// Small, focused queries that won't timeout
function getQueries(type: string, lat: number, lng: number, radius: number): string[] {
  const a = `(around:${radius},${lat},${lng})`;
  switch (type) {
    case "restaurant":
      return [
        `[out:json][timeout:25];(node["amenity"="restaurant"]["cuisine"~"chinese|asian",i]${a};way["amenity"="restaurant"]["cuisine"~"chinese|asian",i]${a};);out center;`,
        `[out:json][timeout:25];(node["amenity"="restaurant"]["cuisine"~"japanese|korean|vietnamese|thai",i]${a};way["amenity"="restaurant"]["cuisine"~"japanese|korean|vietnamese|thai",i]${a};);out center;`,
        `[out:json][timeout:25];(node["amenity"="restaurant"]["name"~"chinese|china|wok|noodle|dumpling|bao",i]${a};way["amenity"="restaurant"]["name"~"chinese|china|wok|noodle|dumpling|bao",i]${a};);out center;`,
        `[out:json][timeout:25];(node["amenity"="fast_food"]["cuisine"~"chinese|asian",i]${a};node["amenity"="cafe"]["cuisine"~"bubble_tea",i]${a};);out center;`,
      ];
    case "grocery":
      return [
        `[out:json][timeout:25];(node["shop"~"supermarket|convenience"]["name"~"asia|asian|chinese|oriental|china",i]${a};way["shop"~"supermarket|convenience"]["name"~"asia|asian|chinese|oriental|china",i]${a};);out center;`,
      ];
    case "service":
      return [
        `[out:json][timeout:25];(node["office"~"lawyer|accountant"]["name"~"chinese|china|asia",i]${a};way["office"~"lawyer|accountant"]["name"~"chinese|china|asia",i]${a};);out center;`,
      ];
    default:
      return [];
  }
}

async function runQuery(query: string): Promise<OverpassElement[]> {
  for (const url of OVERPASS_URLS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        body: new URLSearchParams({ data: query }),
      });
      const text = await res.text();
      if (!text.startsWith("{")) {
        console.warn(`[Overpass] ${new URL(url).host} status=${res.status}, trying next...`);
        continue;
      }
      return JSON.parse(text).elements || [];
    } catch (err) {
      console.warn(`[Overpass] ${new URL(url).host} failed:`, (err as Error).message);
    }
  }
  return [];
}

function extractAddress(tags: Record<string, string>): string {
  return [tags["addr:housenumber"], tags["addr:street"], tags["addr:city"], tags["addr:postcode"]]
    .filter(Boolean)
    .join(", ");
}

export async function fetchFromOverpass(type?: string): Promise<number> {
  const config = loadConfig();
  const { lat, lng, radiusMeters } = config.location;
  const types = type ? [type] : ["restaurant", "grocery", "service"];
  const seen = new Set<string>();
  let totalCount = 0;

  for (const listingType of types) {
    const start = Date.now();
    const queries = getQueries(listingType, lat, lng, radiusMeters);

    try {
      console.log(`[Overpass] Fetching ${listingType}s (${queries.length} queries)...`);
      let typeElements: OverpassElement[] = [];

      for (const q of queries) {
        const elements = await runQuery(q);
        typeElements.push(...elements);
        // Be nice — 2s between queries
        if (queries.length > 1) await new Promise((r) => setTimeout(r, 2000));
      }

      // Dedup by OSM id
      const items = typeElements
        .filter((el) => {
          if (!el.tags?.name) return false;
          const key = `${el.type}-${el.id}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .map((el) => {
          const tags = el.tags || {};
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
            lat: el.lat || el.center?.lat || 0,
            lng: el.lon || el.center?.lon || 0,
            categories: [tags.cuisine, tags.shop, tags.amenity, tags.office].filter(Boolean).join(","),
            sourceUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
            rawData: JSON.stringify(el),
          };
        });

      const count = await upsertListings(items);
      totalCount += count;

      const dur = Date.now() - start;
      await logFetch("overpass", listingType, "success", count, `${items.length} unique from ${typeElements.length} raw`, dur);
      console.log(`[Overpass] ${listingType}: ${count} saved (${typeElements.length} raw, ${dur}ms)`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[Overpass] ${listingType} failed:`, msg);
      await logFetch("overpass", listingType, "error", 0, msg, Date.now() - start);
    }

    // Wait between types
    await new Promise((r) => setTimeout(r, 2000));
  }

  return totalCount;
}
