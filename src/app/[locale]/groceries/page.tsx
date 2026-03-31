import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import GroceriesClient from "./client";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "zh" ? "华人超市 | 快到" : "Asian Grocery Stores | KuaiDao",
    description:
      locale === "zh"
        ? "查找附近的华人超市、烘焙店和特色食品店"
        : "Find nearby Asian supermarkets, bakeries, and specialty food stores",
    openGraph: {
      title: locale === "zh" ? "华人超市 | 快到" : "Asian Grocery Stores | KuaiDao",
      description:
        locale === "zh"
          ? "查找附近的华人超市"
          : "Find nearby Asian grocery stores",
    },
  };
}

export default async function GroceriesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <GroceriesClient />;
}
