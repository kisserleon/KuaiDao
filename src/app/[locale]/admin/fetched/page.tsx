import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import FetchedClient from "./client";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "zh" ? "审核列表 — 管理后台" : "Fetched Listings — Admin",
    description:
      locale === "zh" ? "审核和管理抓取的列表" : "Review and manage fetched listings",
  };
}

export default async function FetchedPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <FetchedClient />;
}
