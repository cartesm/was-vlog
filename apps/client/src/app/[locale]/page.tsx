"use client";
import { useTranslations } from "next-intl";
export default function Page() {
  const t = useTranslations("header");
  return (
    <section className="bg-red-200 dark:bg-indigo-600">
      Page {t("signIn")}
    </section>
  );
}
