import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import SearchClient from "./client";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "zh" ? "搜索 — 筷道" : "Search — KuaiDao",
    description: locale === "zh" ? "搜索餐厅、超市、服务和活动" : "Search restaurants, groceries, services and events",
  };
}

export default async function SearchPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense>
      <SearchClient />
    </Suspense>
  );
}
