"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Star, Phone, Mail, Globe, ArrowLeft } from "lucide-react";
import type { ServiceProvider } from "@/types";

export default function ServiceDetailClient({ provider: s }: { provider: ServiceProvider }) {
  const t = useTranslations();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/services" className="inline-flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 mb-6">
        <ArrowLeft size={16} /> {t("common.back")}
      </Link>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 flex items-center justify-center">
          <span className="text-8xl">💼</span>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{s.nameZh}</h1>
              <p className="text-lg text-gray-500 dark:text-gray-400">{s.name}</p>
            </div>
            <span className="px-3 py-1.5 text-sm bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full font-medium">
              {t(`services.categories.${s.category}`)}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">{s.rating.toFixed(1)}</span>
          </div>

          <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">{s.descriptionZh}</p>
          <p className="mt-2 text-gray-500 dark:text-gray-400">{s.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div className="flex items-center gap-3 text-sm">
              <Phone size={18} className="text-blue-500 shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{s.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail size={18} className="text-blue-500 shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{s.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Globe size={18} className="text-blue-500 shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{s.languages.join(" / ")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
