import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import LoginClient from "./client";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "zh" ? "登录 — 筷道" : "Login — KuaiDao" };
}

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LoginClient />;
}
