import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import {
  FileText,
  Home,
  Landmark,
  Car,
  HeartPulse,
  GraduationCap,
  ChevronRight,
} from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function GuidePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <GuideContent />;
}

function GuideContent() {
  const t = useTranslations();

  const sections = [
    {
      key: "essentials",
      icon: FileText,
      color: "red",
      items: ["SSN申请", "州ID/驾照", "银行开户", "手机卡", "租房"],
    },
    {
      key: "housing",
      icon: Home,
      color: "blue",
      items: ["租房网站推荐", "租房合同须知", "押金与信用检查", "买房流程"],
    },
    {
      key: "banking",
      icon: Landmark,
      color: "green",
      items: ["主流银行对比", "信用卡推荐", "信用分建设", "转账与汇款"],
    },
    {
      key: "driving",
      icon: Car,
      color: "orange",
      items: ["笔试准备", "路考技巧", "保险选择", "买车指南"],
    },
    {
      key: "healthcare",
      icon: HeartPulse,
      color: "pink",
      items: ["医疗保险类型", "看病流程", "中文诊所推荐", "急诊须知"],
    },
    {
      key: "education",
      icon: GraduationCap,
      color: "purple",
      items: ["公立学校入学", "中文学校", "课后班推荐", "大学申请"],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">{t("guide.title")}</h1>
        <p className="mt-2 text-gray-500">{t("guide.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div
            key={section.key}
            className="bg-white rounded-2xl border border-gray-100 hover:border-red-200 hover:shadow-lg transition-all p-6 group cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2.5 rounded-xl bg-${section.color}-50`}>
                <section.icon size={22} className={`text-${section.color}-500`} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t(`guide.sections.${section.key}`)}
              </h2>
            </div>

            <ul className="space-y-2">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  <ChevronRight size={14} className="text-gray-300" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
