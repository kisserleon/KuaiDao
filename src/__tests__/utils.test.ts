import { describe, it, expect } from "vitest";
import { getLocalizedField, formatPrice, formatRating } from "@/lib/utils";

describe("getLocalizedField", () => {
  const item = {
    name: "Sichuan Garden",
    nameZh: "蜀园",
    description: "Spicy food",
    descriptionZh: "麻辣鲜香",
  };

  it("returns Chinese field when locale is zh", () => {
    expect(getLocalizedField(item, "name", "zh")).toBe("蜀园");
  });

  it("returns English field when locale is en", () => {
    expect(getLocalizedField(item, "name", "en")).toBe("Sichuan Garden");
  });

  it("falls back to base field if zh field is missing", () => {
    const partial = { name: "Test", title: "Hello" };
    expect(getLocalizedField(partial, "name", "zh")).toBe("Test");
  });

  it("falls back to base field if zh field is empty", () => {
    const item = { name: "Test", nameZh: "" };
    expect(getLocalizedField(item, "name", "zh")).toBe("Test");
  });

  it("returns empty string if field does not exist", () => {
    expect(getLocalizedField({}, "missing", "en")).toBe("");
  });

  it("works for description field", () => {
    expect(getLocalizedField(item, "description", "zh")).toBe("麻辣鲜香");
    expect(getLocalizedField(item, "description", "en")).toBe("Spicy food");
  });
});

describe("formatPrice", () => {
  it("returns correct dollar signs for each level", () => {
    expect(formatPrice(1)).toBe("$");
    expect(formatPrice(2)).toBe("$$");
    expect(formatPrice(3)).toBe("$$$");
    expect(formatPrice(4)).toBe("$$$$");
  });

  it("returns empty string for 0", () => {
    expect(formatPrice(0)).toBe("");
  });
});

describe("formatRating", () => {
  it("formats to one decimal place", () => {
    expect(formatRating(4.7)).toBe("4.7");
    expect(formatRating(4.0)).toBe("4.0");
    expect(formatRating(3.14)).toBe("3.1");
  });

  it("handles perfect scores", () => {
    expect(formatRating(5)).toBe("5.0");
  });

  it("handles zero", () => {
    expect(formatRating(0)).toBe("0.0");
  });
});
