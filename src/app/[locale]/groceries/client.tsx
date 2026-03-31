"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ListingCard from "@/components/ui/ListingCard";
import { groceryStores } from "@/data/mock";
import type { GroceryStore } from "@/types";

const storeTypes = ["all", "supermarket", "specialty", "bakery", "butcher"] as const;
type StoreTypeFilter = (typeof storeTypes)[number];

export default function GroceriesClient() {
  const t = useTranslations();
  const [selectedType, setSelectedType] = useState<StoreTypeFilter>("all");

  const filtered = useMemo(() => {
    if (selectedType === "all") return groceryStores;
    return groceryStores.filter((g) => g.type === selectedType);
  }, [selectedType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t("groceries.title")}
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {t("groceries.subtitle")}
        </p>
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {storeTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedType === type
                ? "bg-red-600 text-white"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-red-200 dark:hover:border-red-800"
            }`}
          >
            {t(`groceries.types.${type}`)}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {filtered.length} {t("common.results") ?? "results"}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((g) => (
          <ListingCard
            key={g.id}
            id={g.id}
            href={`/groceries/${g.id}`}
            title={`${g.nameZh} ${g.name}`}
            subtitle={g.specialties.join(" · ")}
            rating={g.rating}
            address={g.address}
            tags={g.specialties.slice(0, 3)}
          />
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
