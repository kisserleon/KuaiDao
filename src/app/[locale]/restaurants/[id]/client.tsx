"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Star, MapPin, Phone, Clock, ArrowLeft, Tag } from "lucide-react";
import type { Restaurant } from "@/types";
import dynamic from "next/dynamic";
import ReviewSection from "@/components/features/ReviewSection";

const MiniMap = dynamic(() => import("@/components/features/MiniMap"), { ssr: false });

export default function RestaurantDetailClient({ restaurant: r }: { restaurant: Restaurant }) {
  const t = useTranslations();
  const locale = useLocale();
  const isZh = locale === "zh";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/restaurants" className="inline-flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 mb-6">
        <ArrowLeft size={16} /> {t("common.back")}
      </Link>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {/* Hero banner */}
        <div className="h-48 md:h-64 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-950/40 dark:to-orange-950/40 flex items-center justify-center">
          <span className="text-8xl">🍜</span>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {r.nameZh} <span className="text-lg text-gray-500 dark:text-gray-400 font-normal">{r.name}</span>
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{isZh ? r.descriptionZh : r.description}</p>
            </div>
            <span className="text-lg text-green-700 dark:text-green-400 font-semibold shrink-0">{"$".repeat(r.priceLevel)}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-full">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <span className="font-semibold text-amber-700 dark:text-amber-400">{r.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{r.reviewCount} {t("common.reviews")}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {r.cuisine.map((c) => (
              <span key={c} className="px-3 py-1 text-sm bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full font-medium">{c}</span>
            ))}
            {r.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full">
                <Tag size={12} className="inline mr-1" />{tag}
              </span>
            ))}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={18} className="text-red-500 shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{r.address}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone size={18} className="text-red-500 shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{r.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock size={18} className="text-red-500 shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{r.hours}</span>
            </div>
          </div>

          {/* Mini Map */}
          <div className="mt-6 h-64 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <MiniMap lat={r.coordinates.lat} lng={r.coordinates.lng} name={r.nameZh} />
          </div>

          <ReviewSection targetType="restaurant" targetId={r.id} />
        </div>
      </div>
    </div>
  );
}
