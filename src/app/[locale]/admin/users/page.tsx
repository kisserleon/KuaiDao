import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import UsersClient from "./client";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "zh" ? "用户管理 — 管理后台" : "User Management — Admin",
    description:
      locale === "zh" ? "管理用户角色和权限" : "Manage user roles and permissions",
  };
}

export default async function UsersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <UsersClient />;
}
