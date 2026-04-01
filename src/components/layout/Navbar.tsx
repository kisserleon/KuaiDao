"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Menu, X, User, LogOut, Shield } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  const t = useTranslations();
  const { data: session } = useSession();
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

            {session?.user ? (
              <div className="hidden md:flex items-center gap-2">
                {(session.user as { role?: string }).role === "admin" && (
                  <Link href="/admin" className="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-full transition-colors" title="Admin">
                    <Shield size={18} />
                  </Link>
                )}
                <span className="text-sm text-gray-600 dark:text-gray-300 max-w-[100px] truncate">{session.user.name}</span>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-1">
                <Link href="/login" className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-400 transition-colors">
                  登录
                </Link>
                <Link href="/register" className="px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                  注册
                </Link>
              </div>
            )}

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
            <div className="border-t border-red-100 dark:border-gray-800 mt-2 pt-2">
              {session?.user ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    <User size={14} className="inline mr-1" /> {session.user.name}
                  </div>
                  {(session.user as { role?: string }).role === "admin" && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50">
                      <Shield size={14} className="inline mr-1" /> 管理后台
                    </Link>
                  )}
                  <button onClick={() => { signOut(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950">
                    <LogOut size={14} className="inline mr-1" /> 退出登录
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300">
                    登录 Login
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400">
                    注册 Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
