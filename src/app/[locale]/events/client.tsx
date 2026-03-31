"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { events } from "@/data/mock";
import { Calendar, MapPin } from "lucide-react";

const categoryKeys = ["all", "festival", "community", "workshop", "food", "culture"] as const;
type CategoryFilter = (typeof categoryKeys)[number];

export default function EventsClient() {
  const t = useTranslations();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");

  const filtered = useMemo(() => {
    if (selectedCategory === "all") return events;
    return events.filter((e) => e.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t("events.title")}
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {t("events.subtitle")}
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categoryKeys.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-red-600 text-white"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-red-200 dark:hover:border-red-800"
            }`}
          >
            {t(`events.categories.${cat}`)}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {filtered.length} {t("common.results") ?? "results"}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((e) => (
          <div
            key={e.id}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-800 hover:shadow-lg transition-all overflow-hidden"
          >
            <div className="h-32 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 flex items-center justify-center">
              <span className="text-4xl">🎊</span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 font-medium mb-2">
                <Calendar size={14} />
                {e.date} · {e.time}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {e.titleZh}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {e.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {e.descriptionZh}
              </p>

              <div className="flex items-center justify-between mt-4 text-xs text-gray-400 dark:text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin size={12} />
                  {e.location}
                </div>
                {e.isFree && (
                  <span className="px-2 py-0.5 bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-full font-medium">
                    {t("common.free")}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          {t("common.noResults") ?? "No results found"}
        </div>
      )}
    </div>
  );
}
