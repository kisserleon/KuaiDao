import { describe, it, expect } from "vitest";
import {
  restaurants,
  groceryStores,
  serviceProviders,
  events,
} from "@/data/mock";

describe("restaurants mock data", () => {
  it("has at least one restaurant", () => {
    expect(restaurants.length).toBeGreaterThan(0);
  });

  it("each restaurant has required fields", () => {
    for (const r of restaurants) {
      expect(r.id).toBeTruthy();
      expect(r.name).toBeTruthy();
      expect(r.nameZh).toBeTruthy();
      expect(r.cuisine.length).toBeGreaterThan(0);
      expect(r.address).toBeTruthy();
      expect(r.phone).toBeTruthy();
      expect(r.rating).toBeGreaterThanOrEqual(0);
      expect(r.rating).toBeLessThanOrEqual(5);
      expect([1, 2, 3, 4]).toContain(r.priceLevel);
      expect(r.coordinates.lat).toBeDefined();
      expect(r.coordinates.lng).toBeDefined();
    }
  });

  it("has unique IDs", () => {
    const ids = restaurants.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has valid cuisine types", () => {
    const validCuisines = [
      "川菜", "粤菜", "湘菜", "火锅", "烧烤", "面食",
      "小吃", "奶茶", "日料", "韩餐", "东南亚", "其他",
    ];
    for (const r of restaurants) {
      for (const c of r.cuisine) {
        expect(validCuisines).toContain(c);
      }
    }
  });
});

describe("groceryStores mock data", () => {
  it("has at least one store", () => {
    expect(groceryStores.length).toBeGreaterThan(0);
  });

  it("each store has required fields", () => {
    for (const g of groceryStores) {
      expect(g.id).toBeTruthy();
      expect(g.name).toBeTruthy();
      expect(g.nameZh).toBeTruthy();
      expect(["supermarket", "specialty", "bakery", "butcher"]).toContain(g.type);
      expect(g.address).toBeTruthy();
      expect(g.rating).toBeGreaterThanOrEqual(0);
      expect(g.rating).toBeLessThanOrEqual(5);
      expect(g.specialties.length).toBeGreaterThan(0);
      expect(g.coordinates.lat).toBeDefined();
      expect(g.coordinates.lng).toBeDefined();
    }
  });

  it("has unique IDs", () => {
    const ids = groceryStores.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("serviceProviders mock data", () => {
  it("has at least one provider", () => {
    expect(serviceProviders.length).toBeGreaterThan(0);
  });

  it("each provider has required fields", () => {
    const validCategories = [
      "accountant", "lawyer", "realtor", "tutor", "doctor",
      "insurance", "immigration", "translation", "other",
    ];
    for (const s of serviceProviders) {
      expect(s.id).toBeTruthy();
      expect(s.name).toBeTruthy();
      expect(s.nameZh).toBeTruthy();
      expect(validCategories).toContain(s.category);
      expect(s.phone).toBeTruthy();
      expect(s.email).toMatch(/@/);
      expect(s.languages.length).toBeGreaterThan(0);
      expect(s.rating).toBeGreaterThanOrEqual(0);
      expect(s.rating).toBeLessThanOrEqual(5);
    }
  });

  it("has unique IDs", () => {
    const ids = serviceProviders.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("events mock data", () => {
  it("has at least one event", () => {
    expect(events.length).toBeGreaterThan(0);
  });

  it("each event has required fields", () => {
    const validCategories = [
      "festival", "community", "workshop", "food", "culture", "other",
    ];
    for (const e of events) {
      expect(e.id).toBeTruthy();
      expect(e.title).toBeTruthy();
      expect(e.titleZh).toBeTruthy();
      expect(e.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(e.location).toBeTruthy();
      expect(validCategories).toContain(e.category);
      expect(typeof e.isFree).toBe("boolean");
    }
  });

  it("has unique IDs", () => {
    const ids = events.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
