import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🥢</span>
              <span className="text-xl font-bold text-white">筷道 KuaiDao</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t("footer.aboutText")}
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2 text-sm">
              {(["restaurants", "groceries", "services", "events", "guide"] as const).map((key) => (
                <li key={key}>
                  <Link href={`/${key}`} className="hover:text-red-400 transition-colors">
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📧 hello@kuaidao.app</li>
              <li>💬 WeChat: KuaiDaoApp</li>
              <li>📱 小红书: @筷道</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
}
