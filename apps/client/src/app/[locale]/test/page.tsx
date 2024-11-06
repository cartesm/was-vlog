import React from "react";
import { useTranslations } from "next-intl";
function Page() {
  const t = useTranslations();
  return <section>{t("test")}</section>;
}

export default Page;
