import type { Locale } from "@/types";

export function getLocalizedField<T extends Record<string, unknown>>(
  item: T,
  field: string,
  locale: Locale
): string {
  if (locale === "zh") {
    const zhField = `${field}Zh`;
    if (zhField in item && item[zhField]) return item[zhField] as string;
  }
  return (item[field] as string) || "";
}

export function formatPrice(level: number): string {
  return "$".repeat(level);
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}
