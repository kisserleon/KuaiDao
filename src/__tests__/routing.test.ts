import { describe, it, expect } from "vitest";
import { routing } from "@/i18n/routing";

describe("i18n routing config", () => {
  it("has zh and en locales", () => {
    expect(routing.locales).toContain("zh");
    expect(routing.locales).toContain("en");
  });

  it("has exactly 2 locales", () => {
    expect(routing.locales).toHaveLength(2);
  });

  it("defaults to zh", () => {
    expect(routing.defaultLocale).toBe("zh");
  });
});
