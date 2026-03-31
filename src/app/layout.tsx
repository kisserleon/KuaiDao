import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "筷道 KuaiDao — 发现你身边的中华味道",
  description:
    "一站式本地华人生活信息平台——美食、超市、服务、社区活动，尽在筷道。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
