import { getTranslations, setRequestLocale } from "next-intl/server";
import { VoidPageTitle } from "@/components/ui/VoidPageTitle";
import { VoidPanel } from "@/components/ui/VoidPanel";
import { Shield, Heart, Globe, Cpu } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const values = [
    { icon: Shield, text: t("privacy") },
    { icon: Globe, text: t("security") },
    { icon: Heart, text: t("social") },
    { icon: Cpu, text: t("hardware") },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <VoidPageTitle>{t("title")}</VoidPageTitle>

      <VoidPanel title={t("mission")} className="mt-10">
        <p className="leading-relaxed text-void-muted">{t("missionText")}</p>
      </VoidPanel>

      <VoidPanel title={t("values")} className="mt-6">
        <ul className="space-y-4">
          {values.map(({ icon: Icon, text }) => (
            <li key={text} className="flex gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-void-green" />
              <span className="text-sm leading-relaxed text-void-text">{text}</span>
            </li>
          ))}
        </ul>
      </VoidPanel>
    </div>
  );
}
