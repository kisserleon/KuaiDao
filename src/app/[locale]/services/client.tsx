"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { serviceProviders } from "@/data/mock";
import { Star, Phone, Mail, Globe } from "lucide-react";
import type { ServiceCategory } from "@/types";

const categoryKeys = [
  "all", "accountant", "lawyer", "realtor", "tutor", "doctor", "insurance", "immigration", "translation",
] as const;

type CategoryFilter = (typeof categoryKeys)[number];

export default function ServicesClient() {
  const t = useTranslations();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");

  const filtered = useMemo(() => {
    if (selectedCategory === "all") return serviceProviders;
    return serviceProviders.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t("services.title")}
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {t("services.subtitle")}
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
            {t(`services.categories.${cat}`)}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {filtered.length} {t("common.results") ?? "results"}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-800 hover:shadow-lg transition-all p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {s.nameZh}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{s.name}</p>
              </div>
              <span className="px-2.5 py-1 text-xs bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full font-medium">
                {t(`services.categories.${s.category}`)}
              </span>
            </div>

            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              {s.descriptionZh}
            </p>

            <div className="flex items-center gap-1.5 mt-3">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {s.rating.toFixed(1)}
              </span>
            </div>

            <div className="mt-4 space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Phone size={13} />
                {s.phone}
              </div>
              <div className="flex items-center gap-2">
                <Mail size={13} />
                {s.email}
              </div>
              <div className="flex items-center gap-2">
                <Globe size={13} />
                {s.languages.join(" / ")}
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
