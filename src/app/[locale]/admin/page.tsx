import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import AdminClient from "./client";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "zh" ? "管理后台 — 筷道" : "Admin Dashboard — KuaiDao",
    description:
      locale === "zh"
        ? "筷道管理后台 — 管理餐厅、审核列表、用户管理"
        : "KuaiDao Admin — Manage restaurants, approve listings, manage users",
  };
}

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminClient />;
}
