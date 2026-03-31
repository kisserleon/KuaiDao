import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { restaurants } from "@/data/mock";
import RestaurantDetailClient from "./client";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const r = restaurants.find((r) => r.id === id);
  if (!r) return { title: "Not Found" };
  const isZh = locale === "zh";
  return {
    title: isZh ? `${r.nameZh} — 筷道` : `${r.name} — KuaiDao`,
    description: isZh ? r.descriptionZh : r.description,
    openGraph: { title: `${r.nameZh} ${r.name}`, description: isZh ? r.descriptionZh : r.description },
  };
}

export function generateStaticParams() {
  return restaurants.map((r) => ({ id: r.id }));
}

export default async function RestaurantDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const restaurant = restaurants.find((r) => r.id === id);
  if (!restaurant) notFound();
  return <RestaurantDetailClient restaurant={restaurant} />;
}
