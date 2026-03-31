"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Star, MapPin, Phone, Clock, ArrowLeft } from "lucide-react";
import type { GroceryStore } from "@/types";
import dynamic from "next/dynamic";

const MiniMap = dynamic(() => import("@/components/features/MiniMap"), { ssr: false });

export default function GroceryDetailClient({ store: g }: { store: GroceryStore }) {
  const t = useTranslations();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/groceries" className="inline-flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 mb-6">
        <ArrowLeft size={16} /> {t("common.back")}
      </Link>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="h-48 md:h-64 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 flex items-center justify-center">
          <span className="text-8xl">🛒</span>
        </div>

        <div className="p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {g.nameZh} <span className="text-lg text-gray-500 dark:text-gray-400 font-normal">{g.name}</span>
          </h1>

          <div className="flex items-center gap-2 mt-3">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">{g.rating.toFixed(1)}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {g.specialties.map((s) => (
              <span key={s} className="px-3 py-1 text-sm bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 rounded-full font-medium">{s}</span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={18} className="text-green-500 shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{g.address}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone size={18} className="text-green-500 shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{g.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock size={18} className="text-green-500 shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{g.hours}</span>
            </div>
          </div>

          <div className="mt-6 h-64 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <MiniMap lat={g.coordinates.lat} lng={g.coordinates.lng} name={g.nameZh} />
          </div>
        </div>
      </div>
    </div>
  );
}
