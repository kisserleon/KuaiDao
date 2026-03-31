import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import RegisterClient from "./client";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "zh" ? "注册 — 筷道" : "Register — KuaiDao" };
}

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RegisterClient />;
}
