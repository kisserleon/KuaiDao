"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/restaurants", label: t("nav.restaurants") },
    { href: "/groceries", label: t("nav.groceries") },
    { href: "/services", label: t("nav.services") },
    { href: "/events", label: t("nav.events") },
    { href: "/guide", label: t("nav.guide") },
    { href: "/map", label: "🗺️" },
  ];

  const switchLocale = () => {
    const next = locale === "zh" ? "en" : "zh";
    router.replace(pathname, { locale: next });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-red-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🥢</span>
            <span className="text-xl font-bold text-red-700 dark:text-red-400 group-hover:text-red-600 transition-colors">
              筷道
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">KuaiDao</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={switchLocale}
              className="px-3 py-1.5 text-sm font-medium border border-red-200 dark:border-red-800 rounded-full text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
            >
              {t("common.switchLang")}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-red-700"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-red-100 dark:border-gray-800 mt-2 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                  pathname === item.href
                    ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-950"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
