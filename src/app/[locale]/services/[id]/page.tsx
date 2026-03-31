import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { serviceProviders } from "@/data/mock";
import ServiceDetailClient from "./client";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const s = serviceProviders.find((s) => s.id === id);
  if (!s) return { title: "Not Found" };
  const isZh = locale === "zh";
  return {
    title: isZh ? `${s.nameZh} — 筷道` : `${s.name} — KuaiDao`,
    description: isZh ? s.descriptionZh : s.description,
  };
}

export function generateStaticParams() {
  return serviceProviders.map((s) => ({ id: s.id }));
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const provider = serviceProviders.find((s) => s.id === id);
  if (!provider) notFound();
  return <ServiceDetailClient provider={provider} />;
}
