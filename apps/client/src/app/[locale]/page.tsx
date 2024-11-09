"use client";
import { useTranslations } from "next-intl";
export default function Page() {
  const t = useTranslations("header");
  return <section className="">Page {t("signIn")}</section>;
}
