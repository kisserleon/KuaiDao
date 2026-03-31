import { loadConfig } from "./config";
import { upsertListings, logFetch } from "./store";

const PLACES_BASE = "https://places.googleapis.com/v1/places:searchText";

interface GooglePlace {
  id: string;
  displayName?: { text: string; languageCode: string };
  formattedAddress?: string;
  internationalPhoneNumber?: string;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  location?: { latitude: number; longitude: number };
  primaryType?: string;
  types?: string[];
  googleMapsUri?: string;
  photos?: { name: string }[];
  editorialSummary?: { text: string };
}

const PRICE_MAP: Record<string, number> = {
  PRICE_LEVEL_FREE: 0,
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
  PRICE_LEVEL_VERY_EXPENSIVE: 4,
};

export async function fetchFromGoogle(type?: string): Promise<number> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.warn("[Google] GOOGLE_PLACES_API_KEY not set, skipping");
    await logFetch("google", type || "all", "error", 0, "API key not configured", 0);
    return 0;
  }

  const config = loadConfig();
  const { queries, maxResultsPerQuery } = config.sources.google;
  const { lat, lng, radiusMeters } = config.location;

  const typesToFetch = type ? { [type]: queries[type] || [] } : queries;
  let totalCount = 0;

  for (const [listingType, queryList] of Object.entries(typesToFetch)) {
    for (const query of queryList) {
      const start = Date.now();
      try {
        const fullQuery = `${query} in ${config.location.city}, ${config.location.country}`;

        const res = await fetch(PLACES_BASE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": [
              "places.id",
              "places.displayName",
              "places.formattedAddress",
              "places.internationalPhoneNumber",
              "places.rating",
              "places.userRatingCount",
              "places.priceLevel",
              "places.location",
              "places.primaryType",
              "places.types",
              "places.googleMapsUri",
              "places.editorialSummary",
            ].join(","),
          },
          body: JSON.stringify({
            textQuery: fullQuery,
            locationBias: {
              circle: {
                center: { latitude: lat, longitude: lng },
                radius: radiusMeters,
              },
            },
            maxResultCount: maxResultsPerQuery,
            languageCode: "en",
          }),
        });

        if (!res.ok) {
          const err = await res.text();
          console.error(`[Google] API error for "${query}":`, err);
          await logFetch("google", listingType, "error", 0, err.slice(0, 500), Date.now() - start);
          continue;
        }

        const data = await res.json();
        const places: GooglePlace[] = data.places || [];

        const items = places.map((p) => ({
          source: "google" as const,
          sourceId: p.id,
          type: listingType,
          name: p.displayName?.text || "",
          description: p.editorialSummary?.text || "",
          address: p.formattedAddress || "",
          city: config.location.city,
          phone: p.internationalPhoneNumber || "",
          rating: p.rating || 0,
          reviewCount: p.userRatingCount || 0,
          priceLevel: PRICE_MAP[p.priceLevel || ""] || 0,
          lat: p.location?.latitude || 0,
          lng: p.location?.longitude || 0,
          categories: (p.types || []).join(","),
          sourceUrl: p.googleMapsUri || "",
          rawData: JSON.stringify(p),
        }));

        const count = await upsertListings(items);
        totalCount += count;

        await logFetch("google", listingType, "success", count, `Query: ${query}`, Date.now() - start);
        console.log(`[Google] ${listingType}: "${query}" → ${count} results`);

        // Rate limiting: wait 200ms between requests
        await new Promise((r) => setTimeout(r, 200));
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[Google] Error for "${query}":`, msg);
        await logFetch("google", listingType, "error", 0, msg, Date.now() - start);
      }
    }
  }

  return totalCount;
}
