import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { groceryStores } from "@/data/mock";
import GroceryDetailClient from "./client";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const g = groceryStores.find((g) => g.id === id);
  if (!g) return { title: "Not Found" };
  const isZh = locale === "zh";
  return {
    title: isZh ? `${g.nameZh} — 筷道` : `${g.name} — KuaiDao`,
    description: g.specialties.join(", "),
  };
}

export function generateStaticParams() {
  return groceryStores.map((g) => ({ id: g.id }));
}

export default async function GroceryDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const store = groceryStores.find((g) => g.id === id);
  if (!store) notFound();
  return <GroceryDetailClient store={store} />;
}
