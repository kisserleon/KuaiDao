import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  if (!session || role !== "admin") {
    redirect(`/${locale}/login`);
  }
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-4 text-sm">
          <span className="font-semibold text-amber-700 dark:text-amber-400">
            🛡️ Admin
          </span>
          <a
            href={`/${locale}/admin`}
            className="text-amber-600 dark:text-amber-400 hover:underline"
          >
            Dashboard
          </a>
          <a
            href={`/${locale}/admin/fetched`}
            className="text-amber-600 dark:text-amber-400 hover:underline"
          >
            Fetched
          </a>
          <a
            href={`/${locale}/admin/users`}
            className="text-amber-600 dark:text-amber-400 hover:underline"
          >
            Users
          </a>
        </div>
      </div>
      {children}
    </div>
  );
}
