import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import MapClient from "./client";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "zh" ? "地图 — 筷道" : "Map — KuaiDao",
    description: locale === "zh" ? "在地图上查看所有中餐厅和亚洲超市" : "View all Chinese restaurants and Asian groceries on the map",
  };
}

export default async function MapPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MapClient />;
}
