import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ServicesClient from "./client";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "zh" ? "华人服务 | 快到" : "Chinese-Speaking Services | KuaiDao",
    description:
      locale === "zh"
        ? "查找会中文的会计师、律师、房产经纪、医生等专业服务"
        : "Find Chinese-speaking accountants, lawyers, realtors, doctors, and more",
    openGraph: {
      title: locale === "zh" ? "华人服务 | 快到" : "Chinese-Speaking Services | KuaiDao",
      description:
        locale === "zh"
          ? "查找华人专业服务"
          : "Find Chinese-speaking professional services",
    },
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicesClient />;
}
