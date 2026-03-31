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
      items: ["PPS Number申请", "IRP居留许可", "银行开户", "手机卡办理", "租房"],
    },
    {
      key: "housing",
      icon: Home,
      color: "blue",
      items: ["Daft.ie租房", "租房合同须知", "押金与RTB注册", "HAP住房补贴"],
    },
    {
      key: "banking",
      icon: Landmark,
      color: "green",
      items: ["AIB/BOI/Revolut对比", "IBAN账户", "信用记录建设", "国际汇款"],
    },
    {
      key: "driving",
      icon: Car,
      color: "orange",
      items: ["驾照理论考试", "路考技巧", "NCT车检", "保险选择"],
    },
    {
      key: "healthcare",
      icon: HeartPulse,
      color: "pink",
      items: ["GP注册", "医疗卡申请", "公立/私立医院", "急诊流程"],
    },
    {
      key: "education",
      icon: GraduationCap,
      color: "purple",
      items: ["公立学校入学", "都柏林中文学校", "CAO大学申请", "语言课程"],
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
