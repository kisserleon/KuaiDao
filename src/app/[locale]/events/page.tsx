import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import EventsClient from "./client";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "zh" ? "社区活动 | 快到" : "Community Events | KuaiDao",
    description:
      locale === "zh"
        ? "发现华人社区活动、节日庆典、工作坊和文化体验"
        : "Discover Chinese community events, festivals, workshops, and cultural experiences",
    openGraph: {
      title: locale === "zh" ? "社区活动 | 快到" : "Community Events | KuaiDao",
      description:
        locale === "zh"
          ? "发现华人社区活动"
          : "Discover Chinese community events",
    },
  };
}

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EventsClient />;
}
