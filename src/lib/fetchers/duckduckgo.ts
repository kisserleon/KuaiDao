import { loadConfig } from "./config";
import { upsertListings, logFetch } from "./store";

/**
 * DuckDuckGo search fetcher for RedNote (小红书) content.
 * 100% free, no API key, no signup required.
 * Uses DuckDuckGo HTML search to find xiaohongshu.com content.
 */

const DDG_URL = "https://html.duckduckgo.com/html/";

export async function fetchFromDuckDuckGo(): Promise<number> {
  const config = loadConfig();
  const { queries, maxResultsPerQuery } = config.sources.rednote;
  let totalCount = 0;

  for (const query of queries) {
    const start = Date.now();
    try {
      const searchQuery = `site:xiaohongshu.com ${query}`;
      console.log(`[DuckDuckGo] Searching: "${searchQuery}"`);

      const res = await fetch(DDG_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "KuaiDao/1.0 (Community Info Aggregator)",
        },
        body: `q=${encodeURIComponent(searchQuery)}`,
      });

      if (!res.ok) {
        const err = `HTTP ${res.status}`;
        console.error(`[DuckDuckGo] Error for "${query}":`, err);
        await logFetch("duckduckgo", "rednote", "error", 0, err, Date.now() - start);
        continue;
      }

      const html = await res.text();
      const items = parseResults(html, query, config.location.city, maxResultsPerQuery);
      const count = await upsertListings(items);
      totalCount += count;

      await logFetch("duckduckgo", "rednote", "success", count, `Query: ${query}`, Date.now() - start);
      console.log(`[DuckDuckGo] "${query}" → ${count} results`);

      // Rate limiting — be respectful
      await new Promise((r) => setTimeout(r, 2000));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[DuckDuckGo] Error for "${query}":`, msg);
      await logFetch("duckduckgo", "rednote", "error", 0, msg, Date.now() - start);
    }
  }

  return totalCount;
}

function parseResults(html: string, query: string, city: string, max: number) {
  const items: Array<{
    source: string;
    sourceId: string;
    type: string;
    name: string;
    nameZh: string;
    description: string;
    city: string;
    sourceUrl: string;
    rawData: string;
  }> = [];

  // Extract result links and snippets from DuckDuckGo HTML
  const resultPattern = /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  const snippetPattern = /<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi;

  const links: string[] = [];
  const titles: string[] = [];
  const snippets: string[] = [];

  let match;
  while ((match = resultPattern.exec(html)) !== null) {
    const url = decodeURIComponent(match[1].replace(/.*uddg=/, "").replace(/&.*/, ""));
    const title = match[2].replace(/<[^>]+>/g, "").trim();
    if (url.includes("xiaohongshu.com")) {
      links.push(url);
      titles.push(title);
    }
  }

  while ((match = snippetPattern.exec(html)) !== null) {
    snippets.push(match[1].replace(/<[^>]+>/g, "").trim());
  }

  for (let i = 0; i < Math.min(links.length, max); i++) {
    const title = cleanTitle(titles[i] || "");
    if (!title) continue;

    items.push({
      source: "rednote",
      sourceId: `rn-${Buffer.from(links[i]).toString("base64url").slice(0, 40)}`,
      type: classifyContent(query),
      name: title,
      nameZh: title,
      description: snippets[i] || "",
      city,
      sourceUrl: links[i],
      rawData: JSON.stringify({ title: titles[i], snippet: snippets[i], url: links[i] }),
    });
  }

  return items;
}

function classifyContent(query: string): string {
  if (/餐|美食|吃|食堂/.test(query)) return "restaurant";
  if (/超市|食材|买菜/.test(query)) return "grocery";
  if (/服务|律师|会计|医/.test(query)) return "service";
  return "restaurant";
}

function cleanTitle(title: string): string {
  return title
    .replace(/\s*[-|]\s*小红书.*$/, "")
    .replace(/\s*#\w+/g, "")
    .trim();
}
