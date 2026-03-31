"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ListingCard from "@/components/ui/ListingCard";
import { restaurants } from "@/data/mock";
import type { CuisineType } from "@/types";

const cuisineTypes: CuisineType[] = [
  "川菜", "粤菜", "湘菜", "火锅", "烧烤", "面食", "小吃", "奶茶", "日料", "韩餐", "东南亚",
];

type SortKey = "rating" | "reviews" | "price";

export default function RestaurantsClient() {
  const t = useTranslations();
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineType | "all">("all");
  const [sortBy, setSortBy] = useState<SortKey>("rating");

  const filtered = useMemo(() => {
    let list =
      selectedCuisine === "all"
        ? restaurants
        : restaurants.filter((r) => r.cuisine.includes(selectedCuisine));

    list = [...list].sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
      return a.priceLevel - b.priceLevel;
    });

    return list;
  }, [selectedCuisine, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t("restaurants.title")}
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {t("restaurants.subtitle")}
        </p>
      </div>

      {/* Sort controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {t("common.sortBy") ?? "Sort by"}:
        </span>
        {(["rating", "reviews", "price"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setSortBy(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              sortBy === key
                ? "bg-red-600 text-white"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-red-200 dark:hover:border-red-800"
            }`}
          >
            {key === "rating" && "⭐ Rating"}
            {key === "reviews" && "💬 Reviews"}
            {key === "price" && "💰 Price"}
          </button>
        ))}
      </div>

      {/* Cuisine Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedCuisine("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCuisine === "all"
              ? "bg-red-600 text-white"
              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-red-200 dark:hover:border-red-800"
          }`}
        >
          {t("restaurants.allCuisines")}
        </button>
        {cuisineTypes.map((cuisine) => (
          <button
            key={cuisine}
            onClick={() => setSelectedCuisine(cuisine)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCuisine === cuisine
                ? "bg-red-600 text-white"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-red-200 dark:hover:border-red-800"
            }`}
          >
            {cuisine}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {filtered.length} {t("common.results") ?? "results"}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((r) => (
          <ListingCard
            key={r.id}
            id={r.id}
            href={`/restaurants/${r.id}`}
            title={`${r.nameZh} ${r.name}`}
            subtitle={r.cuisine.join(" · ")}
            rating={r.rating}
            reviewCount={r.reviewCount}
            address={r.address}
            tags={r.tags}
            priceLevel={r.priceLevel}
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
