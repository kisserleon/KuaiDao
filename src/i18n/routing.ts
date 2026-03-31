import { defineRouting } from "next-intl/routing";

export type Locale = "zh" | "en";

export const routing = defineRouting({
  locales: ["zh", "en"] as const,
  defaultLocale: "zh" as const,
});
