"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  className?: string;
  redirect?: boolean;
}

export default function SearchBar({ onSearch, className = "", redirect = false }: SearchBarProps) {
  const t = useTranslations("common");
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (redirect && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      onSearch?.(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-700 focus:border-transparent transition-all shadow-sm"
      />
    </form>
  );
}
