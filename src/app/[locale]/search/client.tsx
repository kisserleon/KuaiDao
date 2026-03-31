"use client";

import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { restaurants, groceryStores, serviceProviders, events } from "@/data/mock";

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  type: "restaurant" | "grocery" | "service" | "event";
  href: string;
  emoji: string;
};

function buildSearchIndex(locale: string): SearchResult[] {
  const isZh = locale === "zh";
  const results: SearchResult[] = [];

  for (const r of restaurants) {
    results.push({
      id: `r-${r.id}`,
      title: `${r.nameZh} ${r.name}`,
      subtitle: r.cuisine.join(" · ") + " · " + r.address,
      type: "restaurant",
      href: `/restaurants/${r.id}`,
      emoji: "🍜",
    });
  }
  for (const g of groceryStores) {
    results.push({
      id: `g-${g.id}`,
      title: `${g.nameZh} ${g.name}`,
      subtitle: g.specialties.join(" · ") + " · " + g.address,
      type: "grocery",
      href: `/groceries/${g.id}`,
      emoji: "🛒",
    });
  }
  for (const s of serviceProviders) {
    results.push({
      id: `s-${s.id}`,
      title: `${s.nameZh} ${s.name}`,
      subtitle: (isZh ? s.descriptionZh : s.description) + " · " + s.city,
      type: "service",
      href: `/services/${s.id}`,
      emoji: "💼",
    });
  }
  for (const e of events) {
    results.push({
      id: `e-${e.id}`,
      title: isZh ? e.titleZh : e.title,
      subtitle: `${e.date} · ${e.location}`,
      type: "event",
      href: `/events`,
      emoji: "🎉",
    });
  }
  return results;
}

export default function SearchClient() {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const allItems = useMemo(() => buildSearchIndex(locale), [locale]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allItems.filter(
      (item) => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
    );
  }, [query, allItems]);

  const typeLabels: Record<string, string> = {
    restaurant: "🍜 " + t("nav.restaurants"),
    grocery: "🛒 " + t("nav.groceries"),
    service: "💼 " + t("nav.services"),
    event: "🎉 " + t("nav.events"),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t("common.search")}</h1>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("common.searchPlaceholder")}
          autoFocus
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-700 transition-all"
        />
      </div>

      {query.trim() && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {results.length} {t("common.reviews")}
        </p>
      )}

      <div className="space-y-3">
        {results.map((item) => (
          <Link key={item.id} href={item.href} className="block group">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-800 p-4 transition-all">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{item.subtitle}</p>
                  <span className="inline-block text-xs text-gray-400 mt-1">{typeLabels[item.type]}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
        {query.trim() && results.length === 0 && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">
            <span className="text-4xl block mb-4">🔍</span>
            {t("common.noResults")}
          </div>
        )}
      </div>
    </div>
  );
}
