import { Info as InfoIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useTranslations } from "next-intl";
function Info() {
  const t = useTranslations();
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <InfoIcon className="mr-2 h-5 w-5" />
            {t("write.info")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{t("write.text.paragraph1")}</p>
          <p className="mb-4">{t("write.text.paragraph2")}</p>
          <ul className="list-disc list-inside max-h-44 overflow-y-scroll flex gap-4 flex-col">
            <li>
              {t("write.text.items.title.label")}
              <div className="bg-secondary px-2 py-1 rounded-md">
                <code> {t("write.text.items.title.example")}</code>
              </div>
            </li>
            <li>
              {t("write.text.items.subtitle.label")}
              <div className="bg-secondary px-2 py-1 rounded-md">
                <code> {t("write.text.items.subtitle.example")}</code>
              </div>
            </li>
            <li>
              {t("write.text.items.italic.label")}
              <div className="bg-secondary px-2 py-1 rounded-md">
                <code> {t("write.text.items.italic.example")}</code>
              </div>
            </li>
            <li>
              {t("write.text.items.bold.label")}
              <div className="bg-secondary px-2 py-1 rounded-md">
                <code> {t("write.text.items.bold.example")}</code>
              </div>
            </li>
            <li>
              {t("write.text.items.quote.label")}
              <div className="bg-secondary px-2 py-1 rounded-md">
                <code> {t("write.text.items.quote.example")}</code>
              </div>
            </li>
            <li>
              {t("write.text.items.image.label")}
              <div className="bg-secondary px-2 py-1 rounded-md">
                <code> {t("write.text.items.image.example")}</code>
              </div>
            </li>
            <li>
              {t("write.text.items.unorderedList.label")}
              <div className="bg-secondary px-2 py-1 rounded-md">
                <code> {t("write.text.items.unorderedList.example")}</code>
              </div>
            </li>
            <li>
              {t("write.text.items.orderedList.label")}
              <div className="bg-secondary px-2 py-1 rounded-md">
                <code> {t("write.text.items.orderedList.example")}</code>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default Info;
