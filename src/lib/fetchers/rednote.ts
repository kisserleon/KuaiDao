import { loadConfig } from "./config";
import { upsertListings, logFetch } from "./store";

/**
 * RedNote (小红书) fetcher.
 *
 * 小红书 does not provide a public API, so we use web search as a proxy
 * to discover RedNote content indexed by search engines. This extracts
 * mentions of businesses, recommendations, and tips posted on 小红书.
 *
 * For a production setup, you could integrate:
 * - A headless browser (Playwright) to scrape xiaohongshu.com directly
 * - A third-party data provider API
 * - Manual RSS/webhook ingestion from community moderators
 */

const SEARCH_ENDPOINT = "https://www.googleapis.com/customsearch/v1";

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  pagemap?: {
    metatags?: Array<Record<string, string>>;
  };
}

export async function fetchFromRedNote(): Promise<number> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

  if (!apiKey || !searchEngineId) {
    console.warn("[RedNote] GOOGLE_SEARCH_API_KEY or GOOGLE_SEARCH_ENGINE_ID not set, skipping");
    await logFetch("rednote", "all", "error", 0, "Search API keys not configured", 0);
    return 0;
  }

  const config = loadConfig();
  const { queries, maxResultsPerQuery } = config.sources.rednote;
  let totalCount = 0;

  for (const query of queries) {
    const start = Date.now();
    try {
      // Search for RedNote content via Google Custom Search
      const searchQuery = `site:xiaohongshu.com ${query}`;
      const url = new URL(SEARCH_ENDPOINT);
      url.searchParams.set("key", apiKey);
      url.searchParams.set("cx", searchEngineId);
      url.searchParams.set("q", searchQuery);
      url.searchParams.set("num", String(Math.min(maxResultsPerQuery, 10)));

      const res = await fetch(url.toString());

      if (!res.ok) {
        const err = await res.text();
        console.error(`[RedNote] Search API error for "${query}":`, err);
        await logFetch("rednote", "search", "error", 0, err.slice(0, 500), Date.now() - start);
        continue;
      }

      const data = await res.json();
      const results: SearchResult[] = data.items || [];

      const items = results.map((r, i) => ({
        source: "rednote" as const,
        sourceId: `rn-${Buffer.from(r.link).toString("base64").slice(0, 40)}`,
        type: classifyRedNoteContent(query),
        name: cleanTitle(r.title),
        nameZh: cleanTitle(r.title),
        description: r.snippet || "",
        address: "",
        city: config.location.city,
        sourceUrl: r.link,
        rawData: JSON.stringify(r),
      }));

      const count = await upsertListings(items);
      totalCount += count;

      await logFetch("rednote", "search", "success", count, `Query: ${query}`, Date.now() - start);
      console.log(`[RedNote] "${query}" → ${count} results`);

      // Rate limiting
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[RedNote] Error for "${query}":`, msg);
      await logFetch("rednote", "search", "error", 0, msg, Date.now() - start);
    }
  }

  return totalCount;
}

function classifyRedNoteContent(query: string): string {
  if (query.includes("餐") || query.includes("美食") || query.includes("吃")) return "restaurant";
  if (query.includes("超市") || query.includes("食材")) return "grocery";
  if (query.includes("服务") || query.includes("律师") || query.includes("会计")) return "service";
  return "restaurant"; // default
}

function cleanTitle(title: string): string {
  return title
    .replace(/\s*-\s*小红书$/, "")
    .replace(/\s*\|\s*小红书$/, "")
    .replace(/\s*#\w+/g, "")
    .trim();
}
