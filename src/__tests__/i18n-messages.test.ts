import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const zhMessages = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../messages/zh.json"), "utf-8")
);
const enMessages = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../messages/en.json"), "utf-8")
);

function flattenKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null) {
      keys.push(...flattenKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

describe("i18n messages", () => {
  const zhKeys = flattenKeys(zhMessages);
  const enKeys = flattenKeys(enMessages);

  it("zh.json is not empty", () => {
    expect(zhKeys.length).toBeGreaterThan(0);
  });

  it("en.json is not empty", () => {
    expect(enKeys.length).toBeGreaterThan(0);
  });

  it("zh and en have the same keys", () => {
    const zhSet = new Set(zhKeys);
    const enSet = new Set(enKeys);

    const missingInEn = zhKeys.filter((k) => !enSet.has(k));
    const missingInZh = enKeys.filter((k) => !zhSet.has(k));

    expect(missingInEn).toEqual([]);
    expect(missingInZh).toEqual([]);
  });

  it("no empty string values in zh", () => {
    for (const key of zhKeys) {
      const value = key.split(".").reduce((obj: Record<string, unknown>, k) => obj[k] as Record<string, unknown>, zhMessages);
      expect(value, `zh key "${key}" is empty`).toBeTruthy();
    }
  });

  it("no empty string values in en", () => {
    for (const key of enKeys) {
      const value = key.split(".").reduce((obj: Record<string, unknown>, k) => obj[k] as Record<string, unknown>, enMessages);
      expect(value, `en key "${key}" is empty`).toBeTruthy();
    }
  });

  it("has all required top-level sections", () => {
    const requiredSections = ["common", "nav", "home", "restaurants", "groceries", "services", "events", "guide", "footer"];
    for (const section of requiredSections) {
      expect(zhMessages).toHaveProperty(section);
      expect(enMessages).toHaveProperty(section);
    }
  });

  it("nav section has all page links", () => {
    const navKeys = ["home", "restaurants", "groceries", "services", "events", "guide"];
    for (const key of navKeys) {
      expect(zhMessages.nav).toHaveProperty(key);
      expect(enMessages.nav).toHaveProperty(key);
    }
  });
});
