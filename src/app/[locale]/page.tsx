import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SearchBar from "@/components/ui/SearchBar";
import ListingCard from "@/components/ui/ListingCard";
import { restaurants, groceryStores, events } from "@/data/mock";
import { UtensilsCrossed, ShoppingCart, Briefcase, Calendar, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";
  return {
    title: isZh ? "筷道 KuaiDao — 发现你身边的中华味道" : "KuaiDao — Discover Chinese Flavors Near You",
    description: isZh
      ? "一站式本地华人生活信息平台——美食、超市、服务、社区活动，尽在筷道。"
      : "Your one-stop platform for local Chinese community — restaurants, groceries, services, and events.",
    openGraph: {
      title: "筷道 KuaiDao",
      description: isZh ? "发现你身边的中华味道" : "Discover Chinese Flavors Near You",
      type: "website",
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations();

  const stats = [
    { icon: UtensilsCrossed, count: "120+", label: t("home.stats.restaurants"), bg: "bg-red-50 dark:bg-red-950/40", iconColor: "text-red-500" },
    { icon: ShoppingCart, count: "30+", label: t("home.stats.groceries"), bg: "bg-green-50 dark:bg-green-950/40", iconColor: "text-green-500" },
    { icon: Briefcase, count: "80+", label: t("home.stats.services"), bg: "bg-blue-50 dark:bg-blue-950/40", iconColor: "text-blue-500" },
    { icon: Calendar, count: "15", label: t("home.stats.events"), bg: "bg-purple-50 dark:bg-purple-950/40", iconColor: "text-purple-500" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-red-700 via-red-600 to-orange-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">🥢</div>
          <div className="absolute top-20 right-20 text-6xl">🏮</div>
          <div className="absolute bottom-10 left-1/3 text-7xl">🧧</div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {t("home.hero.title")}
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-red-100 font-light">
              {t("home.hero.subtitle")}
            </p>
            <p className="mt-4 text-base text-red-200 max-w-xl mx-auto">
              {t("home.hero.description")}
            </p>
            <div className="mt-8 max-w-lg mx-auto">
              <SearchBar redirect />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="-mt-8 relative z-10 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-2xl p-4 text-center shadow-md border border-gray-100 dark:border-gray-800">
              <div className={`inline-flex p-2 rounded-xl ${stat.bg} mb-2`}>
                <stat.icon className={stat.iconColor} size={24} />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.count}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">🍜 {t("home.featured.restaurants")}</h2>
          <Link href="/restaurants" className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-700 text-sm font-medium">
            {t("common.viewAll")} <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.slice(0, 3).map((r) => (
            <ListingCard key={r.id} id={r.id} href={`/restaurants/${r.id}`} title={`${r.nameZh} ${r.name}`} subtitle={r.cuisine.join(" · ")} rating={r.rating} reviewCount={r.reviewCount} address={r.address} tags={r.tags} priceLevel={r.priceLevel} />
          ))}
        </div>
      </section>

      {/* Featured Groceries */}
      <section className="bg-white dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">🛒 {t("home.featured.groceries")}</h2>
            <Link href="/groceries" className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-700 text-sm font-medium">
              {t("common.viewAll")} <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groceryStores.map((g) => (
              <ListingCard key={g.id} id={g.id} href={`/groceries/${g.id}`} title={`${g.nameZh} ${g.name}`} subtitle={g.specialties.join(" · ")} rating={g.rating} address={g.address} tags={g.specialties.slice(0, 3)} emoji="🛒" />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">🎉 {t("home.featured.events")}</h2>
          <Link href="/events" className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-700 text-sm font-medium">
            {t("common.viewAll")} <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((e) => (
            <div key={e.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-800 hover:shadow-lg transition-all p-6">
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 font-medium mb-2">
                <Calendar size={14} /> {e.date} · {e.time}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{e.titleZh}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{e.descriptionZh}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>📍 {e.location}</span>
                {e.isFree && <span className="px-2 py-0.5 bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-full font-medium">{t("common.free")}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
