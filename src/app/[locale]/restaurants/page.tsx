import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import RestaurantsClient from "./client";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "zh" ? "中餐馆 | 快到" : "Chinese Restaurants | KuaiDao",
    description:
      locale === "zh"
        ? "发现附近最好的中餐馆，涵盖川菜、粤菜、火锅等各种菜系"
        : "Discover the best Chinese restaurants nearby — Sichuan, Cantonese, hotpot, and more",
    openGraph: {
      title: locale === "zh" ? "中餐馆 | 快到" : "Chinese Restaurants | KuaiDao",
      description:
        locale === "zh"
          ? "发现附近最好的中餐馆"
          : "Discover the best Chinese restaurants nearby",
    },
  };
}

export default async function RestaurantsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RestaurantsClient />;
}
