import { describe, it, expect } from "vitest";
import { restaurants, groceryStores, serviceProviders, events } from "@/data/mock";

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  type: string;
};

function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];
  for (const r of restaurants) {
    results.push({
      id: `r-${r.id}`,
      title: `${r.nameZh} ${r.name}`,
      subtitle: r.cuisine.join(" · ") + " · " + r.address,
      type: "restaurant",
    });
  }
  for (const g of groceryStores) {
    results.push({
      id: `g-${g.id}`,
      title: `${g.nameZh} ${g.name}`,
      subtitle: g.specialties.join(" · ") + " · " + g.address,
      type: "grocery",
    });
  }
  for (const s of serviceProviders) {
    results.push({
      id: `s-${s.id}`,
      title: `${s.nameZh} ${s.name}`,
      subtitle: s.descriptionZh + " · " + s.city,
      type: "service",
    });
  }
  for (const e of events) {
    results.push({
      id: `e-${e.id}`,
      title: e.titleZh,
      subtitle: `${e.date} · ${e.location}`,
      type: "event",
    });
  }
  return results;
}

function search(query: string): SearchResult[] {
  const allItems = buildSearchIndex();
  const q = query.toLowerCase();
  return allItems.filter(
    (item) => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
  );
}

describe("search functionality", () => {
  it("finds restaurants by Chinese name", () => {
    const results = search("川菜馆");
    expect(results.length).toBe(1);
    expect(results[0].type).toBe("restaurant");
  });

  it("finds restaurants by English name", () => {
    const results = search("Hang Dai");
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].type).toBe("restaurant");
  });

  it("finds groceries by name", () => {
    const results = search("Asia Market");
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].type).toBe("grocery");
  });

  it("finds by address content", () => {
    const results = search("Dublin");
    expect(results.length).toBeGreaterThan(0);
  });

  it("finds services by Chinese name", () => {
    const results = search("汉龙");
    expect(results.length).toBe(1);
    expect(results[0].type).toBe("service");
  });

  it("finds events by title", () => {
    const results = search("农历新年");
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].type).toBe("event");
  });

  it("returns empty for no match", () => {
    const results = search("xyznonexistent123");
    expect(results).toEqual([]);
  });

  it("is case insensitive", () => {
    const upper = search("SICHUAN");
    const lower = search("sichuan");
    expect(upper.length).toBe(lower.length);
  });

  it("search index covers all data sources", () => {
    const index = buildSearchIndex();
    const types = new Set(index.map((i) => i.type));
    expect(types).toContain("restaurant");
    expect(types).toContain("grocery");
    expect(types).toContain("service");
    expect(types).toContain("event");
  });

  it("search index has unique IDs", () => {
    const index = buildSearchIndex();
    const ids = index.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
