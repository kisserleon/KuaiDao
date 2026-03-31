import { describe, it, expect } from "vitest";
import type { Restaurant, GroceryStore, ServiceProvider, CommunityEvent, CuisineType, ServiceCategory } from "@/types";

describe("TypeScript types", () => {
  it("Restaurant type accepts valid data", () => {
    const restaurant: Restaurant = {
      id: "test",
      name: "Test",
      nameZh: "测试",
      cuisine: ["川菜"],
      address: "123 Main St",
      city: "Seattle",
      phone: "123-456-7890",
      rating: 4.5,
      reviewCount: 100,
      priceLevel: 2,
      imageUrl: "/test.jpg",
      hours: "9-5",
      description: "Test",
      descriptionZh: "测试",
      coordinates: { lat: 47.6, lng: -122.3 },
      tags: ["test"],
    };
    expect(restaurant.id).toBe("test");
    expect(restaurant.cuisine).toContain("川菜");
    expect(restaurant.priceLevel).toBe(2);
  });

  it("GroceryStore type accepts valid data", () => {
    const store: GroceryStore = {
      id: "test",
      name: "Test Market",
      nameZh: "测试超市",
      type: "supermarket",
      address: "456 Ave",
      city: "Bellevue",
      phone: "123-456-7890",
      rating: 4.0,
      imageUrl: "/test.jpg",
      hours: "8-10",
      specialties: ["Chinese groceries"],
      coordinates: { lat: 47.6, lng: -122.2 },
    };
    expect(store.type).toBe("supermarket");
    expect(["supermarket", "specialty", "bakery", "butcher"]).toContain(store.type);
  });

  it("ServiceProvider type accepts valid data", () => {
    const provider: ServiceProvider = {
      id: "test",
      name: "Test CPA",
      nameZh: "测试会计",
      category: "accountant",
      description: "Tax prep",
      descriptionZh: "报税",
      phone: "123-456-7890",
      email: "test@test.com",
      languages: ["中文", "English"],
      rating: 4.8,
      city: "Seattle",
      imageUrl: "/test.jpg",
    };
    expect(provider.category).toBe("accountant");
  });

  it("CommunityEvent type accepts valid data", () => {
    const event: CommunityEvent = {
      id: "test",
      title: "Test Event",
      titleZh: "测试活动",
      description: "A test",
      descriptionZh: "一个测试",
      date: "2026-01-01",
      time: "6:00 PM",
      location: "Community Center",
      city: "Seattle",
      imageUrl: "/test.jpg",
      category: "festival",
      isFree: true,
    };
    expect(event.isFree).toBe(true);
    expect(event.category).toBe("festival");
  });

  it("CuisineType covers all expected cuisines", () => {
    const cuisines: CuisineType[] = [
      "川菜", "粤菜", "湘菜", "火锅", "烧烤", "面食",
      "小吃", "奶茶", "日料", "韩餐", "东南亚", "其他",
    ];
    expect(cuisines).toHaveLength(12);
  });

  it("ServiceCategory covers all expected categories", () => {
    const categories: ServiceCategory[] = [
      "accountant", "lawyer", "realtor", "tutor", "doctor",
      "insurance", "immigration", "translation", "other",
    ];
    expect(categories).toHaveLength(9);
  });
});
